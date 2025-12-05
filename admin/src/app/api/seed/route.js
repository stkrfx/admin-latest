import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongo();

    const email = "admin@mindnamo.com";
    const password = "admin123"; // Change this immediately after login!
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin user already exists.",
        email 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      forcePasswordChange: false,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully.",
      credentials: {
        email,
        password
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}