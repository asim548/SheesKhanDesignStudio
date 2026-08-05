"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        result.error === "Configuration"
          ? "Server auth is not configured. Check NEXTAUTH_SECRET and NEXTAUTH_URL on Vercel."
          : "Invalid credentials. Confirm ADMIN_EMAIL / ADMIN_PASSWORD on Vercel match what you type."
      );
      return;
    }

    router.push("/studio-admin");
    router.refresh();
  };

  return (
    <div className="admin-shell flex min-h-screen flex-col items-center justify-center px-6">
      <Logo size="lg" href="/studio-admin/login" className="mb-10 pointer-events-none" />
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-7">
        <div className="text-center">
          <h1 className="heading-display">Studio Access</h1>
          <p className="mt-3 font-sans text-base text-espresso/50">
            Private atelier administration
          </p>
        </div>
        <div>
          <label className="label-luxury mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label className="label-luxury mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="font-sans text-base text-espresso/70">{error}</p>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}
