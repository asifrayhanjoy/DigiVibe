"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Zap, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/data/services";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
}

export default function Hero({ searchQuery, setSearchQuery, onSearchSubmit }: HeroProps) {
  const { locale, dict } = useLanguage();
  const { requireAuth } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K Keyboard Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
    const q = searchQuery.trim();
    if (!q) {
      router.push(`/${locale}/services`);
      return;
    }
    const exactMatch = SERVICES.find(
      (s) => s.title.toLowerCase() === q.toLowerCase() || s.id.toLowerCase() === q.toLowerCase()
    );
    if (exactMatch) {
      router.push(`/${locale}/services?id=${exactMatch.id}&query=${encodeURIComponent(exactMatch.title)}#product-${exactMatch.id}`);
    } else {
      router.push(`/${locale}/services?query=${encodeURIComponent(q)}#catalog-grid`);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    const exactMatch = SERVICES.find(
      (s) => s.title.toLowerCase().includes(tag.toLowerCase()) || s.category.toLowerCase().includes(tag.toLowerCase())
    );
    if (exactMatch) {
      router.push(`/${locale}/services?id=${exactMatch.id}&query=${encodeURIComponent(tag)}#product-${exactMatch.id}`);
    } else {
      router.push(`/${locale}/services?query=${encodeURIComponent(tag)}#catalog-grid`);
    }
  };

  return (
    <section className="relative pt-24 pb-10 md:pt-32 md:pb-14 z-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4 shadow-md backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Automated Digital Marketplace & Launcher</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight font-sans">
          Instant Access to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
            Digital Tools & Premium Subscriptions
          </span>
        </h1>

        {/* SINGLE PROMINENT CENTRAL HERO SEARCH BAR */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleHeroSearchSubmit}
            className="relative flex items-center p-2 bg-slate-900/85 border border-white/20 focus-within:border-cyan-400 rounded-full shadow-2xl backdrop-blur-2xl transition-all duration-300 group hover:border-cyan-500/40"
          >
            <Search className="w-5 h-5 text-cyan-400 ml-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search VPN, Subscriptions, AI Tools, IP Proxies..."
              className="w-full bg-transparent px-3.5 py-2.5 text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            />

            {/* Ctrl K Shortcut Chip */}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-extrabold text-slate-400 bg-slate-950/90 border border-slate-700/80 rounded-lg shrink-0 mr-2 shadow-inner">
              <span>Ctrl</span> K
            </kbd>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-2 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-full bg-slate-800 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-xs sm:text-sm rounded-full transition-all shadow-lg shadow-cyan-500/25 shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch</span>
            </button>
          </form>

          {/* Quick Category Tags */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Popular:</span>
            {["NordVPN", "ChatGPT Plus", "YouTube 4K", "GP 50GB", "Residential IP"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 transition-all text-xs font-semibold backdrop-blur-md"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
