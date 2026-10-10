"use client";

import { PhoneCall, Mail, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/types";

interface FooterProps {
  onSelectCategory?: (cat: string) => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchLanguage = (newLoc: Locale) => {
    setLocale(newLoc);
    if (pathname) {
      const newPath = pathname.replace(/^\/(en|bn)/, `/${newLoc}`);
      router.push(newPath);
    }
  };

  const isBn = locale === "bn";

  return (
    <footer className="mt-12 sm:mt-16 bg-slate-950/95 border-t border-slate-800/80 py-6 text-slate-400 relative z-10 w-full backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b border-slate-900/90 pb-4 mb-4">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-cyan-500/40 p-0.5 overflow-hidden flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
              <img src="/logo.png" alt="DigiVibe Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-xl font-black text-white">
              Digi<span className="text-cyan-400">Vibe</span>
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-500 border-l border-slate-800 pl-3 ml-1">
              {isBn ? "বাংলাদেশ এর সবচেয়ে বিশ্বাসী ডিজিটাল প্ল্যাটফর্ম" : "Trusted Digital Service Platform"}
            </span>
          </div>

          {/* Minimal Support & Language Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <a
              href="https://wa.me/8801302271472"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}</span>
            </a>
            <a
              href="mailto:mdasifrayhanjoy2@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isBn ? "ইমেইল" : "Email"}</span>
            </a>

            {/* Compact Language Switcher */}
            <div className="flex items-center gap-1 ml-1 bg-slate-900/80 border border-slate-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => handleSwitchLanguage("en")}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                  locale === "en" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                EN 🇺🇸
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage("bn")}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                  locale === "bn" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                BN 🇧🇩
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">DigiVibe Store</strong>. {isBn ? "সকল অধিকার সংরক্ষিত।" : "All rights reserved."}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isBn ? "SSL ২৫৬-বিট সিকিউরড চেকআউট" : "SSL 256-Bit Encrypted Secure Checkout"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
