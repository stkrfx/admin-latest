'use server';

import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// --- NEW FUNCTION ---
export async function getMyProfile() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongo();
  const user = await User.findById(session.user.id).select("-password").lean();
  
  if (!user) return null;

  // Convert _id and dates to string
  return JSON.parse(JSON.stringify(user));
}

export async function updateProfile(data) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  await connectMongo();
  
  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.image) updateData.image = data.image;

  await User.findByIdAndUpdate(session.user.id, updateData);
  
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function changePassword(currentPassword, newPassword) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  await connectMongo();
  const user = await User.findById(session.user.id).select("+password");

  if (!user.password) return { error: "You use Google Login. Cannot change password." };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Incorrect current password" };

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { success: true };
}