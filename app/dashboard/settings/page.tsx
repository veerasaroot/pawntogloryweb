"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import { UserAvatar } from "@/components/UserAvatar";
import { Save, LogOut, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export default function UserSettingsPage() {
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

    const { data } = await supabase
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <UserAvatar
              name={profile?.full_name || profile?.username}
              avatarUrl={profile?.avatar_url}
              size="xl"
            />
            <div>
              <h2 className="text-xl font-bold">
                {profile?.full_name || profile?.username || "Your Profile"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <User className="w-3 h-3" />
                  Regular User
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Profile Picture
              </label>
              <ImageUpload onUpload={setAvatarUrl} defaultImage={avatarUrl} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30"
                    : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-xl font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 shadow-lg shadow-foreground/10"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg">Account Access</h3>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="font-bold text-sm">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full border-2 border-red-100 text-red-600 py-4 rounded-xl font-bold hover:bg-red-50 dark:border-red-900/20 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
