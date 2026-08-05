"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "/dashboard";

    if (!code) {
      router.replace("/login");
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      if (exchangeError) {
        setError(exchangeError.message);
        return;
      }
      router.replace(next);
      router.refresh();
    });
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-ember font-sans text-sm mb-4">
            This link is invalid or has expired: {error}
          </p>
          <a
            href="/login"
            className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <p className="text-muted text-sm font-sans">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <CallbackHandler />
    </Suspense>
  );
}
