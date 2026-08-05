"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p className="font-display text-3xl text-ivory mb-2">Set New Password</p>
        <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-10">
          BS4F Editorials
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal border border-white/15 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
              placeholder="At least 6 characters"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Confirm New Password
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
            {loading ? "Saving…" : "Save New Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
