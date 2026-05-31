"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          className="bg-[var(--color-surface)] p-8 rounded-card flex flex-col gap-4 shadow-sm"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-[var(--color-text)]">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-[var(--color-text)]">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full border border-[var(--color-border)] rounded-input px-3 py-2 pr-10 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ?  <Eye size={16} /> : <EyeOff size={16} /> }
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-600 text-xs font-sans">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[var(--color-text)] text-[var(--color-bg)] py-2.5 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}