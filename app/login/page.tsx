"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { routeAfterLogin } from "@/src/lib/workplaces";
import { createClient } from "@/src/utils/supabase/client";

const PUPIL_MOVE_MS = 2500;

const IRIS = {
  left: { cx: "31.8%", cy: "42%", diameter: "7.8%" },
  right: { cx: "66.5%", cy: "42%", diameter: "9.4%" },
} as const;

const PUPIL_BASE_PCT = 36;

function computePupilPct(pupilScale: number, pupilExtraMul: number) {
  return PUPIL_BASE_PCT * pupilScale * pupilExtraMul;
}

/** Uniform tilfældig position så pupillens centrum altid ligger inde i iris-cirklen */
function randomPupilOffsetInDisk(pupilPctOfIris: number): { dx: number; dy: number } {
  const halfPupil = pupilPctOfIris / 2;
  const maxR = 50 - halfPupil;
  if (maxR <= 0) return { dx: 0, dy: 0 };
  const angle = Math.random() * 2 * Math.PI;
  const u = Math.random();
  const r = Math.sqrt(u) * maxR;
  return { dx: r * Math.cos(angle), dy: r * Math.sin(angle) };
}

const PUPIL_LEFT = computePupilPct(1, 1.3);
const PUPIL_RIGHT = computePupilPct(2, 1);

const LOGO_IMG_PROPS = {
  src: "/ShiftBob-logo-90-dark-eyes.png",
  alt: "",
  width: 512,
  height: 512,
  className: "relative z-0 h-full w-full object-contain",
  decoding: "async" as const,
  /** Undgår hydration-advarsel når browser/Next tilføjer `fetchpriority` kun på én side */
  suppressHydrationWarning: true,
};

function ShiftBobLogoWithPupils() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="relative mx-auto mb-4 aspect-square w-20 shrink-0"
        role="img"
        aria-label="ShiftBob"
      >
        <img {...LOGO_IMG_PROPS} />
      </div>
    );
  }

  return <ShiftBobLogoAnimated />;
}

function ShiftBobLogoAnimated() {
  const [left, setLeft] = useState({ dx: 0, dy: 0 });
  const [right, setRight] = useState({ dx: 0, dy: 0 });

  useEffect(() => {
    const tick = () => {
      setLeft(randomPupilOffsetInDisk(PUPIL_LEFT));
      setRight(randomPupilOffsetInDisk(PUPIL_RIGHT));
    };
    tick();
    const id = setInterval(tick, PUPIL_MOVE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative mx-auto mb-4 aspect-square w-20 shrink-0"
      role="img"
      aria-label="ShiftBob"
    >
      <img {...LOGO_IMG_PROPS} />
      <IrisPupil iris={IRIS.left} offset={left} pupilPctValue={PUPIL_LEFT} />
      <IrisPupil iris={IRIS.right} offset={right} pupilPctValue={PUPIL_RIGHT} />
    </div>
  );
}

function IrisPupil({
  iris,
  offset,
  pupilPctValue,
}: {
  iris: { cx: string; cy: string; diameter: string };
  offset: { dx: number; dy: number };
  pupilPctValue: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 overflow-hidden bg-transparent"
      style={{
        left: iris.cx,
        top: iris.cy,
        width: iris.diameter,
        height: iris.diameter,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="absolute rounded-full bg-black"
        style={{
          width: `${pupilPctValue}%`,
          height: `${pupilPctValue}%`,
          left: `${50 + offset.dx}%`,
          top: `${50 + offset.dy}%`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.45s ease-out, top 0.45s ease-out",
        }}
      />
    </div>
  );
}

type MessageState =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const [loading, setLoading] = useState<"signin" | "signup" | null>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(
    null
  );

  const supabase = useMemo(() => createClient(), []);

  const busy = loading !== null || oauthLoading !== null;

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setMessage({
        kind: "error",
        text: "Kunne ikke logge ind med den valgte konto. Prøv igen.",
      });
    }
  }, [searchParams]);

  async function handleOAuth(provider: "google" | "facebook") {
    setMessage(null);
    setOauthLoading(provider);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/select-workplace`,
        },
      });
      if (error) {
        setMessage({ kind: "error", text: error.message });
        setOauthLoading(null);
        return;
      }
      // Ved succes redirecter @supabase/auth-js selv (window.location.assign). Hvis url alligevel mangler:
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        setOauthLoading(null);
      }
    } catch (e) {
      const text =
        e instanceof Error
          ? e.message
          : "Kunne ikke starte login. Tjek netværk og prøv igen.";
      setMessage({ kind: "error", text });
      setOauthLoading(null);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading("signin");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setLoading(null);
      setMessage({ kind: "error", text: error.message });
      return;
    }

    const result = await routeAfterLogin(supabase, router);
    setLoading(null);

    if (result === "no_workplaces") {
      setMessage({
        kind: "error",
        text: "Du er ikke tilknyttet nogen arbejdsplads. Kontakt en administrator.",
      });
      await supabase.auth.signOut();
      return;
    }
    if (result === "no_roles") {
      setMessage({
        kind: "error",
        text: "Ingen roller for den valgte arbejdsplads. Kontakt en administrator.",
      });
      await supabase.auth.signOut();
      return;
    }
    if (result === "fetch_error") {
      setMessage({
        kind: "error",
        text: "Kunne ikke hente dine arbejdspladser eller roller. Prøv igen.",
      });
      return;
    }
  }

  async function handleSignUp() {
    setMessage(null);
    setLoading("signup");
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(null);
    if (error) {
      setMessage({ kind: "error", text: error.message });
      return;
    }
    setMessage({
      kind: "success",
      text:
        "Konto oprettet. Tjek din e-mail, hvis bekræftelse er påkrævet, før du kan logge ind.",
    });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <ShiftBobLogoWithPupils />
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            ShiftBob Login
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Brug din e-mail og adgangskode for at fortsætte.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={busy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
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
              {oauthLoading === "google" ? "Viderestiller…" : "Fortsæt med Google"}
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
                ? "Viderestiller…"
                : "Fortsæt med Facebook"}
            </button>
          </div>

          <div className="relative my-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden
            >
              <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                eller med e-mail
              </span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none ring-zinc-400 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300/20"
                placeholder="dig@eksempel.dk"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Adgangskode
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none ring-zinc-400 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300/20"
                placeholder="••••••••"
              />
            </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-zinc-100"
            >
              {loading === "signin" ? "Logger ind…" : "Log ind"}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={busy}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-500"
            >
              {loading === "signup" ? "Opretter…" : "Opret ny bruger"}
            </button>
          </div>
          </form>
        </div>

        {message && (
          <div
            role="alert"
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              message.kind === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-100"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/"
            className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Tilbage til forsiden
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
