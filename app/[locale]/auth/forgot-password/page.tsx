"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { KeyRound, Mail, Lock, ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiForgotPassword, apiResetPassword } from "@/lib/api/services";

export default function ForgotPasswordPage() {
  const { locale } = useLanguage();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setToast({ title: "Validation Error", message: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiForgotPassword(email);
      setIsSubmitting(false);

      if (res.success) {
        setStep("reset");
        if (res.demoOtp) {
          setOtpCode(res.demoOtp);
        }
        setToast({ title: "Reset OTP Sent 📧", message: res.message });
      } else {
        setToast({ title: "Request Failed", message: res.message || "Failed to send reset code." });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setToast({ title: "Server Error", message: "Could not request password reset." });
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setToast({ title: "Invalid Code", message: "Please enter the 6-digit OTP code sent to your email." });
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setToast({ title: "Weak Password", message: "Password must be at least 4 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ title: "Password Mismatch", message: "New password and confirm password do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiResetPassword(email, otpCode, newPassword);
      setIsSubmitting(false);

      if (res.success) {
        setToast({ title: "Password Reset Success! 🎉", message: res.message });
        setTimeout(() => {
          window.location.href = `/${locale}/auth/login`;
        }, 1500);
      } else {
        setToast({ title: "Reset Failed", message: res.message || "Invalid OTP code or expired." });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setToast({ title: "Error", message: "Failed to reset password." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      <Navbar cartCount={0} onOpenCart={() => { }} onOpenSearch={() => { }} currentLocale={locale} />

      <main className="flex-1 pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

        <div className="relative w-full max-w-md">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-2xl">
            {step === "request" ? (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/10">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Reset Your Password
                  </h1>
                  <p className="text-xs text-slate-400 mt-2">
                    Enter your account email address to receive a 6-digit password reset OTP.
                  </p>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-all mt-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Reset Code...</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Send Password Reset OTP</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <Link href={`/${locale}/auth/login`} className="font-bold text-cyan-400 hover:underline flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/10">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Enter Reset Code & New Password</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verification OTP code sent to <strong className="text-cyan-300">{email}</strong>
                  </p>
                </div>

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 text-center">
                      6-Digit Security OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold bg-slate-900 border border-cyan-500/40 rounded-xl py-2.5 text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition-all mt-2 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Updating Password...</span>
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Update Password & Login</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setStep("request")}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email / Back</span>
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
