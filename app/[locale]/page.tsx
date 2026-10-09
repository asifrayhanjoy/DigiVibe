"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import RightDock from "@/components/RightDock";
import BackgroundSlider from "@/components/BackgroundSlider";
import PromotionalBanner from "@/components/PromotionalBanner";
import Footer from "@/components/Footer";

const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SERVICES } from "@/data/services";
import { CategoryId } from "@/types";

export default function HomePage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [servicesList, setServicesList] = useState(SERVICES);
  const { locale } = useLanguage();
  const { requireAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setServicesList(data.products);
        }
      })
      .catch((err) => console.error("Error loading home page products:", err));
  }, []);

  const handleProtectedNavigate = (targetPath: string) => {
    requireAuth(() => {
      router.push(targetPath);
    }, targetPath);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* DYNAMIC 3D BACKGROUND SLIDER (Rotates 5 3D Tech Images every 4s with Dark Overlay) */}
      <BackgroundSlider />

      {/* GLOBAL NAVBAR */}
      <Navbar
        cartCount={0}
        onOpenCart={() => { }}
        onOpenSearch={() => {
          requireAuth(() => setIsSearchModalOpen(true), `/${locale}/services`);
        }}
        currentLocale={locale}
      />

      {/* FLOATING RIGHT LAUNCHER DOCK */}
      <RightDock
        onOpenSearch={() => {
          requireAuth(() => setIsSearchModalOpen(true), `/${locale}/services`);
        }}
      />

      {/* HERO SECTION WITH SINGLE CENTRAL SEARCH BAR */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => {
          requireAuth(() => setIsSearchModalOpen(true), `/${locale}/services`);
        }}
      />

      {/* TOP PILL CATEGORY TABS (Prominent Translucent Glassmorphism Pills) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-6 md:my-10">
        <CategoryTabs
          activeCategory="all"
          onSelectCategory={(cat: CategoryId) => {
            handleProtectedNavigate(`/${locale}/services?cat=${cat}`);
          }}
          getCategoryCount={(catId) =>
            catId === "all" ? servicesList.length : servicesList.filter((s) => s.category === catId).length
          }
        />
      </div>

      {/* PARTNERSHIP BANNER */}
      <div className="relative z-10 mt-8">
        <PromotionalBanner />
      </div>

      {/* BOTTOM CALL TO ACTION BANNER */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950/90 via-cyan-950/30 to-slate-950/90 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-sans tracking-tight">
              Ready to Upgrade Your Digital Experience?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-3 leading-relaxed">
              Join 12,400+ Bangladeshi professionals & freelancers. Access VPNs, AI tools, and SIM bundles with 100% replacement warranty.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center">
              <button
                onClick={() => handleProtectedNavigate(`/${locale}/services`)}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Go to Service Shop
              </button>
              <Link
                href={`/${locale}/auth/signup`}
                className="px-8 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm rounded-xl border border-slate-700/80 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* SEARCH MODAL (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={servicesList.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))}
        onSelectService={(service) => {
          handleProtectedNavigate(`/${locale}/services?id=${service.id}&query=${encodeURIComponent(service.title)}#product-${service.id}`);
        }}
        onSearchSubmit={(q) => {
          handleProtectedNavigate(`/${locale}/services?query=${encodeURIComponent(q)}#catalog-grid`);
        }}
      />
    </div>
  );
}
