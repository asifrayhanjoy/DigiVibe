"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import {
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Globe,
  TrendingUp,
  Mail,
  Send,
  Server,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { CATEGORIES } from "@/data/services";
import { CategoryId } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const ICON_MAP: Record<string, any> = {
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Globe,
  TrendingUp,
  Mail,
  Send,
  Server,
  FileText,
};

interface CategoryTabsProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  getCategoryCount?: (id: CategoryId) => number;
}

function CategoryTabs({
  activeCategory,
  onSelectCategory,
  getCategoryCount
}: CategoryTabsProps) {
  const { locale } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse Drag state
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const nextLeft = scrollLeft > 5;
    const nextRight = scrollLeft + clientWidth < scrollWidth - 5;
    setCanScrollLeft((prev) => (prev !== nextLeft ? nextLeft : prev));
    setCanScrollRight((prev) => (prev !== nextRight ? nextRight : prev));
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll, { passive: true });
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollByOffset = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-2 transform-gpu">
      {/* Unified Glassmorphism Background Container Bar */}
      <div className="relative w-full rounded-2xl sm:rounded-full bg-slate-950/75 border border-slate-800/90 backdrop-blur-2xl p-1.5 sm:p-2 shadow-2xl overflow-hidden group">
        
        {/* Scroll Gradient Masks */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none rounded-l-2xl sm:rounded-l-full" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none rounded-r-2xl sm:rounded-r-full" />
        )}

        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByOffset(-240)}
            aria-label="Scroll Left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-400 shadow-xl backdrop-blur-md hover:bg-cyan-500 hover:text-slate-950 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scrollByOffset(240)}
            aria-label="Scroll Right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-400 shadow-xl backdrop-blur-md hover:bg-cyan-500 hover:text-slate-950 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        )}

        {/* Scroll Container (Expanded Leftward Alignment) */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className="flex items-center justify-start gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth touch-pan-x overscroll-x-contain py-1.5 pl-2.5 sm:pl-3.5 pr-10 sm:pr-12 cursor-grab active:cursor-grabbing select-none w-full"
        >
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || LayoutGrid;
            const isActive = activeCategory === cat.id;
            const count = getCategoryCount ? getCategoryCount(cat.id as CategoryId) : cat.count;
            const categoryLabel = (locale === "bn" ? cat.labelBn : cat.labelEn) || cat.label || cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`pill-tab shrink-0 ${isActive ? "pill-tab-active" : ""}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-white scale-110" : "text-cyan-400"}`} />
                <span className="font-extrabold text-xs sm:text-sm tracking-wide">{categoryLabel}</span>
                <span
                  className={`px-2.5 py-0.5 text-[11px] sm:text-xs font-black rounded-full transition-colors shrink-0 ${
                    isActive
                      ? "bg-white/25 text-white border border-white/40 shadow-sm"
                      : "bg-slate-800/90 text-cyan-300 border border-slate-700/80"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(CategoryTabs);
