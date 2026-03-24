"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { routeAfterLogin } from "@/src/lib/workplaces";
import { useTranslations } from "@/src/contexts/translations-context";
import { createClient } from "@/src/utils/supabase/client";

type MessageState =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

export function LoginForm({
  emailPlaceholder,
  passwordPlaceholder,
}: {
  emailPlaceholder: string;
  passwordPlaceholder: string;
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const busy = signingIn || oauthLoading !== null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      setMessage({
        kind: "error",
        text: t(
          "login.error.oauth_failed",
          "Could not sign in with the selected account. Try again."
        ),
      });
    }
    // Mount-only: `?error=` is read once. Empty deps keep the dependency array size stable for React.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t reflects initial locale from layout
  }, []);

  async function handleOAuth(provider: "google" | "facebook") {
    setMessage(null);
    setOauthLoading(provider);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          /* Kun path — ingen `?next=` (OAuth kan give tom `next=` → redirect til `/`). Destination styres i `app/auth/callback/route.ts`. */
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setMessage({ kind: "error", text: error.message });
        setOauthLoading(null);
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        setOauthLoading(null);
      }
    } catch (e) {
      const text =
        e instanceof Error
          ? e.message
          : t(
              "login.error.network",
              "Could not start sign-in. Check your network and try again."
            );
      setMessage({ kind: "error", text });
      setOauthLoading(null);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setSigningIn(false);
      setMessage({ kind: "error", text: error.message });
      return;
    }

    const result = await routeAfterLogin(supabase, router);
    setSigningIn(false);

    if (result === "no_workplaces") {
      setMessage({
        kind: "error",
        text: t(
          "login.error.no_workplace",
          "You are not assigned to any workplace. Contact an administrator."
        ),
      });
      await supabase.auth.signOut();
      return;
    }
    if (result === "no_roles") {
      setMessage({
        kind: "error",
        text: t(
          "login.error.no_roles",
          "No roles for the selected workplace. Contact an administrator."
        ),
      });
      await supabase.auth.signOut();
      return;
    }
    if (result === "fetch_error") {
      setMessage({
        kind: "error",
        text: t(
          "login.error.fetch",
          "Could not load your workplaces or roles. Try again."
        ),
      });
      return;
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-white/25 bg-transparent p-6 shadow-none sm:p-8">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={busy}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-transparent px-4 py-2.5 text-sm font-semibold text-white shadow-none transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {oauthLoading === "google"
              ? t("login.oauth.redirecting", "Redirecting…")
              : t("login.oauth.google", "Continue with Google")}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("facebook")}
            disabled={busy}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877F2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {oauthLoading === "facebook"
              ? t("login.oauth.redirecting", "Redirecting…")
              : t("login.oauth.facebook", "Continue with Facebook")}
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <span className="w-full border-t border-white/25" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-transparent px-2 text-white/80">
              {t("login.divider.email", "or with email")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-white"
            >
              {t("login.email.label", "Email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-input w-full rounded-lg border border-[#5c5c5c] px-3 py-2.5 shadow-sm outline-none transition placeholder:text-zinc-600 focus:border-[#8f8f8f] focus:ring-2 focus:ring-zinc-500/35"
              placeholder={emailPlaceholder}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-white"
            >
              {t("login.password.label", "Password")}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-form-input w-full rounded-lg border border-[#5c5c5c] py-2.5 pl-3 pr-11 shadow-sm outline-none transition placeholder:text-zinc-600 focus:border-[#8f8f8f] focus:ring-2 focus:ring-zinc-500/35"
                placeholder={passwordPlaceholder}
              />
              <button
                type="button"
                className="absolute right-0 top-0 flex h-full min-w-11 items-center justify-center rounded-r-lg px-2 text-zinc-700 transition hover:text-zinc-900 focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-500/50"
                aria-pressed={showPassword}
                aria-label={
                  showPassword
                    ? t("login.password.hide", "Hide password")
                    : t("login.password.show", "Show password")
                }
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingIn
                ? t("login.button.submit.loading", "Logging in…")
                : t("login.button.submit", "Log in")}
            </button>
            <p className="text-center text-sm text-white">
              <Link
                href="/super-admin/workplaces/new"
                className="font-medium text-white underline underline-offset-4 transition hover:text-white/80"
              >
                {t("login.link.create_workplace", "Create workplace")}
              </Link>
            </p>
          </div>
        </form>
      </div>

      {message ? (
        <div
          role="alert"
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            message.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {message.text}
        </div>
      ) : null}
    </>
  );
}
