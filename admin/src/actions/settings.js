'use server';

import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(data) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  await connectMongo();
  await User.findByIdAndUpdate(session.user.id, {
    name: data.name,
    image: data.image
  });
  
  revalidatePath('/');
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