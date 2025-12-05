'use server';

import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email"; // Ensure you have this utility from previous steps

export async function getUsers(query = "", role = "") {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  await connectMongo();
  
  const filter = {};
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ];
  }
  if (role && role !== "all") filter.role = role;

  // Exclude current admin from list to prevent self-ban/delete
  filter._id = { $ne: session.user.id };

  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  return { success: true, users: JSON.parse(JSON.stringify(users)) };
}

export async function createUser(formData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return { error: "Unauthorized" };

  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  
  // Generate temp password
  const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await connectMongo();
  
  try {
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      forcePasswordChange: true,
      isBanned: false
    });

    // Send Credentials via Email
    await sendEmail({
      to: email,
      subject: "Your Admin Portal Credentials",
      html: `<p>Login with: <b>${email}</b> / <b>${tempPassword}</b></p>`
    });

    revalidatePath('/dashboard/users');
    return { success: true, credentials: { email, password: tempPassword } };
  } catch (e) {
    return { error: "Email already exists or invalid data." };
  }
}

export async function toggleBanUser(userId, status) {
  await connectMongo();
  await User.findByIdAndUpdate(userId, { isBanned: status });
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function deleteUser(userId) {
  await connectMongo();
  await User.findByIdAndDelete(userId);
  revalidatePath('/dashboard/users');
  return { success: true };
}