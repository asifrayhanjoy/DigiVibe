"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { Zap, Mail, Lock, LogIn, KeyRound, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiLogin, apiVerifyOtp, apiSendOtp } from "@/lib/api/services";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // OTP state
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const { locale, dict } = useLanguage();

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ title: "Error", message: "Please fill in both email and password." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiLogin(email, password);
      setIsSubmitting(false);

      if (res.success && res.requiresOtp) {
        setStep("otp");
        setToast({ title: "Email OTP Sent 🔑", message: res.message });
      } else {
        setToast({ title: "Login Failed", message: res.message || "Could not send OTP email." });
      }
    } catch (err) {
      setIsSubmitting(false);
      setToast({ title: "Login Failed", message: "Invalid credentials or authentication server offline." });
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setToast({ title: "Invalid Code", message: "Please enter a valid 6-digit OTP." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiVerifyOtp(email, otpCode);
      setIsSubmitting(false);

      if (res.success) {
        setToast({ title: "Authentication Successful! 🎉", message: "Redirecting to your profile..." });
        setTimeout(() => {
          window.location.href = `/${locale}/profile`;
        }, 1200);
      } else {
        setToast({ title: "Verification Failed", message: res.message });
      }
    } catch (err) {
      setIsSubmitting(false);
      setToast({ title: "Verification Error", message: "Invalid OTP code." });
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    const res = await apiSendOtp(email, "login");
    setIsSubmitting(false);
    if (res.success) {
      setResendTimer(60);
      setToast({ title: "New OTP Sent", message: res.message });
    } else {
      setToast({ title: "Resend Failed", message: res.message || "Failed to resend OTP code." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      <Navbar cartCount={0} onOpenCart={() => { }} onOpenSearch={() => { }} currentLocale={locale} />

      <main className="flex-1 pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow animations */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

        <div className="relative w-full max-w-md">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-2xl">
            {step === "credentials" ? (
              /* STEP 1: CREDENTIALS FORM */
              <div>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-cyan-500/30 mb-4">
                    <Zap className="w-7 h-7 fill-slate-950 stroke-slate-950" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {dict.auth.loginTitle}
                  </h1>
                  <p className="text-xs text-slate-400 mt-2">
                    {dict.auth.loginSubtitle}
                  </p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {dict.auth.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {dict.auth.passwordLabel}
                      </label>
                      <a href="#" className="text-[11px] text-cyan-400 hover:underline">
                        {dict.auth.forgotPass}
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                      />
                      <span className="text-xs text-slate-400">{dict.auth.rememberMe}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-all mt-2"
                  >
                    {isSubmitting ? (
                      <span>Sending OTP...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 stroke-[2.5]" />
                        <span>Login</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <span>{dict.auth.dontHaveAccount}</span>{" "}
                  <Link href={`/${locale}/auth/signup`} className="font-bold text-cyan-400 hover:underline">
                    {dict.nav.signup}
                  </Link>
                </div>
              </div>
            ) : (
              /* STEP 2: 2FA EMAIL OTP VERIFICATION SCREEN */
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/10">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Enter 6-Digit Email OTP</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    We sent a verification code to <strong className="text-cyan-300">{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleOtpVerify} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold bg-slate-900 border border-cyan-500/40 rounded-xl py-3.5 text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Verify & Access Profile</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setStep("credentials")}
                    className="text-slate-400 hover:text-white"
                  >
                    ← Back to Login
                  </button>

                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className={`flex items-center gap-1 font-semibold ${resendTimer > 0 ? "text-slate-500" : "text-cyan-400 hover:underline"
                      }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
