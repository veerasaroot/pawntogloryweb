"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import { UserAvatar } from "@/components/UserAvatar";
import { Save, LogOut, User, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        avatar_url: avatarUrl,
      })
      .eq("id", profile.id);

    if (error) {
      setMessage({
        type: "error",
        text: "Error saving profile: " + error.message,
      });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setProfile({
        ...profile,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
      });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-background border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <UserAvatar
            name={profile?.full_name}
            avatarUrl={profile?.avatar_url}
            size="xl"
          />
          <div>
            <h2 className="text-xl font-bold">
              {profile?.full_name || "Your Name"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {profile?.role === "admin" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <User className="w-3 h-3" />
                  User
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture
            </label>
            <ImageUpload onUpload={setAvatarUrl} defaultImage={avatarUrl} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-background border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-lg">Account</h3>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium">Member Since</p>
            <p className="text-sm text-muted-foreground">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full border border-red-500 text-red-500 py-3 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
