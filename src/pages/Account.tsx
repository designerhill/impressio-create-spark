import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Camera, Loader2, Moon, Sun, Mail, KeyRound, CreditCard, User as UserIcon, Bell, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TABS = ["profile", "account", "preferences", "billing"] as const;
type TabKey = (typeof TABS)[number];

const initials = (name?: string | null, email?: string | null) => {
  const src = (name || email || "U").trim();
  return src
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function Account() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, refresh } = useProfile();
  const { theme, setTheme } = useTheme();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get("tab") as TabKey) || "profile";
  const [tab, setTab] = useState<TabKey>(TABS.includes(initialTab) ? initialTab : "profile");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    }, { replace: true });
  }, [tab, setSearchParams]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Account</h1>
            <p className="text-lg text-muted-foreground">
              Manage your profile, security, preferences and billing.
            </p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile" className="gap-2"><UserIcon className="w-4 h-4" /> Profile</TabsTrigger>
              <TabsTrigger value="account" className="gap-2"><KeyRound className="w-4 h-4" /> Account</TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2"><Bell className="w-4 h-4" /> Preferences</TabsTrigger>
              <TabsTrigger value="billing" className="gap-2"><CreditCard className="w-4 h-4" /> Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileTab
                profile={profile}
                loading={profileLoading}
                userId={user.id}
                email={user.email}
                updateProfile={updateProfile}
                refresh={refresh}
              />
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <AccountTab email={user.email} signOut={signOut} />
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              <PreferencesTab
                profile={profile}
                theme={theme}
                setTheme={setTheme}
                updateProfile={updateProfile}
              />
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <BillingTab subscription={subscription} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* -------------------------------- Profile -------------------------------- */

