"use client";

import { Zap, PhoneCall, Mail, ShieldCheck, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import AcceptedGateways from "./AcceptedGateways";
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

  const categoryLabels: Record<string, { en: string; bn: string }> = {
    vpn: { en: "VPN Services", bn: "ভিপিএন সার্ভিস" },
    subscriptions: { en: "Subscriptions Services", bn: "সাবস্ক্রিপশন সার্ভিস" },
    sim: { en: "SIM Services", bn: "সিম সার্ভিস" },
    ip: { en: "IP Services", bn: "আইপি সার্ভিস" },
    smm: { en: "SMM Growth", bn: "সোশ্যাল মিডিয়া গ্রোথ" },
    email: { en: "Email Services", bn: "ভেরিফাইড ইমেইল" },
  };

  const isBn = locale === "bn";

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/40 p-0.5 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
                <img src="/logo.png" alt="DigiVibe Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <span className="text-2xl font-black text-white">
                Digi<span className="text-cyan-400">Vibe</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {isBn
                ? "ডিগিভাইব – বাংলাদেশ এর সবচেয়ে নিরাপদ ও বিশ্বস্ত ডিজিটাল সার্ভিস ই-কমার্স প্ল্যাটফর্ম। ভিপিএন, সাবস্ক্রিপশন, আইপি এবং সিম অফার কিনুন মুহূর্তেই।"
                : "DigiVibe – The safest & most trusted digital service e-commerce platform in Bangladesh. Buy VPNs, subscriptions, IPs, and SIM offers instantly."}
            </p>

            {/* Support CTA buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://wa.me/8801302271472"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isBn ? "হোয়াটসঅ্যাপ সাপোর্ট" : "WhatsApp Support"}</span>
              </a>
              <a
                href="mailto:mdasifrayhanjoy2@gmail.com"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{isBn ? "ইমেইল সাপোর্ট" : "Email Support"}</span>
              </a>
            </div>
          </div>

          {/* Categories links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {isBn ? "ক্যাটাগরি সমূহ" : "Categories"}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {["vpn", "subscriptions", "sim", "ip", "smm", "email"].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(cat)}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {categoryLabels[cat] ? categoryLabels[cat][isBn ? "bn" : "en"] : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {isBn ? "দ্রুত লিংক" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href={`/${locale}/about`} className="hover:text-cyan-400 transition-colors">{isBn ? "আমাদের সম্পর্কে" : "About Us"}</a></li>
              <li><a href={`/${locale}/support`} className="hover:text-cyan-400 transition-colors">{isBn ? "সাপোর্ট ও সাহায্য" : "Support & FAQs"}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{isBn ? "সেবার শর্তাবলী" : "Terms of Service"}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{isBn ? "রিফান্ড ও ওয়ারেন্টি" : "Refund & Warranty"}</a></li>
            </ul>
          </div>

          {/* Payment Badges & Language Switcher */}
          <div>
            <AcceptedGateways />

            <div className="mt-6 pt-4 border-t border-slate-900">
              <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Language / ভাষা:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSwitchLanguage("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    locale === "en"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  English 🇺🇸
                </button>
                <button
                  onClick={() => handleSwitchLanguage("bn")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    locale === "bn"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  বাংলা 🇧🇩
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">DigiVibe Store</strong>. {isBn ? "সকল অধিকার সংরক্ষিত।" : "Enterprise Microservices Platform."}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? "SSL ২৫৬-বিট সিকিউরড পেমেন্ট চেকআউট" : "SSL 256-Bit Encrypted Secure Checkout"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
