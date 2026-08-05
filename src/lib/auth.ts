import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";

function cleanEnv(value?: string) {
  return value?.trim().replace(/^["']|["']$/g, "") || "";
}

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

        const secret = cleanEnv(process.env.NEXTAUTH_SECRET);
        if (!secret) {
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
        const adminEmail = cleanEnv(process.env.ADMIN_EMAIL).toLowerCase();
        const adminPassword = cleanEnv(process.env.ADMIN_PASSWORD);

        let user = await User.findOne({ email });

        if (!user) {
          if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
            const hashed = await bcrypt.hash(adminPassword, 12);
            user = await User.create({
              email: adminEmail,
              password: hashed,
              name: "Shees Khan",
              role: "admin",
            });
            console.log("[auth] Admin user bootstrapped:", adminEmail);
          } else {
            console.warn("[auth] Bootstrap failed", {
              email,
              adminEmailSet: Boolean(adminEmail),
              passwordMatch: adminPassword ? password === adminPassword : false,
            });
            return null;
          }
        } else {
          let valid = await bcrypt.compare(password, user.password);

          if (
            !valid &&
            adminEmail &&
            adminPassword &&
            email === adminEmail &&
            password === adminPassword
          ) {
            user.password = await bcrypt.hash(adminPassword, 12);
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
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
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
  secret: cleanEnv(process.env.NEXTAUTH_SECRET) || process.env.NEXTAUTH_SECRET,
};
