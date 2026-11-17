"use client";

import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthDemo({
  googleEnabled,
  redirectTo = "/dashboard",
  allowRegistration = true,
}: {
  googleEnabled: boolean;
  redirectTo?: "/dashboard" | "/admin";
  allowRegistration?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    try {
      const result =
        mode === "login"
          ? await authClient.signIn.email({
              email,
              password,
              callbackURL: redirectTo,
            })
          : await authClient.signUp.email({
              name: String(formData.get("name")).trim(),
              email,
              password,
              callbackURL: redirectTo,
            });

      if (result.error) {
        setError(result.error.message || "Authentication failed. Please try again.");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (authError) {
      console.error("Could not authenticate:", authError);
      setError("Authentication could not be completed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function signInWithGoogle() {
    setPending(true);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(result.error.message || "Google sign-in could not be started.");
      }
    } catch (authError) {
      console.error("Could not start Google sign-in:", authError);
      setError("Google sign-in could not be completed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-[30px] border border-border bg-white p-5 shadow-[0_18px_50px_rgba(23,23,23,0.08)] sm:p-7">
      {allowRegistration && (
        <div className="mb-6 flex rounded-full bg-[#F4F0EA] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "login" ? "bg-white text-[#171717] shadow-sm" : "text-[#777777]"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "register" ? "bg-white text-[#171717] shadow-sm" : "text-[#777777]"
            }`}
          >
            Register
          </button>
        </div>
      )}

      {googleEnabled && (
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          disabled={pending}
          className="mb-5 w-full rounded-full border border-border px-5 py-3 font-semibold transition hover:border-accent disabled:opacity-50"
        >
          Continue with Google
        </button>
      )}

      <form onSubmit={submit} className="space-y-4">
        {allowRegistration && mode === "register" && (
          <label className="block text-sm font-medium text-[#171717]">
            Full name
            <input name="name" className="form-input mt-2" autoComplete="name" required minLength={2} maxLength={100} />
          </label>
        )}

        <label className="block text-sm font-medium text-[#171717]">
          Email address
          <input name="email" className="form-input mt-2" type="email" autoComplete="email" required />
        </label>

        <label className="block text-sm font-medium text-[#171717]">
          Password
          <input
            name="password"
            className="form-input mt-2"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            required
          />
        </label>

        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F36B21] px-5 py-3 font-semibold text-white transition hover:bg-[#d85a1d] disabled:opacity-50"
        >
          {pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#F4F0EA] p-3 text-sm text-[#171717]">
        <ShieldCheck className="h-5 w-5 text-[#249B68]" />
        Secure shipment tracking and payment visibility.
      </div>

      <div className="mt-6 space-y-3 text-sm text-[#171717]">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-[#249B68]" />
          Real-time tracking notifications.
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-[#249B68]" />
          Route planning for domestic and international shipments.
        </div>
      </div>
    </div>
  );
}
