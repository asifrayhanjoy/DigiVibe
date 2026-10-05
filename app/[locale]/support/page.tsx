"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import Toast from "@/components/Toast";
import {
  PhoneCall,
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
      a: "Please check your Gmail Spam or Updates folder. If you still haven't received your 6-digit OTP code within 1 minute, click 'Resend Code' on the login screen or contact our 24/7 WhatsApp agent."
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        cartCount={0}
        onOpenCart={() => { }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        currentLocale={locale}
      />

      {/* Hero Header */}
      <section className="pt-36 pb-14 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            24/7 Support Engine 🎧
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Get instant support via WhatsApp, browse frequent questions, or send a direct message to our customer care team.
          </p>
        </div>
      </section>

      {/* Direct Contact Cards - 2 Main Support Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: WhatsApp Support (Two Admins) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Fastest Response
                </span>
                <PhoneCall className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">WhatsApp Live Support</h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct WhatsApp contact with our official DigiVibe support admins for instant help.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Admin 1: FARID */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin</span>
                  <h4 className="text-sm font-black text-white truncate">FARID</h4>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">01990800188</p>
                </div>
                <a
                  href="https://wa.me/8801990800188"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Chat Now</span>
                </a>
              </div>

              {/* Admin 2: MD ASIF RAYHAN JOY */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin</span>
                  <h4 className="text-sm font-black text-white truncate">MD ASIF RAYHAN JOY</h4>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">01302271472</p>
                </div>
                <a
                  href="https://wa.me/8801302271472"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Chat Now</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Official Email Support */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5">
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
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                  ? "bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-100 hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0 ml-3" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 ml-3" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in space-y-2">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Direct Contact Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 mt-8">
          <h3 className="text-lg font-black text-white">Still have questions or need custom bulk orders?</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Our support admins are ready to assist you directly on WhatsApp for instant assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://wa.me/8801990800188"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Admin Farid (01990800188)</span>
            </a>
            <a
              href="https://wa.me/8801302271472"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Admin Joy (01302271472)</span>
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
