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

        await connectDB();

        let user = await User.findOne({ email: credentials.email.toLowerCase() });

        // Bootstrap admin from env if no users exist
        if (!user) {
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (
            adminEmail &&
            adminPassword &&
            credentials.email.toLowerCase() === adminEmail &&
            credentials.password === adminPassword
          ) {
            const hashed = await bcrypt.hash(adminPassword, 12);
            user = await User.create({
              email: adminEmail,
              password: hashed,
              name: "Shees Khan",
              role: "admin",
            });
          } else {
            return null;
          }
        } else {
          const valid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!valid) return null;
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
