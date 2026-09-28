"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import PromotionalBanner from "@/components/PromotionalBanner";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import {
  ShieldCheck,
  Smartphone,
  Sparkles,
  Globe,
  TrendingUp,
  Mail,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  ShoppingBag,
  HelpCircle,
  CreditCard,
  Flame
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SERVICES } from "@/data/services";

export default function HomePage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locale, dict } = useLanguage();
  const { requireAuth } = useAuth();
  const router = useRouter();

  const handleProtectedNavigate = (targetPath: string) => {
    requireAuth(() => {
      router.push(targetPath);
    }, targetPath);
  };

  const popularServices = SERVICES.filter((s) => s.popular);

  const SERVICES_OVERVIEW = [
    {
      id: "vpn",
      title: "🔐 Enterprise VPN Solutions",
      subtitle: "NordVPN, ExpressVPN, Surfshark, Proton & CyberGhost",
      desc: "Protect your privacy, unblock global streaming catalogs (Netflix, Hulu, Disney+), and enjoy ultra-fast encrypted tunnels. Available in shared slots & dedicated licenses with full 365-day replacement warranty.",
      features: [
        "6,000+ High-speed servers across 110+ countries",
        "Lightway & NordLynx zero-logging protocols",
        "Multi-device protection (Windows, Mac, iOS, Android)",
        "Automatic Kill Switch & Malware Shield"
      ],
      icon: ShieldCheck,
      gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
      badge: "Max Security"
    },
    {
      id: "subscriptions",
      title: "⭐ Premium AI & Media Subscriptions",
      subtitle: "ChatGPT Plus (GPT-4o), YouTube Premium, Netflix 4K, CapCut Pro",
      desc: "Unlock the full power of cutting-edge AI and ad-free entertainment. Upgrade directly on your personal email or receive instant dedicated credentials with 100% uptime guarantee.",
      features: [
        "ChatGPT Plus with GPT-4o, Sora & DALL-E 3 access",
        "YouTube Premium ad-free playback on your own Gmail",
        "Netflix 4K Ultra HD PIN-locked private profiles",
        "CapCut Pro & Telegram Premium instant activations"
      ],
      icon: Sparkles,
      gradient: "from-sky-500/20 via-indigo-500/10 to-transparent",
      badge: "Trending AI"
    },
    {
      id: "sim",
      title: "📱 Bangladesh SIM Drive Packs & Bundles",
      subtitle: "Grameenphone, Banglalink, Robi & Airtel Special Packages",
      desc: "Get heavy internet GB data packs and talktime minutes at discounted rate. Direct mobile recharge transfer to any Bangladeshi SIM within 5 to 10 minutes.",
      features: [
        "50GB+ Regular 4G Data Packs & 1000+ Minute Bundles",
        "100% Guaranteed Drive Offer Activation",
        "All BD Districts Covered (Prepaid SIM Support)",
        "Direct Top-up without hidden charges"
      ],
      icon: Smartphone,
      gradient: "from-emerald-500/20 via-cyan-500/10 to-transparent",
      badge: "BD Exclusive 🇧🇩"
    },
    {
      id: "ip",
      title: "🌐 Residential & Datacenter IP Proxies",
      subtitle: "Rotating Residential Proxies, Static IPv4/IPv6 & Mobile 4G",
      desc: "Ethically sourced high-anonymity IP proxy infrastructure designed for web scraping, multi-accounting, geo-testing, and account automation with zero fraud scores.",
      features: [
        "100M+ Clean Residential IPs with city/country targeting",
        "HTTP, HTTPS & SOCKS5 Protocol support",
        "1 Gbps Datacenter IPv4 static dedicated subnets",
        "4G SIM Mobile Proxies with instant rotation API"
      ],
      icon: Globe,
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      badge: "100M+ IPs"
    },
    {
      id: "smm",
      title: "📈 Social Media Marketing (SMM) Growth",
      subtitle: "Facebook, TikTok, YouTube & Instagram Growth Engines",
      desc: "Accelerate your social presence with non-drop organic audience growth. Unlock monetization thresholds and build brand credibility safely.",
      features: [
        "High-retention Facebook Page Followers & Likes",
        "TikTok Real Active Followers to unlock Live streaming",
        "YouTube 4000 Hours WatchTime Monetization Pack",
        "30-Day Auto Refill Guarantee"
      ],
      icon: TrendingUp,
      gradient: "from-rose-500/20 via-amber-500/10 to-transparent",
      badge: "Viral Growth"
    },
    {
      id: "email",
      title: "📧 Verified Phone-PVA Email Accounts",
      subtitle: "Fresh Gmail 10-Packs, Aged Outlook & .EDU Student Emails",
      desc: "Phone-verified, clean IP created email accounts with recovery mails included. Ideal for digital marketing, business setup, and student software perks.",
      features: [
        "100% Phone Verified (PVA) Fresh & Aged Gmail Accounts",
        "Official .EDU Student Mails for GitHub & Canva Pro Perks",
        "Instant File Download in TXT / CSV formats",
        "Lifetime Login Warranty Support"
      ],
      icon: Mail,
      gradient: "from-amber-500/20 via-cyan-500/10 to-transparent",
      badge: "Instant Delivery"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      {/* GLOBAL NAVBAR */}
      <Navbar
        cartCount={0}
        onOpenCart={() => { }}
        onOpenSearch={() => {
          requireAuth(() => setIsSearchModalOpen(true), `/${locale}/services`);
        }}
        currentLocale={locale}
      />

      {/* HERO SECTION */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => {
          requireAuth(() => setIsSearchModalOpen(true), `/${locale}/services`);
        }}
      />

      {/* ABOUT DIGIVIBE PLATFORM IDENTITY BANNER */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="md:col-span-2 space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Enterprise Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Next-Gen Digital Asset Delivery Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                DigiVibe is Bangladesh's premiere enterprise digital service marketplace. Powered by an automated Node.js & Python microservices engine, we deliver digital subscriptions, VPN access, proxies, and SIM drive bundles within 2 minutes with guaranteed warranty.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <button
                onClick={() => handleProtectedNavigate(`/${locale}/services`)}
                className="px-6 py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 group"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* TOP DEALS BANNER (PROTECTED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h3 className="text-base sm:text-lg font-black text-white">
            Top Trending Deals Overview
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full animate-pulse">
            Hot 💥
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => handleProtectedNavigate(`/${locale}/services`)}
              className="glass-panel p-4 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="text-[10px] text-cyan-400 font-bold mt-0.5">
                    Login to view pricing & details
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40">
                View
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DEDICATED PARTNERSHIP CARD */}
      <PromotionalBanner />

      {/* COMPREHENSIVE SERVICE OVERVIEW SECTIONS */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Our Service Offerings
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              Comprehensive Digital Ecosystem
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Explore our core digital service categories tailored for professionals, freelancers, and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_OVERVIEW.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group glass-panel rounded-3xl p-7 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 pointer-events-none`} />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 text-xs font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-400/90 mt-1 mb-3">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-slate-800/80">
                      {item.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800/80 relative">
                    <button
                      onClick={() => handleProtectedNavigate(`/${locale}/services`)}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 font-bold text-xs rounded-xl border border-slate-800 hover:border-cyan-500/40 flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Explore Options</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (3-STEP WORKFLOW) */}
      <section className="py-20 relative bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
              How DigiVibe Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Get your digital subscriptions & assets activated in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-xl flex items-center justify-center mx-auto mb-6">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Login & Choose Asset</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to access verified VPNs, SIM bundles, ChatGPT Plus, IP proxies, and email accounts.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-black text-xl flex items-center justify-center mx-auto mb-6">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Pay via bKash / Nagad / Crypto</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete your payment using bKash Send Money, Nagad, Rocket or USDT with zero extra fee.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-black text-xl flex items-center justify-center mx-auto mb-6">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Instant Automated Delivery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our automated microservices verify your payment and send login credentials directly via screen & WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & FEATURE HIGHLIGHTS */}
      <TrustBanner />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQS */}
      <FaqSection />

      {/* BOTTOM CALL TO ACTION BANNER */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-cyan-500/40 relative overflow-hidden bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {locale === "bn"
                ? "আপনার ডিজিটাল অভিজ্ঞতাকে আপডেট করতে প্রস্তুত?"
                : "Ready to Upgrade Your Digital Experience?"}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mt-3">
              {locale === "bn"
                ? "১২,৪০০+ এরও বেশি সন্তুষ্ট গ্রাহকদের সাথে যুক্ত হোন। ভিপিএন, এআই টুলস এবং অফার অ্যাক্সেস করতে লগইন করুন।"
                : "Join 12,400+ satisfied Bangladeshi customers. Log in to access VPNs, AI tools, and SIM bundles."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleProtectedNavigate(`/${locale}/services`)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/25"
              >
                {locale === "bn" ? "শপ ক্যাটালগে যান" : "Go to Shop Catalog"}
              </button>
              <Link
                href={`/${locale}/auth/signup`}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-sm rounded-2xl border border-slate-700"
              >
                {locale === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* SEARCH MODAL (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={SERVICES.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        onSelectService={() => {
          handleProtectedNavigate(`/${locale}/services`);
        }}
      />
    </div>
  );
}
