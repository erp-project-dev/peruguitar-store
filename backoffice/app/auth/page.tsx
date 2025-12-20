"use client";

import { useState } from "react";
import { StoreClient } from "../common/store.client";
import { StoreCommand } from "../api/store/store.command";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const storeClient = new StoreClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      await storeClient.execute(StoreCommand.AuthSignIn, {
        email: email.trim(),
        password,
      });

      localStorage.clear();

      router.replace("/");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-neutral-900">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
