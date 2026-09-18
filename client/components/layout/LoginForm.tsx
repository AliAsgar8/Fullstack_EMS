"use client";

import { EyeIcon, EyeOffIcon, MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type LoginFormProps = {
  role: "admin" | "employee";
};

export default function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = role === "admin" ? "Admin Portal" : "Employee Portal";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  };

  return (
    <div className="auth-card">
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <MoveLeftIcon className="h-4 w-4" />
        Back to portals
      </Link>

      <h2 className="page-title mb-2">{title}</h2>
      <p className="page-subtitle mb-8">Sign in to access your account</p>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {loading && <p className="mb-4 text-sm text-slate-500">Loading...</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="label-field">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="password" className="label-field">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          Sign in
        </button>
      </form>
    </div>
  );
}
