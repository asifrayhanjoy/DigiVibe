"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import RightDock from "@/components/RightDock";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import Toast from "@/components/Toast";
import {
  Mail,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SupportPage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const { locale } = useLanguage();

  const FAQS = [
    {
      q: "How fast is order delivery after payment?",
      a: "All orders are processed through our automated engine. You will receive your license key, VPN slot credentials, or SIM drive pack confirmation within 5 minutes after submitting your payment TRX ID."
    },
    {
      q: "How do I pay using bKash, CellFin, Rocket, Bank, or Binance Pay?",
      a: "Select your preferred payment method during checkout (bKash, CellFin, Rocket). You will be provided with our official payment account details along with step-by-step instructions. Send Money (সেন্ড মানি) only to our provided number and enter your Transaction ID (TRX ID) or Reference on the checkout modal to confirm your order. Delivery is completed within 5 minutes. (Note: Cash Out is strictly NOT accepted. Please use Send Money exclusively.)"
    },
    {
      q: "What if my verification OTP email is delayed?",
      a: "Please check your Gmail Spam or Updates folder. If you still haven't received your 6-digit OTP code within 1 minute, click 'Resend Code' on the login screen or contact our 24/7 Telegram support team."
    },
    {
      q: "What is the replacement warranty policy?",
      a: "Every digital product on DigiVibe comes with a 100% full replacement warranty. If a VPN slot or subscription account encounters any issues during its active validity period, our support team will replace it immediately."
    },
    {
      q: "Can I get SIM drive packs delivered anywhere in Bangladesh?",
      a: "Yes! We support Grameenphone, Robi, Airtel, and Banglalink Prepaid drive packages across all 64 districts in Bangladesh. Recharge top-ups are credited directly to your SIM number."
    },
    {
      q: "Are the PVA Email accounts and .EDU Student Mails safe & fresh?",
      a: "Absolutely. All phone-verified Gmail accounts and official .EDU student emails are created on clean IP subnets with recovery emails attached. Full replacement warranty is guaranteed."
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      <Navbar
        cartCount={0}
        onOpenCart={() => { }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        currentLocale={locale}
      />

      <RightDock onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Hero Header */}
      <section className="relative z-10 pt-28 pb-10 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-[#070b16]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            24/7 Support Engine 🎧
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            How Can We Help You Today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl mx-auto font-medium">
            Get instant support via Telegram, browse frequent questions, or email our support team.
          </p>
        </div>
      </section>

      {/* Direct Contact Cards - 2 Main Support Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Telegram Support */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-sky-500/40 hover:border-sky-400 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm">
                  Fastest Response
                </span>
                <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.963z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Telegram Support</h3>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Direct Telegram contact with our official DigiVibe support admin for instant help.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Telegram Support</span>
                <h4 className="text-sm sm:text-base font-mono font-black text-sky-400 break-all">
                  @forid78687
                </h4>
              </div>

              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Chat on Telegram</span>
              </a>
            </div>
          </div>

          {/* Card 2: Official Email Support */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Official Inquiries
                </span>
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Email Support</h3>
              <p className="text-xs text-slate-400 mt-1">
                Send us formal inquiries, payment confirmation receipts, or account queries anytime.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Official Support Email</span>
                <h4 className="text-sm sm:text-base font-mono font-black text-cyan-400 break-all">
                  mdasifrayhanjoy2@gmail.com
                </h4>
              </div>

              <a
                href="mailto:mdasifrayhanjoy2@gmail.com"
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Send an Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded FAQ Section (Full Width Centered) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Common Questions & Help Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about order fulfillment, bKash/CellFin payment verification, OTP logins, and warranty replacements.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${isOpen
                  ? "bg-slate-900/90 border-cyan-400 shadow-xl shadow-cyan-500/20"
                  : "bg-slate-900/75 border-slate-700/60 hover:border-slate-500 hover:bg-slate-900/90"
                  }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-white hover:text-cyan-300 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0 ml-3" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed border-t border-slate-700/60 pt-4 animate-in fade-in space-y-2">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Direct Contact Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 text-center space-y-4 mt-8 shadow-2xl">
          <h3 className="text-lg font-black text-white">Still have questions or need custom bulk orders?</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Our support admins are ready to assist you directly on Telegram for instant assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://t.me/forid78687"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Admin (@forid78687)</span>
            </a>
            <a
              href="mailto:mdasifrayhanjoy2@gmail.com"
              className="px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support (mdasifrayhanjoy2@gmail.com)</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={[]}
        onSelectService={() => { }}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
