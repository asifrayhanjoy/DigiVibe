"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  User,
  LayoutGrid,
  ShoppingBag,
  HelpCircle,
  Settings,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface RightDockProps {
  onOpenSearch?: () => void;
}

export default function RightDock({ onOpenSearch }: RightDockProps) {
  const { locale } = useLanguage();
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { cartCount, openCart } = useCart();
  const router = useRouter();

  const handleProtectedNavigate = (path: string) => {
    requireAuth(() => {
      router.push(path);
    }, path);
  };

  return (
    <aside className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 p-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/60 transition-all duration-300 hover:border-cyan-500/30">
      {/* 1. Search Trigger */}
      <button
        onClick={() => {
          if (onOpenSearch) onOpenSearch();
        }}
        className="w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 flex items-center justify-center transition-all duration-200 group relative shadow-sm"
        title="Search Services (Ctrl + K)"
        aria-label="Search"
      >
        <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        <span className="absolute right-12 px-2.5 py-1 bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all whitespace-nowrap shadow-xl">
          Search Tools
        </span>
      </button>

      {/* 2. Instant Delivery Tracker / Catalog */}
      <button
        onClick={() => handleProtectedNavigate(`/${locale}/services`)}
        className="w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 flex items-center justify-center transition-all duration-200 group relative shadow-sm"
        title="Instant Catalog Launcher"
        aria-label="Catalog Launcher"
      >
        <LayoutGrid className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        <span className="absolute right-12 px-2.5 py-1 bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all whitespace-nowrap shadow-xl">
          Digital Launcher
        </span>
      </button>

      {/* 3. User Profile / Auth */}
      <button
        onClick={() => handleProtectedNavigate(`/${locale}/profile`)}
        className="w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 flex items-center justify-center transition-all duration-200 group relative shadow-sm"
        title="User Account"
        aria-label="User Account"
      >
        <User className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        <span className="absolute right-12 px-2.5 py-1 bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all whitespace-nowrap shadow-xl">
          {user?.name || "Account Profile"}
        </span>
      </button>

      {/* 4. Cart Drawer Button */}
      <button
        onClick={openCart}
        className="w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 flex items-center justify-center transition-all duration-200 group relative shadow-sm"
        title="Shopping Cart"
        aria-label="Cart"
      >
        <ShoppingBag className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg border border-slate-950 animate-pulse">
            {cartCount}
          </span>
        )}
        <span className="absolute right-12 px-2.5 py-1 bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all whitespace-nowrap shadow-xl">
          Shopping Cart ({cartCount})
        </span>
      </button>

      {/* 5. Support / Help */}
      <Link
        href={`/${locale}/support`}
        className="w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 flex items-center justify-center transition-all duration-200 group relative shadow-sm"
        title="Help & Support"
        aria-label="Support"
      >
        <HelpCircle className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
        <span className="absolute right-12 px-2.5 py-1 bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all whitespace-nowrap shadow-xl">
          24/7 Support Engine
        </span>
      </Link>

      <div className="w-6 h-px bg-slate-800 my-1" />

      {/* 6. Settings Accent Red Button (Strictly matching reference image bottom red circle!) */}
      <button
        onClick={() => handleProtectedNavigate(`/${locale}/profile?tab=settings`)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-lg shadow-rose-500/40 border border-rose-400/40 flex items-center justify-center transition-all duration-200 group relative scale-105 hover:scale-110 active:scale-95"
        title="Quick Settings"
        aria-label="Settings"
      >
        <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300" />
        <span className="absolute right-12 px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all whitespace-nowrap shadow-xl">
          Platform Settings
        </span>
      </button>
    </aside>
  );
}
