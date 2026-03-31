import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "src/api"; // if you have this helper; otherwise use fetch/axios

export default function FindPassword() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendCode = async () => {
    setErr("");
    setMsg("");

    if (!email.trim()) {
      setErr("Please enter your email.");
      return;
    }

    try {
      setSending(true);

      await api.post("/auth/password-reset/request", { email });

      setStep("code");
      setMsg("If an account exists for that email, we sent a verification code.");
      setCooldown(60);
    } catch (e) {
      setStep("code");
      setMsg("If an account exists for that email, we sent a verification code.");
      setCooldown(60);
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!code.trim()) {
      setErr("Enter the verification code.");
      return;
    }

    try {
      setVerifying(true);

      const res = await api.post("/auth/password-reset/verify", { email, code });

      setMsg("Code verified. You can reset your password now.");
      
    } catch (e) {
      setErr("Invalid or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-sm border rounded-2xl border-sky-400 text-base p-8 py-12">
      <form onSubmit={verifyCode} className="w-full">
        <input
          type="email"
          placeholder="your email"
          className="w-full border bg-slate-100 rounded-2xl border-sky-400 px-4 py-3 my-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === "code"}
        />

        {step === "code" && (
          <input
            type="text"
            placeholder="verification code"
            className="w-full border bg-slate-100 rounded-2xl border-sky-400 px-4 py-3 my-3"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        )}

        {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
        {msg && <p className="text-sm text-slate-600 mt-2">{msg}</p>}

        <div className="flex items-center justify-between mt-4">
          <Link to="/auth/find-username" className="text-indigo-500 text-sm">
            Forgot your username?
          </Link>

          {step === "email" ? (
            <button
              type="button"
              onClick={sendCode}
              disabled={sending || cooldown > 0}
              className="bg-sky-400 rounded-2xl px-5 py-2.5 text-white disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending..." : "Send code"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={verifying}
              className="bg-sky-400 rounded-2xl px-5 py-2.5 text-white disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify code"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}