'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { updateProfile, changePassword } from "@/actions/settings";
import { UploadButton } from "@uploadthing/react"; // Assuming installed
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    const res = await updateProfile({
      name: formData.get("name"),
      image: session?.user?.image // Image handled by UploadThing separately
    });

    if (res.success) {
      await update({ name: formData.get("name") });
      toast.success("Profile updated");
    } else {
      toast.error("Update failed");
    }
    setLoading(false);
  };

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
              src={session?.user?.image || "https://via.placeholder.com/100"} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border"
            />
            <div className="space-y-1">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                  await updateProfile({ name: session.user.name, image: res[0].url });
                  await update({ image: res[0].url });
                  toast.success("Photo updated");
                }}
                onUploadError={() => toast.error("Upload failed")}
              />
              <p className="text-xs text-slate-500">Max 4MB. JPG, PNG.</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="name" defaultValue={session?.user?.name} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={session?.user?.email} disabled className="bg-slate-50" />
            </div>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
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