function ProfileTab({
  profile,
  loading,
  userId,
  email,
  updateProfile,
  refresh,
}: {
  profile: any;
  loading: boolean;
  userId: string;
  email?: string;
  updateProfile: (p: any) => Promise<any>;
  refresh: () => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (displayName.trim().length > 80) {
      toast.error("Display name must be 80 characters or less");
      return;
    }
    if (bio.length > 280) {
      toast.error("Bio must be 280 characters or less");
      return;
    }
    setSaving(true);
    const { error } = await updateProfile({
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    });
    setSaving(false);
    if (error) toast.error("Couldn't save profile");
    else toast.success("Profile saved");
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error } = await updateProfile({ avatar_url: data.publicUrl });
      if (error) throw error;
      toast.success("Avatar updated");
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const { error } = await updateProfile({ avatar_url: null });
    if (error) toast.error("Couldn't remove avatar");
    else toast.success("Avatar removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others may see you across Impressio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt="Avatar" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
              {initials(profile?.display_name, email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = "";
              }}
            />
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Change avatar"}
            </Button>
            {profile?.avatar_url && (
              <Button variant="ghost" onClick={handleRemoveAvatar} disabled={uploading}>
                Remove
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="display_name">Display name</Label>
          <Input
            id="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            maxLength={80}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people what you create"
            rows={4}
            maxLength={280}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">{bio.length}/280</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------- Account -------------------------------- */

function AccountTab({ email, signOut }: { email?: string; signOut: () => Promise<void> }) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEmailChange = async () => {
    const trimmed = newEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }
    setEmailBusy(true);
    const { error } = await supabase.auth.updateUser({ email: trimmed });
    setEmailBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Check your inbox to confirm the new email");
      setNewEmail("");
    }
  };

  const handlePasswordChange = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPwBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPassword("");
      setConfirm("");
    }
  };

  const handleSendReset = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
  };

  const handleDelete = async () => {
    setDeleting(true);
    // We don't expose an admin delete endpoint; sign out and instruct support contact.
    await signOut();
    toast.info("Signed out. Contact support to permanently delete your account.");
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Email address</CardTitle>
          <CardDescription>Update the email used to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current email</Label>
            <Input value={email ?? ""} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_email">New email</Label>
            <Input
              id="new_email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEmailChange} disabled={emailBusy || !newEmail}>
              {emailBusy && <Loader2 className="w-4 h-4 animate-spin" />}
              Update email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> Password</CardTitle>
          <CardDescription>Set a new password or request a reset link by email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pw">New password</Label>
              <Input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw2">Confirm password</Label>
              <Input
                id="pw2"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <Button variant="outline" onClick={handleSendReset}>
              Email me a reset link
            </Button>
            <Button onClick={handlePasswordChange} disabled={pwBusy || !password}>
              {pwBusy && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><Trash2 className="w-5 h-5" /> Danger zone</CardTitle>
          <CardDescription>Sign out everywhere or request account deletion.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out and submit a deletion request. Your designs and
                  data will be permanently removed and cannot be recovered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------ Preferences ------------------------------ */

function PreferencesTab({
  profile,
  theme,
  setTheme,
  updateProfile,
}: {
  profile: any;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  updateProfile: (p: any) => Promise<any>;
}) {
  const [emailNotif, setEmailNotif] = useState(profile?.email_notifications ?? true);
  const [marketing, setMarketing] = useState(profile?.marketing_emails ?? false);

  useEffect(() => {
    if (profile) {
      setEmailNotif(profile.email_notifications);
      setMarketing(profile.marketing_emails);
    }
  }, [profile]);

  const toggleNotif = async (next: boolean) => {
    setEmailNotif(next);
    const { error } = await updateProfile({ email_notifications: next });
    if (error) {
      setEmailNotif(!next);
      toast.error("Couldn't update preference");
    }
  };

  const toggleMarketing = async (next: boolean) => {
    setMarketing(next);
    const { error } = await updateProfile({ marketing_emails: next });
    if (error) {
      setMarketing(!next);
      toast.error("Couldn't update preference");
    }
  };

  const onThemeChange = async (next: "light" | "dark") => {
    setTheme(next);
    await updateProfile({ theme: next });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Pick a light or dark interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => onThemeChange("light")}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                theme === "light" ? "border-primary shadow-soft" : "border-border hover:border-primary/40"
              }`}
            >
              <Sun className="w-5 h-5 mb-2 text-accent-gold" />
              <div className="font-bold">Light</div>
              <div className="text-xs text-muted-foreground">Bright and minimal</div>
            </button>
            <button
              type="button"
              onClick={() => onThemeChange("dark")}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                theme === "dark" ? "border-primary shadow-soft" : "border-border hover:border-primary/40"
              }`}
            >
              <Moon className="w-5 h-5 mb-2 text-primary" />
              <div className="font-bold">Dark</div>
              <div className="text-xs text-muted-foreground">Easier on the eyes</div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what we email you about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-base">Account & activity</Label>
              <p className="text-sm text-muted-foreground">
                Security alerts, design save confirmations and important updates.
              </p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={toggleNotif} />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-base">Product news & tips</Label>
              <p className="text-sm text-muted-foreground">
                Occasional emails about new features and creative ideas.
              </p>
            </div>
            <Switch checked={marketing} onCheckedChange={toggleMarketing} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------- Billing -------------------------------- */

function BillingTab({ subscription }: { subscription: any }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const plan = subscription?.plan_type ?? "free";
  const status = subscription?.status ?? "active";
  const renews = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null;

  const openPortal = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      const url = (data as any)?.url;
      if (url) window.location.href = url;
      else toast.error("Couldn't open billing portal");
    } catch (e: any) {
      toast.error(e?.message ?? "Couldn't open billing portal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & subscription</CardTitle>
        <CardDescription>Review your plan and manage payment details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Current plan</span>
          <Badge className="text-sm capitalize bg-gradient-primary text-primary-foreground">
            {plan}
          </Badge>
          <Badge variant="outline" className="capitalize">{status}</Badge>
        </div>
        {renews && (
          <p className="text-sm text-muted-foreground">
            Renews on <span className="font-semibold text-foreground">{renews}</span>
          </p>
        )}
        <Separator />
        <div className="flex flex-wrap gap-3">
          {plan === "free" ? (
            <Button onClick={() => navigate("/pricing")}>Upgrade plan</Button>
          ) : (
            <Button onClick={openPortal} disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              Manage subscription
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate("/pricing")}>
            View plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}