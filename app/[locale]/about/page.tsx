"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import {
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Globe,
  CheckCircle2,
  Users,
  Clock,
  Award,
  Lock,
  ArrowRight,
  Headphones
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AboutPage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locale, dict } = useLanguage();
  const { requireAuth } = useAuth();

  const STATS = [
    { label: "Active Happy Clients", value: "1500+", icon: Users, color: "text-cyan-400" },
    { label: "Auto-Fulfillment Rate", value: "99.9%", icon: Zap, color: "text-amber-400" },
    { label: "Average Delivery Time", value: "Within 5 Mins", icon: Clock, color: "text-emerald-400" },
    { label: "Satisfaction & Warranty", value: "100%", icon: Award, color: "text-sky-400" },
  ];

  const PILLARS = [
    {
      title: "Fast & Automated Delivery ⚡",
      desc: "No long waiting times. Our automated system processes orders rapidly and delivers your license keys, VPN access, or drive top-ups within 5 minutes.",
      icon: Zap,
      gradient: "from-cyan-500/10 via-sky-500/5 to-transparent border-cyan-500/20"
    },
    {
      title: "100% Guaranteed Replacements 🛡️",
      desc: "Every subscription, VPN slot, and digital account is backed by a full replacement warranty for its entire validity duration.",
      icon: ShieldCheck,
      gradient: "from-emerald-500/10 via-cyan-500/5 to-transparent border-emerald-500/20"
    },
    {
      title: "Localized Bangladesh Gateways 🇧🇩",
      desc: "Seamlessly pay using bKash, CellFin, and Rocket via Send Money (সেন্ড মানি) only. (Cash Out is strictly not accepted).",
      icon: Smartphone,
      gradient: "from-pink-500/10 via-purple-500/5 to-transparent border-pink-500/20"
    },
    {
      title: "Direct Admin Support Engine 🎧",
      desc: "Have a question or custom order inquiry? Get priority assistance directly from our dedicated WhatsApp admins or via Official Email.",
      icon: Headphones,
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20"
    },
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
      <section className="pt-36 pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            About DigiVibe 🇧🇩
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mt-4 tracking-tight leading-tight">
            Powering Bangladesh's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
              Digital Services & Subscriptions
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            DigiVibe is Bangladesh's premier automated digital ecommerce platform, delivering premium VPN slots, AI tool subscriptions, mobile SIM drive packs, IP proxies, and PVA email accounts with 100% guaranteed authenticity.
          </p>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                <Icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</span>
                <span className="text-xs font-semibold text-slate-400 mt-1">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission & Platform Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Why Thousands of Users Choose <span className="text-cyan-400">DigiVibe</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built from the ground up to solve digital access barriers in Bangladesh with speed, privacy, and local payment integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${pillar.gradient} border backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Warranty Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-bold border border-cyan-400/20">
              <Lock className="w-3.5 h-3.5" /> SSL 256-Bit Encrypted & Verified
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Upgrade Your Digital Experience?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Explore our verified digital services catalog with instant auto-delivery to your email or WhatsApp.
            </p>
          </div>

          <Link
            href={`/${locale}/services`}
            className="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 transition-all flex items-center gap-2 shrink-0 group"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
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
    </div>
  );
}
