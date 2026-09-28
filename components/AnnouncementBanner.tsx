"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Phone, Mail, UserCheck, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { locale } = useLanguage();

  if (!isVisible) return null;

  const noticeContent = (
    <div className="flex items-center gap-4 shrink-0 px-6">
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-400/40 text-[11px] shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>আপডেট নোটিশ</span>
      </span>

      <span className="text-slate-200 text-xs sm:text-sm font-medium">
        ⚠️ ওয়েবসাইটের আপডেট কাজ চলমান রয়েছে, তাই কিছু কিছু ফিচারে সাময়িক সমস্যা হতে পারে। কোনো প্রকার সহযোগিতার প্রয়োজন হলে বা সমস্যা হলে সরাসরি যোগাযোগ করুন:
      </span>



      <Link
        href={`/${locale}/support`}
        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-xs transition-all shadow-sm shrink-0"
      >
        <span>যোগাযোগ করুন</span>
        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
      </Link>
    </div>
  );

  return (
    <div className="relative w-full bg-gradient-to-r from-slate-950 via-cyan-950/90 to-slate-950 border-b border-cyan-500/30 text-slate-100 py-2.5 overflow-hidden z-50 shadow-md">
      {/* Left Edge Fade */}
      <div className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />

      {/* Right Edge Fade & Dismiss Button */}
      <div className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent px-2.5 flex items-center">
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Close Announcement"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Continuous Right-to-Left Scrolling Ticker */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-continuous flex items-center">
          {noticeContent}
          {noticeContent}
        </div>
      </div>
    </div>
  );
}
