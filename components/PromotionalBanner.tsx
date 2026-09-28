"use client";

import Link from "next/link";
import { Handshake, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PromotionalBanner() {
  const { locale } = useLanguage();

  return (
    <section className="w-full pt-8 pb-4 px-3 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-3xl mx-auto">
        {/* Single Partnership Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/40 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 text-left relative overflow-hidden group">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

          {/* Top Badge & Icon Row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 inline-block mb-1">
                অফিশিয়াল কোলাবোরেশন 🤝
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                <span>পার্টনারশিপ ও প্রোডাক্ট লঞ্চ সুযোগ ✨</span>
              </h3>
            </div>
          </div>

          {/* Content & Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-4">
            কেউ চাইলে আমাদের সাথে অফিশিয়ালভাবে পার্টনার হতে পারেন এবং আপনাদের নিজস্ব প্রোডাক্ট বা সার্ভিস আমাদের ডিজিটাল প্ল্যাটফর্মে লঞ্চ ও প্রচার করাতে পারেন।
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5 pt-3 border-t border-slate-800/80 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>অফিশিয়াল বিজনেস পার্টনারশিপ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>প্রোডাক্ট লঞ্চ ও বিজ্ঞাপন</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>দ্রুত কাস্টমার রিচ ও গ্রোথ</span>
            </div>
          </div>

          {/* Direct Contact CTA Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
            <span className="text-xs text-slate-400 font-medium text-center sm:text-left">
              💡 পার্টনারশিপ বা প্রোডাক্ট প্রমোশনের জন্য সরাসরি অ্যাডমিনের সাথে কথা বলুন।
            </span>
            <Link
              href={`/${locale}/contact`}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.03] active:scale-95 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>সরাসরি যোগাযোগ করুন</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
