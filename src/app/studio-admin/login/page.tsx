"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Logo from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: "/studio-admin",
    });

    setLoading(false);

    if (result?.error) {
      setError(
        result.error === "Configuration"
          ? "Server auth is not configured. On Vercel set NEXTAUTH_SECRET and NEXTAUTH_URL (no trailing slash), then Redeploy."
          : "Invalid credentials. Use the exact ADMIN_EMAIL / ADMIN_PASSWORD from Vercel Environment Variables."
      );
      return;
    }

    // Hard navigation so the session cookie is always picked up by middleware
    window.location.assign(result?.url || "/studio-admin");
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
          <label className="label-luxury mb-2 block" htmlFor="admin-password">
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-espresso/45 transition-colors hover:text-espresso"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
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

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-10-8-10-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}
