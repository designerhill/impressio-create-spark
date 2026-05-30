import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  theme: string;
  email_notifications: boolean;
  marketing_emails: boolean;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!error) setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (patch: Partial<Profile>) => {
    if (!user) return { error: new Error("Not authenticated") };
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();
    if (!error && data) setProfile(data as Profile);
    return { data, error };
  };

  return { profile, loading, refresh: fetchProfile, updateProfile };
};