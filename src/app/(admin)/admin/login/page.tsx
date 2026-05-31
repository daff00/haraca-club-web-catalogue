"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-display text-4xl font-medium text-[var(--color-bg)] text-center mb-1">
          Haraca
        </p>
        <p className="text-center text-[var(--color-accent)] text-sm font-sans mb-8">
          Admin Panel
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-surface)] p-8 rounded-card flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-[var(--color-text)]">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-[var(--color-text)]">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
            />
          </div>
          {error && (
            <p className="text-red-600 text-xs font-sans">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[var(--color-text)] text-[var(--color-bg)] py-2.5 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
