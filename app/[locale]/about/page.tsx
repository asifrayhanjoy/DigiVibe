"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import RightDock from "@/components/RightDock";
import BackgroundSlider from "@/components/BackgroundSlider";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import {
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Clock,
  Award,
  Lock,
  ArrowRight,
  Headphones,
  Star,
  Quote,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const REVIEWS_ROW_1 = [
  { name: "Tanvir Ahmed", location: "Dhaka", service: "ChatGPT Plus (Shared Slot)", rating: 5, avatar: "T", comment: "Instant activation in 2 mins! Shared slot works smoothly without any logout issues." },
  { name: "Nafis Rahman", location: "Chittagong", service: "NordVPN Premium 1 Yr", rating: 5, avatar: "N", comment: "Fast speed 6000+ servers. Paid via bKash send money and received key in minutes!" },
  { name: "Sabbir Hossain", location: "Sylhet", service: "YouTube Premium 4K", rating: 5, avatar: "S", comment: "My personal Gmail upgraded without password sharing. Excellent service!" },
  { name: "Ayesha Siddiqua", location: "Rajshahi", service: "Canva Pro Lifetime", rating: 5, avatar: "A", comment: "Got full education team access instantly. Saved so much money on design projects." },
  { name: "Farhan Masud", location: "Khulna", service: "GP 50GB Drive Pack", rating: 5, avatar: "F", comment: "Recharged my GP number within 4 minutes. Very trustworthy platform!" },
  { name: "Mahmudul Hasan", location: "Dhaka", service: "Rotating Residential IP", rating: 5, avatar: "M", comment: "Clean Socks5 proxies with zero fraud score. Perfect for my web scraping setup." },
  { name: "Sharmin Akter", location: "Barishal", service: "Netflix 4K Ultra HD", rating: 5, avatar: "S", comment: "Private PIN-locked profile working great on Smart TV. 100% recommended." },
  { name: "Robiul Islam", location: "Rangpur", service: "Fresh Gmail PVA 10-Pack", rating: 5, avatar: "R", comment: "All 10 Gmails phone-verified with clean IP. Delivered automatically." },
  { name: "Imtiaz Chowdhury", location: "Comilla", service: "ExpressVPN Slot", rating: 5, avatar: "I", comment: "Zero logging servers, super fast Lightway protocol. Best VPN seller in BD." },
  { name: "Zubaer Ahmed", location: "Mymensingh", service: "CapCut Pro Slot", rating: 5, avatar: "Z", comment: "Pro video export unlocked seamlessly. WhatsApp support is super responsive!" },
];

const REVIEWS_ROW_2 = [
  { name: "Shakil Hasan", location: "Dhaka", service: "Facebook Page Followers", rating: 5, avatar: "S", comment: "Non-drop organic followers delivered as promised. Page monetization unlocked!" },
  { name: "Sadiya Parvin", location: "Chittagong", service: "Banglalink 40GB Pack", rating: 5, avatar: "S", comment: "Special discounted recharge rate. Received SMS within 3 mins." },
  { name: "Anik Roy", location: "Bogura", service: "Surfshark One Slot", rating: 5, avatar: "A", comment: "Unlimited device support works on PC & mobile. Great replacement warranty." },
  { name: "Kazi Rakib", location: "Gazipur", service: "71Proxy Unlimited", rating: 5, avatar: "K", comment: "Unlimited pool access for automation. Works seamlessly with python requests." },
  { name: "Jahidul Islam", location: "Narayanganj", service: "Robi 1000 Min Pack", rating: 5, avatar: "J", comment: "Instant mobile recharge via bKash. Smooth and reliable experience every time." },
  { name: "Fahim Shahriar", location: "Dhaka", service: "GitHub Student Mail", rating: 5, avatar: "F", comment: ".EDU mail delivered instantly. Unlocked Student Developer Pack with no hassle." },
  { name: "Mehedi Hasan", location: "Cox's Bazar", service: "ProtonVPN Unlimited", rating: 5, avatar: "M", comment: "Swiss encrypted tunnels work flawlessly for trading & privacy." },
  { name: "Nusrat Jahan", location: "Sylhet", service: "Telegram USA PVA", rating: 5, avatar: "N", comment: "Dedicated Virtual number received with OTP instant code delivery." },
  { name: "Rayhan Kabir", location: "Feni", service: "TikTok Live Unlock", rating: 5, avatar: "R", comment: "Real active followers added quickly. Unlocked live streaming feature!" },
  { name: "Shamim Hossain", location: "Jessore", service: "Static IPv4 Datacenter", rating: 5, avatar: "S", comment: "1 Gbps dedicated IP with zero downtime. Master admin support is 10/10." },
];

export default function AboutPage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locale } = useLanguage();

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
      gradient: "from-cyan-500/20 via-sky-500/10 to-slate-900 border-cyan-500/30"
    },
    {
      title: "100% Guaranteed Replacements 🛡️",
      desc: "Every subscription, VPN slot, and digital account is backed by a full replacement warranty for its entire validity duration.",
      icon: ShieldCheck,
      gradient: "from-emerald-500/20 via-cyan-500/10 to-slate-900 border-emerald-500/30"
    },
    {
      title: "Localized Bangladesh Gateways 🇧🇩",
      desc: "Seamlessly pay using bKash, CellFin, and Rocket via Send Money (সেন্ড মানি) only. (Cash Out is strictly not accepted).",
      icon: Smartphone,
      gradient: "from-pink-500/20 via-purple-500/10 to-slate-900 border-pink-500/30"
    },
    {
      title: "Direct Admin Support Engine 🎧",
      desc: "Have a question or custom order inquiry? Get priority assistance directly from our dedicated WhatsApp admins or via Official Email.",
      icon: Headphones,
      gradient: "from-amber-500/20 via-orange-500/10 to-slate-900 border-amber-500/30"
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* DYNAMIC 3D BACKGROUND SLIDER (Rotates 5 3D Tech Images every 4s with Dark Overlay) */}
      <BackgroundSlider />

      <Navbar
        cartCount={0}
        onOpenCart={() => { }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        currentLocale={locale}
      />

      <RightDock onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Hero Header */}
      <section className="relative z-10 pt-28 pb-14 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-[#070b16]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            About DigiVibe 🇧🇩
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mt-4 font-sans leading-tight tracking-tight drop-shadow-md">
            Powering Bangladesh's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
              Digital Services & Subscriptions
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-3 max-w-2xl mx-auto leading-relaxed font-medium">
            DigiVibe is Bangladesh's premier automated digital ecommerce platform, delivering premium VPN slots, AI tool subscriptions, mobile SIM drive packs, IP proxies, and PVA email accounts.
          </p>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-700/60 shadow-2xl backdrop-blur-2xl">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
                <Icon className={`w-7 h-7 mb-2 ${stat.color}`} />
                <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</span>
                <span className="text-xs font-bold text-slate-300 mt-1">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission & Platform Pillars */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Core Platform Pillars
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Why Thousands of Users Choose <span className="text-cyan-400">DigiVibe</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
            Built from the ground up to solve digital access barriers in Bangladesh with speed, privacy, and local payment integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl bg-slate-900/80 border ${pillar.gradient} backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300 group shadow-xl`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* INFINITE MOVING MARQUEE CUSTOMER REVIEWS SECTION (~20 REVIEWS) */}
      <section className="relative z-10 py-16 sm:py-20 w-full overflow-hidden bg-slate-950/60 backdrop-blur-md border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-3 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Customer Testimonials & Ratings</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">12,400+ Bangladeshi Clients</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto font-medium">
            Real customer reviews and feedback from freelancers, students, and professionals across Bangladesh.
          </p>
        </div>

        {/* Marquee Row 1 (Scrolls Left) */}
        <div className="relative w-full overflow-hidden mb-6 py-2">
          <div className="animate-marquee flex gap-5 px-4">
            {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((rev, idx) => (
              <div
                key={idx}
                className="glass-panel p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl w-80 sm:w-96 shrink-0 space-y-3 transition-all duration-300 hover:scale-105 hover:z-30 hover:border-cyan-400 hover:bg-slate-900/95 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      {rev.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-300 truncate">{rev.name}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium truncate block">{rev.location} 🇧🇩</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full shrink-0 truncate max-w-[110px]">
                    {rev.service}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-bold text-amber-300 ml-1">5.0 / 5.0</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-3">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Scrolls Right) */}
        <div className="relative w-full overflow-hidden py-2">
          <div className="animate-marquee-reverse flex gap-5 px-4">
            {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((rev, idx) => (
              <div
                key={idx}
                className="glass-panel p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl w-80 sm:w-96 shrink-0 space-y-3 transition-all duration-300 hover:scale-105 hover:z-30 hover:border-amber-400 hover:bg-slate-900/95 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      {rev.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 truncate">{rev.name}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium truncate block">{rev.location} 🇧🇩</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full shrink-0 truncate max-w-[110px]">
                    {rev.service}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-bold text-amber-300 ml-1">5.0 / 5.0</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-3">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Warranty Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-950/90 via-cyan-950/40 to-slate-950/90 border border-cyan-500/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl backdrop-blur-xl">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-extrabold border border-cyan-400/30 shadow-sm">
              <Lock className="w-3.5 h-3.5" /> SSL 256-Bit Encrypted & Verified
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Upgrade Your Digital Experience?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Explore our verified digital services catalog with instant auto-delivery to your email or WhatsApp.
            </p>
          </div>

          <Link
            href={`/${locale}/services`}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2 shrink-0 group hover:scale-105 active:scale-95"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
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
