"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_DOMAIN } from "@/lib/auth";

const ERRORS: Record<string, string> = {
  domain: `Only @${ALLOWED_DOMAIN} accounts can log in.`,
  auth: "Login failed, try again.",
};

function LoginForm() {
  const error = ERRORS[useSearchParams().get("error") ?? ""];

  const signIn = () =>
    createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { hd: ALLOWED_DOMAIN, prompt: "select_account" },
      },
    });

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Who&apos;s at the office?</h1>
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={signIn}
        className="btn-primary rounded-lg px-4 py-2"
      >
        Sign in with Google
      </button>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
