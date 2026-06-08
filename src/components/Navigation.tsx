import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  CreditCard,
  Settings,
  LayoutGrid,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Features", href: "/features" },
    { name: "Templates", href: "/templates" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  const displayName =
    profile?.display_name || user?.email?.split("@")[0] || "Account";
  const avatarFallback = (profile?.display_name || user?.email || "U")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black text-foreground">Impressio</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors font-semibold"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-accent transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold max-w-[140px] truncate">{displayName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-bold">{displayName}</span>
                    <span className="text-xs text-muted-foreground font-normal truncate">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account?tab=profile")}>
                    <UserIcon className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-designs")}>
                    <LayoutGrid className="w-4 h-4 mr-2" /> My Designs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account?tab=account")}>
                    <Settings className="w-4 h-4 mr-2" /> Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account?tab=preferences")}>
                    <Bell className="w-4 h-4 mr-2" /> Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account?tab=billing")}>
                    <CreditCard className="w-4 h-4 mr-2" /> Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 mr-2" />
                    ) : (
                      <Moon className="w-4 h-4 mr-2" />
                    )}
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="font-semibold">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="default" asChild className="font-bold">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-foreground hover:text-primary transition-colors font-semibold px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 px-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={profile?.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-bold truncate">{displayName}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      </div>
                    </div>
                    <Link
                      to="/account"
                      className="px-2 py-2 font-semibold hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Account
                    </Link>
                    <Link
                      to="/my-designs"
                      className="px-2 py-2 font-semibold hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Designs
                    </Link>
                    <Button variant="ghost" onClick={signOut} className="w-full font-semibold">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full font-semibold">
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button variant="default" asChild className="w-full font-bold">
                      <Link to="/auth">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};