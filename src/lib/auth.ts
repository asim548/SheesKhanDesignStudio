import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (!process.env.NEXTAUTH_SECRET) {
          console.error("[auth] NEXTAUTH_SECRET is not set");
          return null;
        }

        try {
          await connectDB();
        } catch (error) {
          console.error("[auth] MongoDB connection failed", error);
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        let user = await User.findOne({ email });

        // Bootstrap admin from env if this account does not exist yet
        if (!user) {
          if (
            adminEmail &&
            adminPassword &&
            email === adminEmail &&
            password === adminPassword
          ) {
            const hashed = await bcrypt.hash(adminPassword, 12);
            user = await User.create({
              email: adminEmail,
              password: hashed,
              name: "Shees Khan",
              role: "admin",
            });
            console.log("[auth] Admin user bootstrapped:", adminEmail);
          } else {
            console.warn("[auth] No user found and bootstrap did not match", {
              email,
              hasAdminEmail: Boolean(adminEmail),
              hasAdminPassword: Boolean(adminPassword),
            });
            return null;
          }
        } else {
          let valid = await bcrypt.compare(password, user.password);

          // If env credentials match, resync password hash (fixes prod drift)
          if (
            !valid &&
            adminEmail &&
            adminPassword &&
            email === adminEmail &&
            password === adminPassword
          ) {
            const hashed = await bcrypt.hash(adminPassword, 12);
            user.password = hashed;
            await user.save();
            valid = true;
            console.log("[auth] Admin password resynced from env");
          }

          if (!valid) {
            console.warn("[auth] Invalid password for", email);
            return null;
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/studio-admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
