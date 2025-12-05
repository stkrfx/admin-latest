'use server';

import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Helper to check auth
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') throw new Error("Unauthorized");
  return session;
}

export async function getUsers() {
  await checkAuth();
  await connectMongo();
  const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function getAdmins() {
  const session = await checkAuth();
  await connectMongo();
  // Exclude self
  const admins = await User.find({ role: 'admin', _id: { $ne: session.user.id } }).lean();
  return JSON.parse(JSON.stringify(admins));
}

export async function createUser(data) {
  await checkAuth();
  await connectMongo();
  
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  try {
    await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });
    revalidatePath('/users');
    revalidatePath('/admins');
    return { success: true };
  } catch (e) {
    return { error: e.message }; // Likely duplicate email
  }
}

export async function updateUser(id, data) {
  await checkAuth();
  await connectMongo();
  await User.findByIdAndUpdate(id, data);
  revalidatePath('/users');
  revalidatePath('/admins');
  return { success: true };
}

export async function deleteUser(id) {
  await checkAuth();
  await connectMongo();
  await User.findByIdAndDelete(id);
  revalidatePath('/users');
  revalidatePath('/admins');
  return { success: true };
}