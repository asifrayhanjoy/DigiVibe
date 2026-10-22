"use client";

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import RightDock from "@/components/RightDock";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import VPNProductGrid from "@/components/VPNProductGrid";

import { SERVICES } from "@/data/services";
import { CategoryId, CartItem, ServiceItem } from "@/types";
import { SlidersHorizontal, ArrowUpDown, Sparkles, Info, Server, Headphones, Plus, Cpu, Globe, Code2, MapPin, ShieldCheck, CheckCircle2, Send, Smartphone, Video, TrendingUp, Laptop, FileText, Layers, ShieldAlert, Film, Wrench, CreditCard, Palette, Mic, Layout, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getCanonicalCategory, getCategoryQueryParam, isCategoryMatch } from "@/lib/categories";
import { compareAlphabetical, sortAlphabetically, deduplicateServices } from "@/lib/sorting";

import CheckoutModal from "@/components/CheckoutModal";
import SearchModal from "@/components/SearchModal";
import AdminProductModal from "@/components/AdminProductModal";

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

  const [servicesList, setServicesList] = useState<ServiceItem[]>(() =>
    sortAlphabetically(deduplicateServices(SERVICES))
  );
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);

  // Sync client-side cached pins/deletions safely after initial hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem("digivibe_deleted_products");
      const storedPinned = localStorage.getItem("digivibe_pinned_products");
      if (stored || storedPinned) {
        const deletedSet = new Set<string>(stored ? JSON.parse(stored) : []);
        const pinnedSet = new Set<string>(storedPinned ? JSON.parse(storedPinned) : []);
        setServicesList((prev) =>
          sortAlphabetically(
            deduplicateServices(
              prev
                .filter((p) => {
                  const pId = p.id || (p as any).productId || (p as any)._id;
                  return !deletedSet.has(pId) && !deletedSet.has(p.id);
                })
                .map((p) => {
                  const pId = p.id || (p as any).productId || (p as any)._id;
                  const isPinned = !!((p as any).isPinned || (p as any).pinned || pinnedSet.has(pId) || pinnedSet.has(p.id));
                  return {
                    ...p,
                    isPinned,
                    pinned: isPinned,
                  };
                })
            )
          )
        );
      }
    } catch (e) {}
  }, []);

  // Admin Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminModalMode, setAdminModalMode] = useState<"add" | "edit">("add");
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<ServiceItem | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const { locale, dict } = useLanguage();
  const isBn = locale === "bn";
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

        // Sync pinned items with localStorage
        const pinnedSet = new Set<string>();
        if (typeof window !== "undefined") {
          try {
            const localPinned: string[] = JSON.parse(localStorage.getItem("digivibe_pinned_products") || "[]");
            localPinned.forEach((id) => pinnedSet.add(id));
          } catch (e) {}
        }

        // Filter out any deleted products from data.products and ensure strict deduplication
        const validProducts: ServiceItem[] = deduplicateServices<ServiceItem>(
          data.products
            .filter((p: ServiceItem) => {
              const key = p.id || (p as any).productId || (p as any)._id;
              return !deletedSet.has(key) && !deletedSet.has((p as any).productId) && !deletedSet.has((p as any)._id);
            })
            .map((p: ServiceItem) => {
              const key = (p.id || (p as any).productId || (p as any)._id || "").toString();
              const isPinned = !!(p.isPinned ?? (p as any).pinned ?? pinnedSet.has(key));
              return {
                ...p,
                isPinned,
                pinned: isPinned,
              };
            })
        );

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

  // Admin Pin / Unpin Toggle Handler
  const handleTogglePinProduct = useCallback(async (service: ServiceItem) => {
    const targetId = (service.id || (service as any)._id || (service as any).productId || "").toString().trim();
    if (!targetId) return;

    const currentPin = !!(service.isPinned || (service as any).pinned);
    const newPinState = !currentPin;

    // 1. Instant Optimistic State Update: toggle isPinned in servicesList
    setServicesList((prevList) =>
      prevList.map((item) => {
        const itemKey = (item.id || (item as any)._id || (item as any).productId || "").toString().trim();
        if (itemKey === targetId || item.id === service.id) {
          return {
            ...item,
            isPinned: newPinState,
            pinned: newPinState,
          };
        }
        return item;
      })
    );

    // 2. Persist in localStorage for instant retrieval
    if (typeof window !== "undefined") {
      try {
        const storedPinned: string[] = JSON.parse(localStorage.getItem("digivibe_pinned_products") || "[]");
        let updatedPinned: string[];
        if (newPinState) {
          updatedPinned = Array.from(new Set([...storedPinned, targetId, service.id].filter(Boolean)));
        } else {
          updatedPinned = storedPinned.filter((id) => id !== targetId && id !== service.id);
        }
        localStorage.setItem("digivibe_pinned_products", JSON.stringify(updatedPinned));
      } catch (e) {}
    }

    showToast(
      newPinState ? (isBn ? "সার্ভিসটি উপরে পিন করা হয়েছে 📌" : "Service Pinned to Top 📌") : (isBn ? "পিন সরানো হয়েছে" : "Service Unpinned"),
      `${service.title} ${newPinState ? (isBn ? "লিস্টের শুরুতে রাখা হয়েছে।" : "is now pinned to the top of the catalog.") : (isBn ? "স্বাভাবিক স্থানে ফিরে গেছে।" : "has been unpinned.")}`
    );

    // 3. Persist to MongoDB Database via PUT
    try {
      await fetch(`/api/products/${encodeURIComponent(targetId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: newPinState, pinned: newPinState }),
      });
    } catch (err) {
      console.error("Failed to persist pin status to database:", err);
    }
  }, [isBn]);

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
      const filteredPrev = prevList.filter((item) => {
        const itemId = (item.id || (item as any).productId || (item as any)._id || "").toString().trim();
        const itemDocId = ((item as any)._id || (item as any).productId || item.id || "").toString().trim();
        const matchesTarget = (targetId && (itemId === targetId || itemDocId === targetId)) || (targetDocId && (itemId === targetDocId || itemDocId === targetDocId));
        const matchesTitle = item.title && savedProduct.title && item.title.trim().toLowerCase() === savedProduct.title.trim().toLowerCase();
        return !matchesTarget && !matchesTitle;
      });
      return sortAlphabetically([normalizedSaved, ...filteredPrev]);
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

  // Strict Filter & Sort - Preserves full category array and A-Z ordering with complete deduplication
  const processedServices = useMemo(() => {
    let list = servicesList.filter((service) => {
      const matchesCategory = activeCategory === "all" || isCategoryMatch(service, activeCategory);
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    list = deduplicateServices(list);

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

    // Pinned services automatically appear first / at the very top of the list
    list.sort((a, b) => {
      const isPinnedA = !!(a.isPinned || (a as any).pinned);
      const isPinnedB = !!(b.isPinned || (b as any).pinned);
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;
      return 0;
    });

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
    let result = processedServices;
    if (activeCategory === "ip") {
      if (proxySubFilter === "gb") {
        result = processedServices.filter((s) => !isIpPlanProduct(s));
      } else if (proxySubFilter === "ip") {
        result = processedServices.filter((s) => isIpPlanProduct(s));
      }
    } else if (activeCategory === "smm") {
      if (smmSubFilter === "lifetime") {
        result = processedServices.filter((s) => {
          const text = (s.title + " " + ((s as any).subtitle || "") + " " + (s.badge || "") + " " + (s.features || []).join(" ")).toLowerCase();
          return text.includes("lifetime");
        });
      } else if (smmSubFilter === "30day") {
        result = processedServices.filter((s) => {
          const text = (s.title + " " + ((s as any).subtitle || "") + " " + (s.badge || "") + " " + (s.features || []).join(" ")).toLowerCase();
          return text.includes("30 day") || text.includes("30day") || text.includes("1 year") || text.includes("365d") || text.includes("365 day") || text.includes("90 day");
        });
      } else if (smmSubFilter === "norefill") {
        result = processedServices.filter((s) => {
          const text = (s.title + " " + ((s as any).subtitle || "") + " " + (s.badge || "") + " " + (s.features || []).join(" ")).toLowerCase();
          return text.includes("no refill") || text.includes("non refill");
        });
      }
    }

    return deduplicateServices(result);
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
              : catId === "tech"
                ? Math.max(9, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                : catId === "ai-voice"
                  ? Math.max(9, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                  : catId === "security"
                    ? Math.max(8, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                    : catId === "media-marketing"
                      ? Math.max(9, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                      : catId === "utilities"
                        ? Math.max(8, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                        : catId === "advanced"
                          ? Math.max(43, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                          : catId === "student"
                            ? Math.max(4, servicesList.filter((s) => isCategoryMatch(s, catId)).length)
                            : servicesList.filter((s) => isCategoryMatch(s, catId)).length
          }
        />

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5 mt-2.5 mb-3 sm:mt-3 sm:mb-3.5 p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          {/* Total Product Count & Admin Add Button */}
          <div className="flex flex-wrap items-center gap-3 font-semibold text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
              <span>
                Showing <span suppressHydrationWarning className="text-cyan-400 font-extrabold text-sm sm:text-base">
                  {activeCategory === "tech"
                    ? Math.max(9, displayedServices.length)
                    : activeCategory === "ai-voice"
                      ? Math.max(9, displayedServices.length)
                      : activeCategory === "security"
                        ? Math.max(8, displayedServices.length)
                        : activeCategory === "media-marketing"
                          ? Math.max(9, displayedServices.length)
                          : activeCategory === "utilities"
                            ? Math.max(8, displayedServices.length)
                            : activeCategory === "advanced"
                              ? Math.max(43, displayedServices.length)
                              : activeCategory === "student"
                                ? Math.max(4, displayedServices.length)
                                : displayedServices.length}
                </span> Products
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

        {activeCategory === "student" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-teal-950/60 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-emerald-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-2 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-emerald-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "স্টুডেন্ট সার্ভিসেস 🎓" : "Student Service Catalog 🎓"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "অ্যাসাইনমেন্ট ও থিসিস টাইপিং, প্রেজেন্টেশন স্লাইড, সিভি রাইটিং ও স্টুডেন্ট প্রজেক্ট সাপোর্ট।"
                    : "Assignment & thesis typing, presentation slides, CV writing, and student project support."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
          </div>
        )}

        {activeCategory === "tech" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-cyan-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 p-2 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-cyan-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "অ্যাডভান্সড টেক সার্ভিসেস ⚙️" : "Advanced Tech Catalog ⚙️"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "নতুন ওয়েবসাইট তৈরি, কাস্টম সফটওয়্যার ও অ্যাপ, এপিআই সংযোগ, বাগ ফিক্সিং ও ক্লাউড অটোমেশন।"
                    : "Custom website development, software apps, third-party API integration, and cloud DevOps."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
          </div>
        )}

        {activeCategory === "ai-voice" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-purple-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 p-2 flex items-center justify-center text-purple-400 shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-purple-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "এআই ও ভয়েস অটোমেশন 🤖" : "AI & Voice Automation Catalog 🤖"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "ফুল ডিভাইস কন্ট্রোল এআই অ্যাসিস্ট্যান্ট, ভয়েস নোট সামারি, স্মার্ট ইমেল ড্রাফটিং ও লাইভ ল্যাঙ্গুয়েজ ট্রান্সলেশন।"
                    : "Universal device AI control, voice note summaries, smart emails, and live translation tools."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-white border border-purple-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
          </div>
        )}

        {activeCategory === "security" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900/80 to-rose-950/60 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-red-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 p-2 flex items-center justify-center text-red-400 shrink-0 shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-red-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "ডিজিটাল সিকিউরিটি ও লোকেশন ট্র্যাকিং 🛡️" : "Digital Security Catalog 🛡️"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "মোবাইল লোকেশন ট্র্যাকিং, সাইবার সিকিউরিটি অডিট, বায়োমেট্রিক ভয়েস লক ও রিমোট ডিভাইস কন্ট্রোল।"
                    : "Real-time location tracking, cyber security audits, voice locks, and secure device control."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
          </div>
        )}

        {activeCategory === "media-marketing" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-950/60 via-slate-900/80 to-rose-950/60 border border-pink-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-pink-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 p-2 flex items-center justify-center text-pink-400 shrink-0 shadow-md">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-pink-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "মিডিয়া ও মার্কেটিং সার্ভিসেস 🎬" : "Media & Marketing Catalog 🎬"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "আকর্ষণীয় ভিডিও এডিটিং, পেজ ও চ্যানেল গ্রোথ মাস্টারক্লাস, গ্রাফিক ডিজাইন ও ইউআই/ইউএক্স প্রোটোটাইপ।"
                    : "Professional video editing, page growth masterclasses, graphic design, and UI/UX."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 hover:text-white border border-pink-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
          </div>
        )}

        {activeCategory === "utilities" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900/80 to-orange-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-amber-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 p-2 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "স্মার্ট ইউটিলিটি ও বিজনেস টুলস 🔧" : "Smart Utilities Catalog 🔧"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "অটো রেন্ট ও ইউটিলিটি বিল পেয়ার, ট্রাভেল রুট প্ল্যানার, রেস্টুরেন্ট কিউআর মেনু ও লোকাল পিওএস সফটওয়্যার।"
                    : "Automated utility billing, travel route planning, restaurant QR menus, and local POS software."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
          </div>
        )}

        {activeCategory === "advanced" && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-indigo-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg shadow-cyan-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 p-2 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-cyan-300 tracking-wide font-sans flex items-center gap-2">
                  <span>{locale === "bn" ? "সহজ অ্যাডভান্সড সার্ভিসেস ⚙️" : "Advanced Service Catalog ⚙️"}</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {locale === "bn"
                    ? "নতুন ওয়েবসাইট তৈরি, ভিডিও এডিটিং, মোবাইল অ্যাপ ও প্রয়োজনীয় ডিজিটাল সেবাসমূহ।"
                    : "Website creation, video editing, mobile app setup, and essential custom digital services."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/forid78687"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{locale === "bn" ? "টেলিগ্রাম মেসেজ" : "Telegram"}</span>
              </a>
              <Link
                href={`/${locale}/support`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 rounded-full uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "অ্যাডমিন সাপোর্ট" : "Support"}</span>
              </Link>
            </div>
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
          <div
            id="catalog-grid"
            className={`grid ${
              ["student", "tech", "ai-voice", "security", "media-marketing", "utilities", "advanced"].includes(activeCategory)
                ? "grid-cols-1 gap-5 sm:gap-6 w-full max-w-5xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            }`}
          >
            {/* Dedicated Admin Add New Card Placeholder Card */}
            {isAdmin && (
              <div
                onClick={handleOpenAddModal}
                className={`group rounded-3xl p-6 border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 flex cursor-pointer transition-all duration-300 shadow-lg shadow-amber-500/5 hover:scale-[1.01] ${
                  ["student", "tech", "ai-voice", "security", "media-marketing", "utilities", "advanced"].includes(activeCategory)
                    ? "flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-5 min-h-[160px]"
                    : "flex-col items-center justify-center text-center min-h-[240px]"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                  <Plus className="w-7 h-7 stroke-[3]" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full mb-1">
                    Admin Control
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-amber-300 group-hover:text-amber-200">
                    + Add New Card
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-tight">
                    Create a new database-driven product card.
                  </p>
                </div>
              </div>
            )}

            {paginatedServices.map((service, index) => {
              const serviceKey = (service.id || (service as any).productId || (service as any)._id || `service-${index}`).toString();
              return (
                <ServiceCard
                  key={serviceKey}
                  service={service}
                  currentCategory={activeCategory}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteProduct}
                  onTogglePin={handleTogglePinProduct}
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

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          itemsToBuy={checkoutItems}
          totalAmount={checkoutItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)}
          onOrderSuccess={() => clearCart()}
        />
      )}

      {isSearchModalOpen && (
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
      )}

      {/* Admin Add & Edit Service Card Modal */}
      {isAdminModalOpen && (
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
      )}

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
