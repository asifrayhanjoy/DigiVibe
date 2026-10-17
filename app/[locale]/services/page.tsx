"use client";

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import RightDock from "@/components/RightDock";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import VPNProductGrid from "@/components/VPNProductGrid";

import { SERVICES } from "@/data/services";
import { CategoryId, CartItem, ServiceItem } from "@/types";
import { SlidersHorizontal, ArrowUpDown, Sparkles, Info, Server, Headphones, Plus, Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getCanonicalCategory, getCategoryQueryParam, isCategoryMatch } from "@/lib/categories";
import { compareAlphabetical, sortAlphabetically } from "@/lib/sorting";

const CheckoutModal = dynamic(() => import("@/components/CheckoutModal"), { ssr: false });
const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });
const AdminProductModal = dynamic(() => import("@/components/AdminProductModal"), { ssr: false });

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCatParam = searchParams?.get("cat") || searchParams?.get("category") || "";
  const initialCategory: CategoryId = urlCatParam ? getCanonicalCategory({ category: urlCatParam }) : "all";

  const [activeCategory, setActiveCategory] = useState<CategoryId>(initialCategory);
  const [activeCatQueryParam, setActiveCatQueryParam] = useState<string>(urlCatParam);
  const [capturedCategoryParam, setCapturedCategoryParam] = useState<string>(urlCatParam);
  const [proxySubFilter, setProxySubFilter] = useState<"all" | "gb" | "ip">("all");
  const [smmSubFilter, setSmmSubFilter] = useState<"all" | "lifetime" | "30day" | "norefill">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "popular" | "newest">("featured");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("digivibe_deleted_products");
        if (stored) {
          const deletedSet = new Set<string>(JSON.parse(stored));
          return sortAlphabetically(
            SERVICES.filter((p) => {
              const pId = p.id || (p as any).productId || (p as any)._id;
              return !deletedSet.has(pId) && !deletedSet.has(p.id);
            })
          );
        }
      } catch (e) {}
    }
    return sortAlphabetically(SERVICES);
  });
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

  // Fetch Database-driven Product Cards (Safely synchronized with MongoDB Atlas)
  const fetchServicesFromDB = useCallback(async () => {
    try {
      setIsLoadingServices(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        const deletedSet = new Set<string>(Array.isArray(data.deletedIds) ? data.deletedIds : []);

        // Sync with localStorage
        if (typeof window !== "undefined") {
          try {
            const localStored: string[] = JSON.parse(localStorage.getItem("digivibe_deleted_products") || "[]");
            const combined = Array.from(new Set([...localStored, ...deletedSet]));
            localStorage.setItem("digivibe_deleted_products", JSON.stringify(combined));
            combined.forEach((id) => deletedSet.add(id));
          } catch (e) {}
        }

        // Filter out any deleted products from data.products
        const validProducts = data.products.filter((p: ServiceItem) => {
          const key = p.id || (p as any).productId || (p as any)._id;
          return !deletedSet.has(key) && !deletedSet.has((p as any).productId) && !deletedSet.has((p as any)._id);
        });

        setServicesList(sortAlphabetically(validProducts));
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

  // Admin Add / Edit Modal Handlers - Capture active category context before opening modal
  const handleOpenAddModal = useCallback(() => {
    const rawCat = searchParams?.get("cat") || searchParams?.get("category") || activeCatQueryParam;
    const effectiveQueryParam = rawCat || (activeCategory !== "all" ? getCategoryQueryParam(activeCategory, activeCategory) : "");
    setCapturedCategoryParam(effectiveQueryParam);
    setSelectedProductToEdit(null);
    setAdminModalMode("add");
    setIsAdminModalOpen(true);
  }, [searchParams, activeCatQueryParam, activeCategory]);

  const handleOpenEditModal = useCallback((service: ServiceItem) => {
    // 1. Capture the exact active category query parameter (e.g. cat=ai, cat=social, cat=proxies, etc.)
    const rawCat = searchParams?.get("cat") || searchParams?.get("category") || activeCatQueryParam;
    const itemCanonical = getCanonicalCategory(service);
    const effectiveCanonical = activeCategory !== "all" ? activeCategory : itemCanonical;
    const effectiveQueryParam = rawCat || getCategoryQueryParam(effectiveCanonical, effectiveCanonical);

    setCapturedCategoryParam(effectiveQueryParam);
    setSelectedProductToEdit(service);
    setAdminModalMode("edit");
    setIsAdminModalOpen(true);
  }, [searchParams, activeCatQueryParam, activeCategory]);

  const handleDeleteProduct = useCallback(async (service: ServiceItem) => {
    if (!service) return;
    const targetTitle = service.title || "this product";
    if (!window.confirm(`Are you sure you want to delete "${targetTitle}"? This action cannot be undone.`)) {
      return;
    }

    const targetId = service.id || (service as any).productId || (service as any)._id;
    if (!targetId) {
      showToast("Delete Error ❌", "Product identifier not found.");
      return;
    }

    // 1. Instant Optimistic State Update: immediately remove from servicesList
    setServicesList((prev) =>
      prev.filter((item) => {
        const itemId = item.id || (item as any).productId || (item as any)._id;
        return itemId !== targetId && itemId !== service.id && itemId !== (service as any)._id;
      })
    );

    // 2. Persist to localStorage immediately to prevent flash on reload
    if (typeof window !== "undefined") {
      try {
        const stored: string[] = JSON.parse(localStorage.getItem("digivibe_deleted_products") || "[]");
        if (!stored.includes(targetId)) stored.push(targetId);
        if (service.id && !stored.includes(service.id)) stored.push(service.id);
        if ((service as any)._id && !stored.includes((service as any)._id)) stored.push((service as any)._id);
        localStorage.setItem("digivibe_deleted_products", JSON.stringify(stored));
      } catch (e) {}
    }

    // 3. Make DELETE API call to backend
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(targetId)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: targetId,
          productId: service.id || (service as any).productId,
          _id: (service as any)._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Card Deleted 🗑️", `"${targetTitle}" has been deleted.`);
        fetchServicesFromDB();
      } else {
        showToast("Delete Failed ❌", data.message || "Could not delete product.");
        fetchServicesFromDB();
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      showToast("Delete Error ❌", err.message || "Failed to delete product.");
      fetchServicesFromDB();
    }
  }, [fetchServicesFromDB]);

  const handleSaveSuccess = useCallback((savedProduct: ServiceItem, returnUrl?: string, targetCategory?: string) => {
    showToast(
      adminModalMode === "edit" ? "Card Updated! ✨" : "Card Created! 🎉",
      `"${savedProduct.title}" has been saved to the database.`
    );
    if (savedProduct?.id) {
      setHighlightedId(savedProduct.id);
    }

    // Clean up from localStorage deleted products if restored or created
    if (typeof window !== "undefined") {
      try {
        const targetId = savedProduct.id || (savedProduct as any).productId || (savedProduct as any)._id;
        const stored: string[] = JSON.parse(localStorage.getItem("digivibe_deleted_products") || "[]");
        const filtered = stored.filter((id) => id !== targetId && id !== savedProduct.id && id !== (savedProduct as any)._id);
        localStorage.setItem("digivibe_deleted_products", JSON.stringify(filtered));
      } catch (e) {}
    }

    // 1. Instant Optimistic State Update: update ONLY the matching card in servicesList
    // Guarantees all products in that category remain 100% visible and loaded in A-Z order
    setServicesList((prevList) => {
      const targetId = (savedProduct.id || (savedProduct as any).productId || (savedProduct as any)._id || "").toString().trim();
      const targetDocId = ((savedProduct as any)._id || (savedProduct as any).id || "").toString().trim();

      const idx = prevList.findIndex((item) => {
        const itemId = (item.id || (item as any).productId || (item as any)._id || "").toString().trim();
        const itemDocId = ((item as any)._id || (item as any).productId || item.id || "").toString().trim();
        return (
          (targetId && (itemId === targetId || itemDocId === targetId)) ||
          (targetDocId && (itemId === targetDocId || itemDocId === targetDocId)) ||
          (item.title && savedProduct.title && item.title.trim().toLowerCase() === savedProduct.title.trim().toLowerCase())
        );
      });

      const customImg = ((savedProduct as any).imageUrl || savedProduct.image || savedProduct.logo || "").toString().trim();
      const normalizedSaved: ServiceItem = {
        ...savedProduct,
        category: getCanonicalCategory(savedProduct),
        duration: savedProduct.duration || savedProduct.validity || "7 Days",
        validity: savedProduct.validity || savedProduct.duration || "7 Days",
        inStock: savedProduct.inStock,
        stock: savedProduct.stock,
        status: (savedProduct as any).status || (savedProduct.inStock ? "in-stock" : "stock-out"),
        stockStatus: (savedProduct as any).stockStatus || (savedProduct.inStock ? "in-stock" : "stock-out"),
        badge: savedProduct.badge,
        subtitle: savedProduct.subtitle !== undefined ? savedProduct.subtitle : savedProduct.badge,
        tag: savedProduct.tag || savedProduct.badge,
        imageUrl: customImg,
        logo: customImg,
        image: customImg,
        logoType: (savedProduct as any).logoType ?? "",
      };

      if (idx !== -1) {
        const nextList = [...prevList];
        nextList[idx] = {
          ...nextList[idx],
          ...normalizedSaved,
        };
        return sortAlphabetically(nextList);
      }
      return sortAlphabetically([normalizedSaved, ...prevList]);
    });

    // 2. Clear any search filter so the full product list in the category remains visible
    setSearchQuery("");

    // 3. Dynamic Category-Aware Redirect:
    // Determine the exact query parameter that was active before editing (e.g. cat=ai, cat=social, cat=email, cat=vpn, cat=proxies, cat=telegram, cat=hosting, cat=advanced)
    const rawTargetParam = capturedCategoryParam || activeCatQueryParam;
    const canonicalDestination: CategoryId = (activeCategory && activeCategory !== "all")
      ? activeCategory
      : (rawTargetParam ? getCanonicalCategory({ category: rawTargetParam }) : (targetCategory && targetCategory !== "all" ? (targetCategory as CategoryId) : getCanonicalCategory(savedProduct)));

    const effectiveQueryParam = rawTargetParam || (canonicalDestination !== "all" ? getCategoryQueryParam(canonicalDestination, canonicalDestination) : "");

    // Keep active category state and active query param fully synchronized
    setActiveCategory(canonicalDestination);
    if (effectiveQueryParam) {
      setActiveCatQueryParam(effectiveQueryParam);
      setCapturedCategoryParam(effectiveQueryParam);
    }

    const targetPath = effectiveQueryParam && effectiveQueryParam !== "all"
      ? `/${locale}/services?cat=${effectiveQueryParam}`
      : `/${locale}/services`;

    router.replace(targetPath, { scroll: false });

    // 4. Trigger cache revalidation and background DB sync
    router.refresh();
    fetchServicesFromDB();

    // 5. Smoothly scroll into view and highlight the edited product card
    setTimeout(() => {
      const el = document.getElementById(`product-${savedProduct.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  }, [adminModalMode, capturedCategoryParam, activeCatQueryParam, activeCategory, locale, router, fetchServicesFromDB]);

  const hasScrolledRef = useRef<string>("");

  // Handle incoming search query parameters & product ID scroll targeting on navigation
  useEffect(() => {
    if (!searchParams) return;
    const urlQuery = searchParams.get("query") || searchParams.get("q") || searchParams.get("search");
    const urlId = searchParams.get("id") || searchParams.get("product");
    const urlCat = searchParams.get("cat") || searchParams.get("category");

    // 1. Sync active category with URL parameter
    if (urlCat) {
      const canonical = getCanonicalCategory({ category: urlCat });
      setActiveCategory((prev) => (prev !== canonical ? canonical : prev));
      setActiveCatQueryParam((prev) => (prev !== urlCat ? urlCat : prev));
      setCapturedCategoryParam((prev) => (prev !== urlCat ? urlCat : prev));
    } else if (!urlId) {
      setActiveCategory((prev) => (prev !== "all" ? "all" : prev));
      setActiveCatQueryParam((prev) => (prev !== "" ? "" : prev));
      setCapturedCategoryParam((prev) => (prev !== "" ? "" : prev));
    }

    // 2. Sync search query with URL parameter ONLY if explicitly provided as search query
    if (urlQuery) {
      setSearchQuery((prev) => (prev !== urlQuery ? urlQuery : prev));
    }

    // 3. Handle product ID scroll & highlighting WITHOUT mutating or restricting searchQuery
    if (urlId) {
      setHighlightedId((prev) => (prev !== urlId ? urlId : prev));
      const matched = servicesList.find((s) => s.id === urlId || (s as any)._id === urlId || (s as any).productId === urlId);
      if (matched && !urlCat) {
        const canonical = getCanonicalCategory(matched);
        if (canonical && canonical !== "all") {
          setActiveCategory((prev) => (prev !== canonical ? canonical : prev));
          setActiveCatQueryParam((prev) => (prev !== canonical ? canonical : prev));
          setCapturedCategoryParam((prev) => (prev !== canonical ? canonical : prev));
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
  }, [searchParams, servicesList]);

  // Strict Filter & Sort - Preserves full category array and A-Z ordering
  const processedServices = useMemo(() => {
    let list = servicesList.filter((service) => {
      const matchesCategory = activeCategory === "all" || isCategoryMatch(service, activeCategory);
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase());
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
        return compareAlphabetical(a, b);
      });
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else {
      // Default & Featured: Strict Universal A-Z Alphabetical Ordering across all categories
      list.sort(compareAlphabetical);
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

  const PAGE_SIZE = 24;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset visibleCount when category, search, or filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, proxySubFilter, smmSubFilter, searchQuery, sortBy]);

  // Ensure targeted product is visible if ID passed in URL
  useEffect(() => {
    if (!searchParams) return;
    const urlId = searchParams.get("id") || searchParams.get("product");
    if (urlId) {
      const idx = displayedServices.findIndex(
        (s) => s.id === urlId || (s as any)._id === urlId || (s as any).productId === urlId
      );
      if (idx !== -1 && idx >= visibleCount) {
        setVisibleCount(idx + PAGE_SIZE);
      }
    }
  }, [searchParams, displayedServices, visibleCount]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (visibleCount >= displayedServices.length) return;
    const target = loadMoreSentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayedServices.length));
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, displayedServices.length]);

  const paginatedServices = useMemo(() => {
    return displayedServices.slice(0, visibleCount);
  }, [displayedServices, visibleCount]);

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

  const handleSelectCategory = useCallback((cat: CategoryId | string) => {
    const canonical = getCanonicalCategory({ category: cat });
    setActiveCategory(canonical);
    setSearchQuery("");
    if (canonical === "ip") setProxySubFilter("all");
    if (canonical === "smm") setSmmSubFilter("all");

    // Preserve alias if valid or map canonical to query parameter
    const queryParam = getCategoryQueryParam(cat, canonical);
    setActiveCatQueryParam(queryParam);
    setCapturedCategoryParam(queryParam);

    // Dynamically synchronize the URL with the chosen category tab
    const targetPath = canonical === "all" || !queryParam || queryParam === "all" ? `/${locale}/services` : `/${locale}/services?cat=${queryParam}`;
    router.replace(targetPath, { scroll: false });
  }, [locale, router]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      <Navbar
        onOpenCart={contextOpenCart}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        currentLocale={locale}
      />

      <RightDock
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Header Banner */}
      <div className="relative z-10 pt-24 pb-4 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-[#070b16]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Digital Shop Catalog 🇧🇩
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-2 font-sans">
            Digital Tools & Subscriptions Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
            Browse VPNs, ChatGPT Plus, YouTube Premium, IP Proxies, Social Media Service and PVA Emails.
          </p>
        </div>
      </div>

      {/* Categories & Sorting Toolbar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 w-full">
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          getCategoryCount={(catId) =>
            catId === "all"
              ? servicesList.length
              : servicesList.filter((s) => isCategoryMatch(s, catId)).length
          }
        />

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5 mt-2.5 mb-3 sm:mt-3 sm:mb-3.5 p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
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
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold bg-slate-950 border border-slate-800 hover:border-cyan-500/40 focus-within:border-cyan-400 rounded-xl px-3.5 py-1.5 transition-all duration-300 shadow-inner">
            <ArrowUpDown className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400 whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-950 text-cyan-300 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer pr-1 border-none"
            >
              <option value="featured" className="bg-slate-900 text-slate-200">
                🔤 Alphabetical (A to Z)
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
            <div className="flex items-center gap-2.5 mb-2.5">
              <button
                type="button"
                onClick={() => setProxySubFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  proxySubFilter === "ip"
                    ? "bg-slate-900/90 text-amber-300 border border-amber-500 shadow-md shadow-amber-500/10"
                    : "bg-slate-900/40 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                IP
              </button>
            </div>

            {/* Headline Notice */}
            <div className="mb-3 sm:mb-3.5 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-3.5 shadow-lg shadow-amber-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 p-1.5 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-4 h-4 fill-amber-400/20" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide font-sans">
                    আপনি কত GB নিবেন তার উপর নির্ভর করবে Price গুলো/ IP বা proxy কেনার আগে Admin সাথে আলোচনা করে নিতে হবে
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Prices depend on how many GB you choose on the product card./ IP or proxy should be discussed with the admin before purchasing
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-black bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white border border-amber-500/40 hover:border-amber-400 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <span>📞 Contact Admin</span>
              </Link>
            </div>
          </>
        )}

        {activeCategory === "smm" && (
          <>
            {/* Filter Buttons */}
            <div className="flex items-center gap-2.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSmmSubFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "all"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-2 ring-sky-400/20 shadow-md shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSmmSubFilter("lifetime")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "lifetime"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-2 ring-sky-400/20 shadow-md shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                Lifetime Refill
              </button>
              <button
                type="button"
                onClick={() => setSmmSubFilter("30day")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "30day"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-2 ring-sky-400/20 shadow-md shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                30 Days Refill
              </button>
              <button
                type="button"
                onClick={() => setSmmSubFilter("norefill")}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  smmSubFilter === "norefill"
                    ? "bg-slate-900/90 text-amber-400 border-2 border-sky-400/90 ring-2 ring-sky-400/20 shadow-md shadow-sky-500/10"
                    : "bg-slate-900/40 text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white"
                }`}
              >
                No Refill
              </button>
            </div>

            {/* Headline Notice */}
            <div className="mb-3 sm:mb-3.5 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-purple-500/15 via-amber-500/10 to-slate-900 border border-purple-500/30 flex items-center justify-between gap-3.5 shadow-lg shadow-purple-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 p-1.5 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 fill-purple-400/20" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-purple-200 tracking-wide font-sans leading-snug">
                    এখানে যে প্রাইসগুলো দেওয়া হয়েছে তা নির্দিষ্ট পরিমাণের জন্য। আপনি কতগুলো ফলোয়ার, লাইক, ভিউ বা মেম্বার নিতে চান তার উপর ভিত্তি করে প্রাইস কম-বেশি হতে পারে। সর্বোচ্চ বা নিজের পছন্দমতো পরিমাণে অর্ডার করতে চাইলে অ্যাডমিনের সাথে আলোচনা সাপেক্ষ (Contact Admin) ফিক্স করে নিতে হবে।
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Prices shown are for default quantities. Custom quantities require contacting admin to fix final pricing.
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-black bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-400 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <span>📞 Contact Admin</span>
              </Link>
            </div>
          </>
        )}

        {activeCategory === "advanced" && (
          <div className="mb-3 sm:mb-3.5 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-slate-900 border border-cyan-500/30 flex items-center justify-between gap-3.5 shadow-lg shadow-cyan-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 p-1.5 flex items-center justify-center text-cyan-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-cyan-300 tracking-wide font-sans">
                  Advanced Service Catalog ⚙️
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Enterprise-grade digital solutions, high-performance RDP servers, and custom automation.
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/support`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-black bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <span>📞 Contact Admin</span>
            </Link>
          </div>
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
            onDeleteProduct={handleDeleteProduct}
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
                className="group rounded-2xl p-4 border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[240px] shadow-lg shadow-amber-500/5 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full mb-1">
                  Admin Control
                </span>
                <h3 className="text-base font-black text-amber-300 group-hover:text-amber-200">
                  + Add New Card
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-tight">
                  Create a new database-driven product card.
                </p>
              </div>
            )}

            {paginatedServices.map((service) => {
              const serviceKey = (service.id || (service as any)._id || service.title || "").toString();
              return (
                <ServiceCard
                  key={serviceKey}
                  service={service}
                  currentCategory={activeCategory}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteProduct}
                  isHighlighted={highlightedId === service.id || (!!searchQuery && searchQuery.trim().length >= 2 && service.title.toLowerCase().includes(searchQuery.toLowerCase()))}
                />
              );
            })}
          </div>
        )}

        {/* Load More Button & Infinite Scroll Sentinel */}
        {activeCategory !== "hosting" && activeCategory !== "vpn" && visibleCount < displayedServices.length && (
          <div className="flex flex-col items-center justify-center mt-10 mb-4 gap-3">
            <p className="text-xs text-slate-400 font-medium">
              Showing <span className="text-cyan-400 font-bold">{Math.min(visibleCount, displayedServices.length)}</span> of{" "}
              <span className="text-white font-bold">{displayedServices.length}</span> products
            </p>
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayedServices.length))}
              className="px-6 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-500/40 hover:border-cyan-400 transition-all duration-200 shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Load More Products ▾
            </button>
            <div ref={loadMoreSentinelRef} className="h-6 w-full pointer-events-none" />
          </div>
        )}
      </main>

      <Footer onSelectCategory={(cat) => handleSelectCategory(cat as CategoryId)} />

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
        currentCategory={activeCategory}
        categoryParam={capturedCategoryParam || activeCatQueryParam}
        returnUrl={
          (capturedCategoryParam || activeCatQueryParam) && (capturedCategoryParam || activeCatQueryParam) !== "all"
            ? `/${locale}/services?cat=${capturedCategoryParam || activeCatQueryParam}`
            : (activeCategory !== "all" ? `/${locale}/services?cat=${getCategoryQueryParam(activeCategory, activeCategory)}` : `/${locale}/services`)
        }
        locale={locale}
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
