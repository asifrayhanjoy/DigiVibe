"use client";

import { useState, useEffect, useCallback, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import AdminProductModal from "@/components/AdminProductModal";
import Toast from "@/components/Toast";
import ServiceCard from "@/components/ServiceCard";
import { ServiceItem, CartItem } from "@/types";
import { SERVICES } from "@/data/services";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Zap,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Heart,
  Pencil,
  Sparkles,
  PhoneCall,
  Info,
  Check,
  Lock,
  Layers,
  RefreshCw,
  Tag,
  AlertCircle
} from "lucide-react";

export default function ServiceDetailPage({ params }: { params: Promise<{ locale: string; id: string }> | { locale: string; id: string } }) {
  const resolvedParams = use(params as any) as { locale: string; id: string };
  const locale = resolvedParams?.locale || "en";
  const serviceId = resolvedParams?.id;

  const router = useRouter();
  const { dict } = useLanguage();
  const { user, requireAuth } = useAuth();
  const { addToCart, openCart } = useCart();

  // Instant static fallback initialization for 0ms loading lag
  const initialService = useMemo(() => {
    if (!serviceId) return null;
    return SERVICES.find((s) => s.id === serviceId) || null;
  }, [serviceId]);

  const [service, setService] = useState<ServiceItem | null>(initialService);
  const [allProducts, setAllProducts] = useState<ServiceItem[]>(SERVICES);
  const [isLoading, setIsLoading] = useState<boolean>(!initialService);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const isAdmin = user?.role === "admin" || (user?.email || "").toLowerCase() === "mdasifrayhanjoy2@gmail.com";

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Parallel Background Data Synchronization
  const fetchProductDetail = useCallback(async () => {
    if (!serviceId) return;
    try {
      const [res, allRes] = await Promise.all([
        fetch(`/api/products/${encodeURIComponent(serviceId)}`, { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" })
      ]);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          setService(data.product);
        }
      }

      if (allRes.ok) {
        const allData = await allRes.json();
        if (allData.success && Array.isArray(allData.products) && allData.products.length > 0) {
          setAllProducts(allData.products);
        }
      }
    } catch (err) {
      console.error("Error fetching product detail:", err);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleAddToCart = () => {
    if (!service) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(service);
    }
    showToast("Added to Cart 🛒", `${quantity}x "${service.title}" added to your cart.`);
  };

  const handleBuyNow = () => {
    if (!service) return;
    requireAuth(() => {
      setIsCheckoutOpen(true);
    }, `/${locale}/services/${service.id}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Link Copied! 📋", "Product URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedProducts = useMemo(() => {
    if (!service) return [];
    return allProducts
      .filter((p) => p.id !== service.id && (p.category === service.category || p.popular))
      .slice(0, 4);
  }, [allProducts, service]);

  const isSoldOut = service?.stock === "Out of Stock" || service?.stock === "Stock Out" || service?.inStock === false;
  const discountPercent = service && service.originalPrice && service.originalPrice > service.price
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar onOpenSearch={() => {}} currentLocale={locale as any} />
        <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
            <p className="text-sm font-bold text-slate-400">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
        <Navbar onOpenSearch={() => {}} currentLocale={locale as any} />
        <div className="pt-36 pb-20 max-w-4xl mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">Product Not Found</h1>
          <p className="text-sm text-slate-400 mt-2 mb-6">The service card you are looking for may have been removed or updated.</p>
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <Navbar onOpenSearch={() => {}} currentLocale={locale as any} />

      {/* Main Content Area */}
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
          <Link href={`/${locale}`} className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/services`} className="hover:text-cyan-400 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-cyan-400 font-bold capitalize">{service.category}</span>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-[200px] sm:max-w-none">{service.title}</span>
        </div>

        {/* Product Details Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Product Image & Badges (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-xl transform-gpu">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 mb-4 z-10 relative">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                {service.category}
              </span>
              {discountPercent > 0 && (
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                  ⚡ {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Product Display Box */}
            <div className="w-full h-64 sm:h-80 rounded-2xl bg-white p-6 flex items-center justify-center relative shadow-inner overflow-hidden my-2">
              {service.logo || service.image ? (
                <img
                  src={service.logo || service.image}
                  alt={service.title}
                  className="w-full h-full object-contain max-h-60"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-cyan-500">
                  <Sparkles className="w-20 h-20" />
                  <span className="text-xs text-slate-500 uppercase font-black mt-2">{service.category}</span>
                </div>
              )}

              {/* Heart Favorite Trigger */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center border border-slate-800 shadow-md z-10"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              {/* Share Trigger */}
              <button
                onClick={handleShare}
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-center border border-slate-800 shadow-md z-10"
                title="Share Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-bold text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>24/7 Warranty</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Actions & Specs (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              {/* ADMIN EDIT CARD BUTTON */}
              {isAdmin && (
                <div className="mb-3">
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 border border-amber-300 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 stroke-[2.5]" />
                    <span>Edit Product Details (Admin Control)</span>
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                  ID: #{service.id}
                </span>
                {!isSoldOut ? (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock & Ready
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Stock Out
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                {service.title}
              </h1>

              {service.subtitle && (
                <p className="text-sm text-slate-400 mt-1 font-medium leading-relaxed">
                  {service.subtitle}
                </p>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3 text-sm">
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-black text-amber-300">{service.rating || 4.9}</span>
                </div>
                <span className="text-slate-400 text-xs font-semibold">
                  Based on ({service.reviews || 120}) Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-cyan-400 font-sans tracking-tight">
                  ৳{service.price}
                </span>
                {service.originalPrice && service.originalPrice > service.price && (
                  <span className="text-lg sm:text-xl text-slate-500 line-through font-medium">
                    ৳{service.originalPrice}
                  </span>
                )}
                {service.unit && (
                  <span className="text-xs text-slate-400 font-bold">
                    /{service.unit.replace(/^\//, "")}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant automated delivery after payment verification</span>
              </p>
            </div>

            {/* Quantity Selector & Instant Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300">Quantity:</span>
                <div className="flex items-center border border-slate-800 bg-slate-900 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-white font-bold text-sm font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={isSoldOut}
                  className={`py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl uppercase tracking-wider cursor-pointer ${
                    isSoldOut
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>Buy Now (কিনুন)</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature List & Overview Specs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 space-y-6">
            {/* Features Checklist */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>Key Service Features</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(service.features && service.features.length > 0
                  ? service.features
                  : ["Full Warranty Support", "High-Speed Guaranteed", "Instant Automation", "24/7 Admin Replacement"]
                ).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Overview Box */}
            {(service.description || service.overview) && (
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  <span>Service Overview & Setup Guide</span>
                </h2>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {service.overview || service.description}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Policy & Guarantee */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>DigiVibe Guarantee</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-3">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% Genuine & Verified Digital Services</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full Replacement Warranty for Subscription Validity</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Instant Automated Processing & WhatsApp Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Recommended Products</span>
              </h2>
              <Link href={`/${locale}/services`} className="text-xs font-bold text-cyan-400 hover:underline">
                View All Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ServiceCard
                  key={prod.id}
                  service={prod}
                  onAddToCart={() => addToCart(prod)}
                  onBuyNow={() => {
                    requireAuth(() => {
                      router.push(`/${locale}/services/${prod.id}`);
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* MODALS */}
      {isCheckoutOpen && service && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          itemsToBuy={[{ ...service, quantity }]}
          totalAmount={service.price * quantity}
          onOrderSuccess={() => {
            showToast("Order Successful! 🎉", "Your order has been placed successfully.");
            setIsCheckoutOpen(false);
          }}
        />
      )}

      {isAdminModalOpen && service && (
        <AdminProductModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          mode="edit"
          initialData={service}
          onSaveSuccess={(updated) => {
            setService(updated);
            showToast("Product Updated! ✨", `"${updated.title}" has been saved to the database.`);
            setIsAdminModalOpen(false);
            if (updated.id && updated.id !== service.id) {
              router.replace(`/${locale}/services/${updated.id}`);
            } else {
              fetchProductDetail();
            }
          }}
        />
      )}

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
