"use client";

import { Zap, ShieldCheck, Headset, Wallet } from "lucide-react";

export default function TrustBanner() {
  const USPs = [
    {
      icon: Zap,
      title: "Delivery Within 5 Mins (৫ মিনিটে ডেলিভারি)",
      desc: "অটোমেটেড সিস্টেমের মাধ্যমে পেমেন্ট সম্পন্ন হওয়ার ৫ মিনিটের ভেতর ডেলিভারি নিশ্চিত।",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      icon: ShieldCheck,
      title: "100% Replacement Guarantee",
      desc: "প্রতিটি ডিজিটাল প্রোডাক্টের সাথে থাকছে সম্পূর্ণ মেয়াদের ওয়ারেন্টি গ্যারান্টি।",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: Wallet,
      title: "bKash, CellFin & Rocket (Send Money)",
      desc: "বিকাশ, সেলফিন ও রকেটে শুধুমাত্র সেন্ড মানি (Send Money) করে সহজে পেমেন্ট করার সুবিধা। (ক্যাশআউট গ্রহণযোগ্য নয়)",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      icon: Headset,
      title: "24/7 Live Support",
      desc: "আমাদের অভিজ্ঞ সাপোর্ট টিম প্রতিনিয়ত হোয়াটসঅ্যাপ ও টেলিগ্রামে সচল থাকে।",
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 relative overflow-hidden">
          {/* Subtle background blur circle */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Why Choose DigiVibe?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              কেন আমরাই আপনার সেরা পছন্দ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              বিগত ৪ বছর ধরে বিশ্বস্ততা ও সততার সাথে লক্ষাধিক কাস্টমারকে ডিজিটাল সেবা দিয়ে আসছি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {USPs.map((usp, idx) => {
              const Icon = usp.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl border ${usp.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{usp.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{usp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
