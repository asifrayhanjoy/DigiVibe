"use client";

import {
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Globe,
  TrendingUp,
  Mail
} from "lucide-react";
import { CATEGORIES } from "@/data/services";
import { CategoryId } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const ICON_MAP: Record<string, any> = {
  LayoutGrid: LayoutGrid,
  ShieldCheck: ShieldCheck,
  Smartphone: Smartphone,
  Sparkles: Sparkles,
  Globe: Globe,
  TrendingUp: TrendingUp,
  Mail: Mail,
};

interface CategoryTabsProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  getCategoryCount?: (id: CategoryId) => number;
}

export default function CategoryTabs({
  activeCategory,
  onSelectCategory,
  getCategoryCount
}: CategoryTabsProps) {
  const { locale } = useLanguage();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 px-1">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-max justify-start md:justify-center flex-nowrap">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || LayoutGrid;
          const isActive = activeCategory === cat.id;
          const count = getCategoryCount ? getCategoryCount(cat.id as CategoryId) : cat.count;
          const categoryLabel = (locale === "bn" ? cat.labelBn : cat.labelEn) || cat.label || cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId)}
              className={`flex flex-row items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-300 cursor-pointer min-w-[110px] text-xs sm:text-sm font-semibold select-none ${
                isActive
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span className="whitespace-nowrap font-medium text-slate-200">{categoryLabel}</span>
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

