"use client";

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

const CheckoutModal = dynamic(() => import("@/components/CheckoutModal"), { ssr: false });
const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });
const AdminProductModal = dynamic(() => import("@/components/AdminProductModal"), { ssr: false });
import { SERVICES } from "@/data/services";
import { CategoryId, CartItem, ServiceItem } from "@/types";
import { SlidersHorizontal, ArrowUpDown, Sparkles, Info, Server, Headphones, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import VPNProductGrid from "@/components/VPNProductGrid";
import SimOfferGrid from "@/components/SimOfferGrid";

function ServicesContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [proxySubFilter, setProxySubFilter] = useState<"all" | "gb" | "ip">("all");
  const [smmSubFilter, setSmmSubFilter] = useState<"all" | "lifetime" | "30day" | "norefill">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "popular" | "newest">("featured");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);

  // Admin Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminModalMode, setAdminModalMode] = useState<"add" | "edit">("add");
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<ServiceItem | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const { locale, dict } = useLanguage();
  const { user, isAuthenticated, isLoading, requireAuth } = useAuth();
  const { cart, addToCart, openCart: contextOpenCart, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAdmin = user?.role === "admin" || (user?.email || "").toLowerCase() === "mdasifrayhanjoy2@gmail.com";

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (title: string, message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ title, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Fetch Database-driven Product Cards
  const fetchServicesFromDB = useCallback(async () => {
    try {
      setIsLoadingServices(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setServicesList(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch database products:", err);
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    fetchServicesFromDB();
  }, [fetchServicesFromDB]);

  // Admin Add / Edit Modal Handlers
  const handleOpenAddModal = useCallback(() => {
    setSelectedProductToEdit(null);
    setAdminModalMode("add");
    setIsAdminModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((service: ServiceItem) => {
    setSelectedProductToEdit(service);
    setAdminModalMode("edit");
    setIsAdminModalOpen(true);
  }, []);

  const handleSaveSuccess = useCallback((savedProduct: ServiceItem) => {
    showToast(
      adminModalMode === "edit" ? "Card Updated! ✨" : "Card Created! 🎉",
      `"${savedProduct.title}" has been saved to the database.`
    );
    if (savedProduct?.id) {
      setHighlightedId(savedProduct.id);
    }
    fetchServicesFromDB();
  }, [adminModalMode, fetchServicesFromDB]);

  const hasScrolledRef = useRef<string>("");

  // Handle incoming search query parameters & product ID scroll targeting on navigation
  useEffect(() => {
    if (!searchParams) return;
    const urlQuery = searchParams.get("query") || searchParams.get("q") || searchParams.get("search");
    const urlId = searchParams.get("id") || searchParams.get("product");
    const urlCat = searchParams.get("cat") || searchParams.get("category");

    // 1. Sync active category with URL parameter if explicitly provided
    if (urlCat) {
      setActiveCategory(urlCat as CategoryId);
    }

    // 2. Sync search query with URL parameter if explicitly provided
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }

    // 3. Handle product ID scroll & highlighting
    if (urlId) {
      setHighlightedId(urlId);
      const matched = servicesList.find((s) => s.id === urlId);
      if (matched) {
        setSearchQuery(matched.title);
        if (matched.category) {
          setActiveCategory(matched.category as CategoryId);
        }
      }
      const paramKey = `id-${urlId}`;
      if (hasScrolledRef.current !== paramKey) {
        hasScrolledRef.current = paramKey;
        setTimeout(() => {
          const el = document.getElementById(`product-${urlId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 400);
      }
    } else if (urlQuery) {
      const paramKey = `query-${urlQuery}`;
      if (hasScrolledRef.current !== paramKey) {
        hasScrolledRef.current = paramKey;
        setTimeout(() => {
          const el = document.getElementById("catalog-grid");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 400);
      }
    }
  }, [searchParams]);

  // Filter & Sort
  const processedServices = useMemo(() => {
    let list = servicesList.filter((service) => {
      const matchesCategory = activeCategory === "all" || service.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      list.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return (b.reviews || 0) - (a.reviews || 0);
      });
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else if (sortBy === "featured") {
      list.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return 0;
      });
    }

    return list;
  }, [servicesList, activeCategory, searchQuery, sortBy]);

  // Helper to determine if a service is an IP plan/piece product
  const isIpPlanProduct = (service: ServiceItem) => {
    const id = (service.id || "").toLowerCase();
    const title = (service.title || "").toLowerCase();
    const unit = (service.unit || "").toLowerCase();
    const badge = (service.badge || "").toLowerCase();

    return (
      id.includes("100pcs") ||
      id.includes("iprocket") ||
      title.includes("100 pcs ip") ||
      title.includes("ip rocket") ||
      unit.includes("pcs ip") ||
      unit.includes("min: 2") ||
      badge.includes("pcs ip")
    );
  };

  // Sub-filter for IP & Proxy Category and SMM Category
  const displayedServices = useMemo(() => {
    if (activeCategory === "ip") {
      if (proxySubFilter === "gb") {
        return processedServices.filter((s) => !isIpPlanProduct(s));
      }
      if (proxySubFilter === "ip") {
        return processedServices.filter((s) => isIpPlanProduct(s));
      }
      return processedServices;
    }

    if (activeCategory === "smm") {
      if (smmSubFilter === "lifetime") {
        return processedServices.filter((s) => {
          const text = (s.title + " " + ((s as any).subtitle || "") + " " + (s.badge || "") + " " + (s.features || []).join(" ")).toLowerCase();
          return text.includes("lifetime");
        });
      }
      if (smmSubFilter === "30day") {
        return processedServices.filter((s) => {
          const text = (s.title + " " + ((s as any).subtitle || "") + " " + (s.badge || "") + " " + (s.features || []).join(" ")).toLowerCase();
          return text.includes("30 day") || text.includes("30day") || text.includes("1 year") || text.includes("365d") || text.includes("365 day") || text.includes("90 day");
        });
      }
      if (smmSubFilter === "norefill") {
        return processedServices.filter((s) => {
          const text = (s.title + " " + ((s as any).subtitle || "") + " " + (s.badge || "") + " " + (s.features || []).join(" ")).toLowerCase();
          return text.includes("no refill") || text.includes("non refill");
        });
      }
      return processedServices;
    }

    return processedServices;
  }, [processedServices, activeCategory, proxySubFilter, smmSubFilter]);

  const handleAddToCart = useCallback((service: ServiceItem) => {
    addToCart(service);
    showToast("Added to Cart 🛒", `${service.title} added to cart.`);
  }, [addToCart]);

  const handleBuyNow = useCallback((service: ServiceItem) => {
    requireAuth(() => {
      setCheckoutItems([{ ...service, quantity: 1 }]);
      setIsCheckoutOpen(true);
    }, `/${locale}/services`);
  }, [requireAuth, locale]);

  const handleSelectCategory = useCallback((cat: CategoryId) => {
    setActiveCategory(cat);
    setSearchQuery("");
    if (cat === "ip") setProxySubFilter("all");
    if (cat === "smm") setSmmSubFilter("all");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <Navbar
        onOpenCart={contextOpenCart}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        currentLocale={locale}
      />

      {/* Header Banner */}
      <div className="pt-32 pb-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Digital Catalog 🇧🇩
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-3">
            All Digital Services & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Browse VPNs, SIM bundles, ChatGPT Plus, YouTube Premium, IP Proxies and Verified Emails with instant automated delivery.
          </p>
        </div>
      </div>

      {/* Categories & Sorting Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          getCategoryCount={(catId) =>
            catId === "all" ? servicesList.length : servicesList.filter((s) => s.category === catId).length
          }
        />

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 my-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          {/* Total Product Count & Admin Add Button */}
          <div className="flex flex-wrap items-center gap-3 font-semibold text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
              <span>
                Showing <span className="text-cyan-400 font-extrabold text-sm sm:text-base">{displayedServices.length}</span> Products
              </span>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="ml-auto sm:ml-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Service Card</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold bg-slate-950 border border-slate-800 hover:border-cyan-500/40 focus-within:border-cyan-400 rounded-xl px-3.5 py-2 transition-all duration-300 shadow-inner">
            <ArrowUpDown className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400 whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-950 text-cyan-300 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer pr-1 border-none"
            >
              <option value="featured" className="bg-slate-900 text-slate-200">
                🌟 Featured / Recommended
              </option>
              <option value="price-low" className="bg-slate-900 text-slate-200">
                📉 Price: Low to High
              </option>
              <option value="price-high" className="bg-slate-900 text-slate-200">
                📈 Price: High to Low
              </option>
              <option value="popular" className="bg-slate-900 text-slate-200">
                🔥 Most Popular / Best Selling
              </option>
              <option value="newest" className="bg-slate-900 text-slate-200">
                🆕 Newest Arrivals
              </option>
            </select>
            {sortBy !== "featured" && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full flex-1">
        {activeCategory === "ip" && (
          <>
            {/* Filter Buttons (All, GB, IP) */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setProxySubFilter("all")}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  proxySubFilter === "all"
                    ? "bg-slate-900/90 text-amber-300 border border-amber-500 shadow-md shadow-amber-500/10"
                    : "bg-slate-900/40 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setProxySubFilter("gb")}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  proxySubFilter === "gb"
                    ? "bg-slate-900/90 text-amber-300 border border-amber-500 shadow-md shadow-amber-500/10"
                    : "bg-slate-900/40 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                GB
              </button>
              <button
                type="button"
                onClick={() => setProxySubFilter("ip")}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  proxySubFilter === "ip"
                    ? "bg-slate-900/90 text-amber-300 border border-amber-500 shadow-md shadow-amber-500/10"
                    : "bg-slate-900/40 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                IP
              </button>
            </div>

            {/* Headline Notice */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-4 shadow-lg shadow-amber-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 p-2 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5 fill-amber-400/20" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-300 tracking-wide font-sans">
                    আপনি কত GB নিবেন তার উপর নির্ভর করবে Price গুলো/ IP বা proxy কেনার আগে Admin সাথে আলোচনা করে নিতে হবে
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Prices depend on how many GB you choose on the product card./ IP or proxy should be discussed with the admin before purchasing
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white border border-amber-500/40 hover:border-amber-400 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <span>📞 Contact Admin</span>
              </Link>
            </div>
          </>
        )}

        {activeCategory === "smm" && (
          <>
            {/* Filter Buttons */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSmmSubFilter("all")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "all"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-4 ring-sky-400/10 shadow-lg shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSmmSubFilter("lifetime")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "lifetime"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-4 ring-sky-400/10 shadow-lg shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                Lifetime Refill
              </button>
              <button
                type="button"
                onClick={() => setSmmSubFilter("30day")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "30day"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-4 ring-sky-400/10 shadow-lg shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                30 Days Refill
              </button>
              <button
                type="button"
                onClick={() => setSmmSubFilter("norefill")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "norefill"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-4 ring-sky-400/10 shadow-lg shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                No Refill
              </button>
            </div>

            {/* Headline Notice */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-amber-500/10 to-slate-900 border border-purple-500/30 flex items-center justify-between gap-4 shadow-lg shadow-purple-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 p-2 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 fill-purple-400/20" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-purple-200 tracking-wide font-sans leading-relaxed">
                    এখানে যে প্রাইসগুলো দেওয়া হয়েছে তা নির্দিষ্ট পরিমাণের জন্য। আপনি কতগুলো ফলোয়ার, লাইক, ভিউ বা মেম্বার নিতে চান তার উপর ভিত্তি করে প্রাইস কম-বেশি হতে পারে। সর্বোচ্চ বা নিজের পছন্দমতো পরিমাণে অর্ডার করতে চাইলে অ্যাডমিনের সাথে আলোচনা সাপেক্ষ (Contact Admin) ফিক্স করে নিতে হবে।
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Prices shown are for default quantities. Custom quantities require contacting admin to fix final pricing.
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-400 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <span>📞 Contact Admin</span>
              </Link>
            </div>
          </>
        )}

        {activeCategory === "hosting" ? (
          <div className="glass-panel p-8 sm:p-14 text-center rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 my-8 shadow-2xl flex flex-col items-center justify-center max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-lg shadow-amber-500/10">
              <Server className="w-10 h-10" />
            </div>

            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
              Hosting Service Announcement 🌐
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-white max-w-xl leading-relaxed mb-3">
              This service is currently unavailable. Please contact the admin directly for hosting inquiries.
            </h2>

            <p className="text-sm sm:text-base font-medium text-amber-300/90 max-w-lg mb-8 leading-relaxed font-sans">
              এই পরিষেবাটি বর্তমানে অনুপলব্ধ। হোস্টিং সংক্রান্ত অনুসন্ধানের জন্য সরাসরি অ্যাডমিনের সাথে যোগাযোগ করুন।
            </p>

            <Link
              href={`/${locale}/support`}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Headphones className="w-5 h-5 stroke-[2.5]" />
              <span>Contact Admin / অ্যাডমিনের সাথে যোগাযোগ করুন</span>
            </Link>
          </div>
        ) : activeCategory === "vpn" ? (
          <VPNProductGrid
            products={processedServices}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onEditProduct={handleOpenEditModal}
          />
        ) : activeCategory === "sim" ? (
          <SimOfferGrid
            simOffers={processedServices}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onEditOffer={handleOpenEditModal}
          />
        ) : displayedServices.length === 0 && !isAdmin ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-8">
            <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your category or search filter.</p>
          </div>
        ) : (
          <div id="catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Dedicated Admin Add New Card Placeholder Card */}
            {isAdmin && (
              <div
                onClick={handleOpenAddModal}
                className="group rounded-[28px] p-6 border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[520px] shadow-lg shadow-amber-500/5 hover:scale-[1.02]"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Plus className="w-8 h-8 stroke-[3]" />
                </div>
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full mb-2">
                  Admin Control
                </span>
                <h3 className="text-xl font-black text-amber-300 group-hover:text-amber-200">
                  + Add New Service Card
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Click here to create a new database-driven card with full title, images, badges, price, and features.
                </p>
              </div>
            )}

            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onEdit={handleOpenEditModal}
                isHighlighted={highlightedId === service.id || (!!searchQuery && searchQuery.trim().length >= 2 && service.title.toLowerCase().includes(searchQuery.toLowerCase()))}
              />
            ))}
          </div>
        )}
      </main>

      <Footer onSelectCategory={(cat) => setActiveCategory(cat as CategoryId)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        itemsToBuy={checkoutItems}
        totalAmount={checkoutItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)}
        onOrderSuccess={() => clearCart()}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={processedServices}
        onSelectService={(service) => {
          setSearchQuery(service.title);
          setHighlightedId(service.id);
          if (service.category) {
            setActiveCategory(service.category as CategoryId);
          }
          setTimeout(() => {
            const el = document.getElementById(`product-${service.id}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 200);
        }}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          setTimeout(() => {
            const el = document.getElementById("catalog-grid");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 200);
        }}
      />

      {/* Admin Add & Edit Service Card Modal */}
      <AdminProductModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        mode={adminModalMode}
        initialData={selectedProductToEdit}
        onSaveSuccess={handleSaveSuccess}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8 text-center font-bold text-cyan-400">Loading catalog...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
