"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { updateProfile, changePassword, getMyProfile } from "@/actions/settings";
import { UploadButton } from "@uploadthing/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();

  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // ---------------------
  // Fetch Fresh User Data
  // ---------------------
  useEffect(() => {
    async function load() {
      if (session?.user?.id) {
        const data = await getMyProfile(); // Action on server
        setUser(data);
        setLoadingPage(false);
      }
    }
    load();
  }, [session]);

  if (status === "loading" || loadingPage) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!session) return <div>Unauthorized</div>;

  // ---------------------
  // Update Profile Info
  // ---------------------
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    const formData = new FormData(e.target);
    const newName = formData.get("name");

    const res = await updateProfile({
      name: newName,
      image: user.image,
    });

    if (res.success) {
      // Update UI + Session
      setUser((prev) => ({ ...prev, name: newName }));
      await update({ name: newName });

      toast.success("Profile updated");
    } else {
      toast.error("Update failed");
    }

    setSavingProfile(false);
  };

  // ---------------------
  // Password Change
  // ---------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const res = await changePassword(formData.get("current"), formData.get("new"));

    if (res.success) {
      toast.success("Password changed successfully");
      e.target.reset();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.image || "/placeholder.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full border object-cover"
            />

            <div className="space-y-1">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                  const url = res[0].url;

                  await updateProfile({ image: url });
                  await update({ image: url });

                  setUser((prev) => ({ ...prev, image: url }));

                  toast.success("Photo updated");
                }}
                onUploadError={() => toast.error("Upload failed")}
              />

              <p className="text-xs text-slate-500">Max 4MB. JPG, PNG.</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="name" defaultValue={user?.name} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email} disabled className="bg-slate-50" />
            </div>

            <Button type="submit" disabled={savingProfile} className="bg-slate-900">
              {savingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Ensure your account stays secure.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input name="current" type="password" placeholder="Current Password" required />
            <Input name="new" type="password" placeholder="New Password" required />
            <Button type="submit" variant="outline">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
