"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
    <div className="relative w-full group py-2 transform-gpu">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scrollByOffset(-240)}
          aria-label="Scroll Left"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/95 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-black/50 backdrop-blur-md hover:bg-cyan-500 hover:text-slate-950 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scrollByOffset(240)}
          aria-label="Scroll Right"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/95 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-black/50 backdrop-blur-md hover:bg-cyan-500 hover:text-slate-950 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth touch-pan-x overscroll-x-contain py-2 px-1 cursor-grab active:cursor-grabbing select-none"
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
              className={`flex flex-row items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer shrink-0 text-xs sm:text-sm font-semibold select-none whitespace-nowrap will-change-transform transform-gpu ${
                isActive
                  ? "bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]"
                  : "bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span className="font-medium text-slate-200">{categoryLabel}</span>
              <span
                className={`px-2 py-0.5 text-[11px] sm:text-xs font-bold rounded-full transition-colors shrink-0 ${
                  isActive
                    ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
export default React.memo(CategoryTabs);
