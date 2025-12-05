import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongo } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate Limiter: 10 requests per 60s
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

export const authOptions = {
  // Only Credentials Provider remains
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Rate Limit Check
        const { success } = await ratelimit.limit(`login_${credentials.email}`);
        if (!success) throw new Error("Too many attempts. Try again later.");

        await connectMongo();
        
        // 2. Find Admin User
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user || !user.password) return null;

        // 3. Verify Password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // 4. Strict Admin Check
        if (user.role !== 'admin') throw new Error("Access Denied: Admins Only");

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString();
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};