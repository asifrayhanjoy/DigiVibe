"use client";

import { useRef, useState } from "react";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { TESTIMONIALS } from "@/data/services";

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340; // width of card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="py-16 relative bg-slate-950/60 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Verified Customer Reviews ({TESTIMONIALS.length})</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-3 flex items-center gap-2">
              <span>What Our Clients Say</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              হাজারো সন্তুষ্ট গ্রাহকের ২০০% জেনুইন রিভিউ ও অভিজ্ঞতার অনুভূতি
            </p>
          </div>

          {/* Slider Controls (Left / Right Arrow Buttons) */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs font-mono font-bold text-slate-400 mr-2 hidden sm:inline-block">
              Swipe / Scroll ➔
            </span>
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous Testimonials"
              className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
                canScrollLeft
                  ? "bg-slate-900 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border-slate-700/80 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 cursor-pointer"
                  : "bg-slate-950/40 text-slate-700 border-slate-800/60 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next Testimonials"
              className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
                canScrollRight
                  ? "bg-slate-900 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border-slate-700/80 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 cursor-pointer"
                  : "bg-slate-950/40 text-slate-700 border-slate-800/60 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Compact Cards Horizontal Slider */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] glass-panel p-5 rounded-3xl border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-2 hover:scale-[1.01] transition-all duration-300 relative group cursor-pointer"
            >
              <Quote className="w-7 h-7 text-cyan-500/20 absolute top-4 right-4 pointer-events-none group-hover:text-cyan-400/30 transition-colors" />

              <div>
                {/* Star Rating & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified Buyer
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-300 italic leading-relaxed mb-4 line-clamp-4 group-hover:text-white transition-colors">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-xl object-cover border border-cyan-500/40 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">{t.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {t.role} • {t.location}
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="inline-block text-[10px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800/50 px-2 py-0.5 rounded-lg truncate max-w-full">
                    Bought: {t.serviceBought}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Counter Indicator Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-900 pt-4">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-cyan-400" />
            <span>Showing all 20 active customer reviews</span>
          </div>
          <span>Swipe or click arrows to view more</span>
        </div>
      </div>
    </section>
  );
}
