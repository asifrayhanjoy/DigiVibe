"use client";

import { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  PhoneCall,
  Globe,
  User,
  Settings,
  LogIn,
  UserPlus,
  LogOut
} from "lucide-react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AdminNotificationBell from "@/components/AdminNotificationBell";
import UserNotificationBell from "@/components/UserNotificationBell";
import { Locale } from "@/types";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch: () => void;
  activeCategory?: string;
  onSelectCategory?: (cat: any) => void;
  currentLocale?: Locale;
}

function Navbar({
  cartCount,
  onOpenCart,
  onOpenSearch,
  activeCategory,
  onSelectCategory,
  currentLocale = "en"
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { locale, setLocale, dict } = useLanguage();
  const { user, isAuthenticated, logout, requireAuth } = useAuth();
  const {
    cart,
    cartCount: contextCartCount,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart
  } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const displayCartCount = cartCount !== undefined && cartCount > 0 ? cartCount : contextCartCount;
  const isAdmin = user?.role === "admin" || (user?.email || "").toLowerCase() === "mdasifrayhanjoy2@gmail.com";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation and Modal handlers
  const handleSearch = () => {
    onOpenSearch();
  };

  const handleCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onOpenCart) onOpenCart();
    openCart();
  };

  const handleNavigate = (targetPath: string, categoryId?: string) => {
    if (categoryId && onSelectCategory) {
      onSelectCategory(categoryId);
    }
    router.push(targetPath);
  };

  const navLinks = [
    { name: "Home", href: `/${locale}` },
    { name: "Today's Update", href: `/${locale}/updates` },
    { name: "About Us", href: `/${locale}/about` },
    { name: "Support", href: `/${locale}/support` },
  ];

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 transform-gpu ${scrolled
        ? "bg-slate-950/95 sm:backdrop-blur-xl border-b border-cyan-500/20 py-0 shadow-xl shadow-cyan-950/20"
        : "bg-slate-950/90 sm:backdrop-blur-md py-0 border-b border-white/5"
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16 w-full">
        {/* LOGO */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-cyan-500/40 p-0.5 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <img src="/logo.png" alt="DigiVibe Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex flex-col min-w-0 shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans whitespace-nowrap">
                Digi<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">Vibe</span>
              </span>
              <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full animate-pulse shrink-0">
                PRO
              </span>
            </div>
            <span className="hidden sm:block text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide whitespace-nowrap truncate">
              Digital Shop 🇧🇩
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 text-xs font-bold text-slate-300 shrink-0">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (link.categoryId && onSelectCategory) {
                    onSelectCategory(link.categoryId);
                  }
                  router.push(link.href);
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all font-bold text-xs whitespace-nowrap ${isActive
                  ? "bg-slate-900 text-cyan-400 border border-cyan-500/30 shadow-md"
                  : "hover:bg-slate-900/60 hover:text-cyan-400 text-slate-300"
                  }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* SEARCH BAR (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-[220px] xl:max-w-xs mx-1 xl:mx-2">
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-400 text-xs transition-all duration-200 shadow-inner group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="group-hover:text-slate-200 transition-colors truncate">
                {dict.nav.searchPlaceholder}
              </span>
            </div>
            <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded shrink-0">
              <span>Ctrl</span> K
            </kbd>
          </button>
        </div>

        {/* RIGHT ACTIONS HEADER BAR */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search icon (Desktop/Tablet small) */}
          <button
            onClick={handleSearch}
            className="p-2 lg:hidden text-slate-300 hover:text-cyan-400 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
            aria-label="Search"
            title="Search Services"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* LANGUAGE SWITCHER DROPDOWN (Visible Desktop / Tablet) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-xl text-xs font-bold text-slate-200 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase text-xs">{locale}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
                <button
                  onClick={() => {
                    setLocale("en");
                    setLangMenuOpen(false);
                    if (pathname) {
                      router.push(pathname.replace(/^\/(en|bn)/, "/en"));
                    }
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-900 ${locale === "en" ? "text-cyan-400 font-bold bg-cyan-950/40" : "text-slate-300"
                    }`}
                >
                  <span>English</span>
                  <span>🇺🇸</span>
                </button>
                <button
                  onClick={() => {
                    setLocale("bn");
                    setLangMenuOpen(false);
                    if (pathname) {
                      router.push(pathname.replace(/^\/(en|bn)/, "/bn"));
                    }
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-900 ${locale === "bn" ? "text-cyan-400 font-bold bg-cyan-950/40" : "text-slate-300"
                    }`}
                >
                  <span>বাংলা</span>
                  <span>🇧🇩</span>
                </button>
              </div>
            )}
          </div>

          {/* NOTIFICATION BELL & CART (LOGGED IN USER) */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* SINGLE CLEAN NOTIFICATION BELL SYSTEM */}
              {isAdmin ? (
                <AdminNotificationBell locale={locale} />
              ) : (
                <UserNotificationBell locale={locale} />
              )}

              {/* SHOPPING CART BUTTON */}
              <button
                onClick={handleCart}
                className="relative z-20 cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden md:inline">{dict.nav.cart}</span>
                {displayCartCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-black bg-slate-950 text-cyan-400 rounded-full">
                    {displayCartCount}
                  </span>
                )}
              </button>

              {/* USER PROFILE BADGE (Desktop) */}
              <div className="relative hidden md:block shrink-0">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-all text-xs font-bold text-slate-100 shadow-md group"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[110px] truncate">{user?.name || "Account"}</span>
                </button>

                {/* Dropdown Overlay - Right Aligned */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in space-y-1">
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-900 hover:text-cyan-400 transition-colors rounded-xl"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>My Account</span>
                    </Link>

                    <Link
                      href={`/${locale}/profile?tab=settings`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-900 hover:text-cyan-400 transition-colors rounded-xl"
                    >
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        router.push(`/${locale}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-900 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* PUBLIC VISITOR AUTH BUTTONS (Desktop) */
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Link
                href={`/${locale}/auth/login`}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>{dict.nav.login}</span>
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl transition-colors shadow-md shadow-cyan-500/10"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>{dict.nav.signup}</span>
              </Link>
            </div>
          )}

          {/* MOBILE HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 sm:p-2.5 lg:hidden text-slate-200 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-xl shrink-0 transition-colors"
            aria-label="Toggle Navigation Drawer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE SLIDE-OUT DRAWER */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden flex justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/85 sm:backdrop-blur-md transition-opacity animate-in fade-in duration-200 transform-gpu"
          />

          {/* Slide-out Panel */}
          <div className="relative w-[85vw] max-w-sm bg-slate-950 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-right duration-200 overflow-y-auto transform-gpu will-change-transform">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/40 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="DigiVibe Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <span className="text-base font-black text-white">DigiVibe Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-5 flex-1">
              {/* USER PROFILE OR AUTH STATUS CARD */}
              {isAuthenticated ? (
                <div className="p-3.5 bg-gradient-to-r from-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-white truncate">{user?.name || "Logged In User"}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400">Wallet Balance:</span>
                    <span className="text-cyan-300 font-mono font-bold">৳{user?.walletBalance ?? 0}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 text-center bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Account</span>
                    </Link>
                    <Link
                      href={`/${locale}/profile?tab=settings`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 text-center bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-300 font-medium">
                    Welcome to DigiVibe! Sign in to access automated order delivery & account dashboard.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/${locale}/auth/login`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold"
                    >
                      <LogIn className="w-4 h-4 text-cyan-400" />
                      <span>{dict.nav.login}</span>
                    </Link>
                    <Link
                      href={`/${locale}/auth/signup`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold"
                    >
                      <UserPlus className="w-4 h-4 text-cyan-400" />
                      <span>{dict.nav.signup}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* SEARCH ACTION BUTTON */}
              <div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSearch();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>{dict.nav.searchPlaceholder}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-cyan-400 font-bold px-2 py-0.5 rounded">Search</span>
                </button>
              </div>

              {/* LANGUAGE SELECTOR */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Language / ভাষা</span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setLocale("en");
                      if (pathname) router.push(pathname.replace(/^\/(en|bn)/, "/en"));
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${locale === "en" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                  >
                    EN 🇺🇸
                  </button>
                  <button
                    onClick={() => {
                      setLocale("bn");
                      if (pathname) router.push(pathname.replace(/^\/(en|bn)/, "/bn"));
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${locale === "bn" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                  >
                    BN 🇧🇩
                  </button>
                </div>
              </div>

              {/* NAVIGATION LINKS */}
              <div className="space-y-1">
                <p className="px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Navigation Menu
                </p>
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (link.categoryId && onSelectCategory) {
                          onSelectCategory(link.categoryId);
                        }
                        router.push(link.href);
                      }}
                      className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${isActive
                        ? "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-200 hover:bg-slate-900 hover:text-cyan-400"
                        }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </button>
                  );
                })}
              </div>

              {/* QUICK CART DRAWER TRIGGER */}
              <div className="pt-2">
                <button
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleCart(e);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>View Shopping Cart</span>
                  </div>
                  {displayCartCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-slate-950 text-cyan-400 rounded-full">
                      {displayCartCount} {displayCartCount === 1 ? "Item" : "Items"}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Footer / Logout */}
            {isAuthenticated && (
              <div className="p-4 border-t border-slate-800 bg-slate-900/60">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push(`/${locale}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Account</span>
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* GLOBAL CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cart}
        onUpdateQuantity={(id, delta) => updateQuantity(id, delta)}
        onRemoveItem={(id) => removeFromCart(id)}
        onProceedToCheckout={() => {
          closeCart();
          router.push(`/${locale}/services`);
        }}
        onApplyPromo={() => { }}
      />
    </header>
  );
}

export default memo(Navbar);

