"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "@/data/services";

export default function Testimonials() {
  return (
    <section className="py-16 relative bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
            ⭐ Client Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-3">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            হাজারো সন্তুষ্ট কাস্টমারের সত্য রিভিউ ও অনুভূতি
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="glass-panel p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-cyan-500/20 absolute top-4 right-4 pointer-events-none" />

              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">{t.role} • {t.location}</div>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                    Bought: {t.serviceBought}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
