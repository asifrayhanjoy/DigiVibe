"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { Mail, Lock, User, Phone, UserPlus, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { apiSignup } from "@/lib/api/services";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const { locale, dict } = useLanguage();
  const { login } = useAuth();

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !phone) {
      setToast({ title: "Error", message: "Please fill in all required fields." });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ title: "Password Mismatch", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiSignup(name, email, password, phone);
      setIsSubmitting(false);

      if (res.success) {
        if (res.user && res.token) {
          login(res.user, res.token);
        }
        setToast({ title: "Registration Successful! 🎉", message: res.message || "Account created successfully." });
        setTimeout(() => {
          window.location.href = `/${locale}/services`;
        }, 800);
      } else {
        setToast({ title: "Registration Failed", message: res.message || "Could not complete registration." });
      }
    } catch (err) {
      setIsSubmitting(false);
      setToast({ title: "Registration Error", message: "Could not complete registration. Please check your connection." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      <Navbar cartCount={0} onOpenCart={() => { }} onOpenSearch={() => { }} currentLocale={locale} />

      <main className="flex-1 pt-32 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow animations */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

        <div className="relative w-full max-w-lg">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-2xl">
            <div>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-cyan-500/30 mb-4">
                  <UserPlus className="w-6 h-6 fill-slate-950 stroke-slate-950" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {dict.auth.signupTitle}
                </h1>
                <p className="text-xs text-slate-400 mt-2">
                  {dict.auth.signupSubtitle}
                </p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {dict.auth.nameLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {dict.auth.emailLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {dict.auth.passwordLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01700000000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 mt-0.5"
                  />
                  <span className="text-[11px] text-slate-400 leading-tight">
                    I agree to DigiVibe's Terms of Service and Privacy Policy.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-all mt-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span>{dict.auth.alreadyHaveAccount}</span>{" "}
                <Link href={`/${locale}/auth/login`} className="font-bold text-cyan-400 hover:underline">
                  {dict.nav.login}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

