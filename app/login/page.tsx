"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace(redirectTo);
      } else {
        setCheckingSession(false);
      }
    });
  }, [router, redirectTo]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      setLoading(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setLoading(false);
    setInfo("Account created — check your email to confirm it, then log in.");
    switchMode("login");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setInfo("If that email has an account, a password reset link is on its way.");
  };

  if (checkingSession) {
    return <div className="min-h-screen bg-obsidian" />;
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p className="font-display text-3xl text-ivory mb-2">
          {mode === "login" && "Member Login"}
          {mode === "signup" && "Join BS4F"}
          {mode === "forgot" && "Reset Password"}
        </p>
        <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-10">
          BS4F Editorials
        </p>

        {info && (
          <p className="text-ivory/70 text-sm font-sans mb-6 border border-white/10 bg-white/5 px-4 py-3">
            {info}
          </p>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-white/15 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
                placeholder="you@bocconi.it"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-charcoal border ${error ? "border-ember" : "border-white/15"} text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors`}
                placeholder="Enter password"
                required
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-ember text-xs font-sans"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ember hover:bg-ember-light disabled:opacity-50 text-ivory py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="block w-full text-center text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors pt-1"
            >
              Forgot password?
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-charcoal border border-white/15 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Your name"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-white/15 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
                placeholder="you@bocconi.it"
                required
              />
            </div>
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal border border-white/15 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-charcoal border ${error ? "border-ember" : "border-white/15"} text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors`}
                placeholder="Re-enter password"
                required
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-ember text-xs font-sans"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ember hover:bg-ember-light disabled:opacity-50 text-ivory py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-white/15 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
                placeholder="you@bocconi.it"
                autoFocus
                required
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-ember text-xs font-sans"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ember hover:bg-ember-light disabled:opacity-50 text-ivory py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col gap-2 items-center">
          {mode !== "login" && (
            <button
              onClick={() => switchMode("login")}
              className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
            >
              Already have an account? Log in
            </button>
          )}
          {mode === "login" && (
            <button
              onClick={() => switchMode("signup")}
              className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
            >
              New member? Sign up
            </button>
          )}
        </div>

        <a
          href="/about/board"
          className="block mt-8 text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
        >
          ← Back to Members
        </a>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <LoginForm />
    </Suspense>
  );
}
