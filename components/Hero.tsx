"use client";

import Link from "next/link";
import {
  Search,
  Zap,
  ShieldCheck,
  Star,
  CreditCard,
  Handshake,
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
}

export default function Hero({ searchQuery, setSearchQuery, onSearchSubmit }: HeroProps) {
  const { locale, dict } = useLanguage();
  const { requireAuth } = useAuth();
  const router = useRouter();

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
    router.push(`/${locale}/services`);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/${locale}/services`);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[250px] h-[250px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-semibold text-cyan-300">
            {dict.hero.badge}
          </span>
          <span className="hidden sm:inline-block text-xs font-bold text-slate-500">|</span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
            {dict.hero.subBadge}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {dict.hero.headlinePrefix}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
            {dict.hero.headlineHighlight}
          </span>{" "}
          {dict.hero.headlineSuffix}
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {dict.hero.subheadline}
        </p>

        {/* Hero Search Box */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={handleHeroSearchSubmit}
            className="relative flex items-center p-2 bg-slate-900/90 border border-slate-700/80 focus-within:border-cyan-500/80 rounded-2xl shadow-2xl shadow-cyan-950/40 backdrop-blur-xl transition-all duration-300"
          >
            <Search className="w-5 h-5 text-cyan-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products e.g. NordVPN, ChatGPT, GP Offer..."
              className="w-full bg-transparent px-3 py-3 text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-cyan-500/20 shrink-0 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{dict.hero.searchBtn}</span>
            </button>
          </form>

          {/* Quick search tags (Protected) */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">{dict.hero.popular}</span>
            {["NordVPN", "ChatGPT Plus", "YouTube Premium", "GP 50GB", "Residential IP"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-2 sm:gap-3 border border-slate-800/80 hover:border-cyan-500/30 transition-all min-w-0 overflow-hidden">
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0 flex-1 overflow-hidden">
              <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{dict.hero.stats.delivery}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 leading-tight mt-0.5 line-clamp-2 sm:line-clamp-none break-words">{dict.hero.stats.deliverySub}</div>
            </div>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-2 sm:gap-3 border border-slate-800/80 hover:border-cyan-500/30 transition-all min-w-0 overflow-hidden">
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0 flex-1 overflow-hidden">
              <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{dict.hero.stats.security}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 leading-tight mt-0.5 line-clamp-2 sm:line-clamp-none break-words">{dict.hero.stats.securitySub}</div>
            </div>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-2 sm:gap-3 border border-slate-800/80 hover:border-cyan-500/30 transition-all min-w-0 overflow-hidden">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
            </div>
            <div className="text-left min-w-0 flex-1 overflow-hidden">
              <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{dict.hero.stats.rating}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 leading-tight mt-0.5 line-clamp-2 sm:line-clamp-none break-words">{dict.hero.stats.ratingSub}</div>
            </div>
          </div>

          <div className="glass-panel p-3 sm:p-4 rounded-2xl flex items-center gap-2 sm:gap-3 border border-slate-800/80 hover:border-cyan-500/30 transition-all min-w-0 overflow-hidden">
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0 flex-1 overflow-hidden">
              <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{dict.hero.stats.payments}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 leading-tight mt-0.5 line-clamp-2 sm:line-clamp-none break-words">{dict.hero.stats.paymentsSub}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
