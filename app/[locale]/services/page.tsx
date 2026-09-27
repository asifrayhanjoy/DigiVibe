"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import SearchModal from "@/components/SearchModal";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { SERVICES } from "@/data/services";
import { CategoryId, CartItem, ServiceItem } from "@/types";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

import VPNProductGrid from "@/components/VPNProductGrid";
import SimOfferGrid from "@/components/SimOfferGrid";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "popular" | "newest">("featured");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const { locale, dict } = useLanguage();
  const { isAuthenticated, isLoading, requireAuth } = useAuth();
  const router = useRouter();

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter & Sort
  const processedServices = useMemo(() => {
    let list = SERVICES.filter((service) => {
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
  }, [activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
    showToast("Added to Cart 🛒", `${service.title} added to cart.`);
  };

  const handleBuyNow = (service: ServiceItem) => {
    requireAuth(() => {
      setCheckoutItems([{ ...service, quantity: 1 }]);
      setIsCheckoutOpen(true);
    }, `/${locale}/services`);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
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
          onSelectCategory={setActiveCategory}
          getCategoryCount={(catId) =>
            catId === "all" ? SERVICES.length : SERVICES.filter((s) => s.category === catId).length
          }
        />

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 my-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          {/* Total Product Count */}
          <div className="flex items-center gap-2.5 font-semibold text-xs sm:text-sm text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
            <span>
              Showing <span className="text-cyan-400 font-extrabold text-sm sm:text-base">{processedServices.length}</span> Products
            </span>
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
        {activeCategory === "vpn" ? (
          <VPNProductGrid
            products={processedServices}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : activeCategory === "sim" ? (
          <SimOfferGrid
            simOffers={processedServices}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : processedServices.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-8">
            <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your category or search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
      </main>

      <Footer onSelectCategory={(cat) => setActiveCategory(cat as CategoryId)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(id, qty) =>
          setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
        }
        onRemoveItem={(id) => setCart((prev) => prev.filter((i) => i.id !== id))}
        onProceedToCheckout={() => {
          requireAuth(() => {
            setIsCartOpen(false);
            setCheckoutItems(cart);
            setIsCheckoutOpen(true);
          }, `/${locale}/services`);
        }}
        onApplyPromo={() => {}}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        itemsToBuy={checkoutItems}
        totalAmount={checkoutItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)}
        onOrderSuccess={() => setCart([])}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={processedServices}
        onSelectService={handleBuyNow}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
