"use client";

import { useState, useEffect } from "react";
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
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { Locale } from "@/types";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch: () => void;
  activeCategory?: string;
  onSelectCategory?: (cat: any) => void;
  currentLocale?: Locale;
}

export default function Navbar({
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

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
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

  const navLinks = isAuthenticated
    ? [
      { name: "All Services", href: `/${locale}/services`, categoryId: "all" },
      { name: "AI Tools", href: `/${locale}/services?cat=subscriptions`, categoryId: "subscriptions" },
      { name: "Email Accounts", href: `/${locale}/services?cat=email`, categoryId: "email" },
      { name: "About Us", href: `/${locale}/about` },
    ]
    : [
      { name: "Home", href: `/${locale}` },
      { name: "About Us", href: `/${locale}/about` },
      { name: "Support", href: `/${locale}/support` },
    ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
          ? "bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 py-0 shadow-xl shadow-cyan-950/20"
          : "bg-slate-950/70 backdrop-blur-md py-0 border-b border-white/5"
        }`}
    >
      <AnnouncementBanner />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4 h-16">
        {/* LOGO */}
        <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <Zap className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-slate-950 stroke-slate-950" />
          </div>
          <div className="flex flex-col min-w-0 shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-base sm:text-2xl font-black tracking-tight text-white font-sans whitespace-nowrap">
                Digi<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">Vibe</span>
              </span>
              <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full animate-pulse shrink-0">
                PRO
              </span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium tracking-wide whitespace-nowrap truncate max-w-[100px] sm:max-w-none">
              Digital Shop 🇧🇩
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-4 lg:gap-6 text-xs font-bold text-slate-300 shrink-0">
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
                className={`px-4 py-2 rounded-lg transition-all font-bold text-xs whitespace-nowrap ${isActive
                    ? "bg-slate-900 text-cyan-400 border border-cyan-500/30"
                    : "hover:bg-slate-900/60 hover:text-cyan-400 text-slate-300"
                  }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* SEARCH BAR (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs mx-2">
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-400 text-xs transition-all duration-200 shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-slate-200 transition-colors truncate">
                {dict.nav.searchPlaceholder}
              </span>
            </div>
            <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded">
              <span>Ctrl</span> K
            </kbd>
          </button>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Search icon (Mobile) */}
          <button
            onClick={handleSearch}
            className="p-2 sm:p-2.5 md:hidden text-slate-300 hover:text-cyan-400 bg-slate-900/80 border border-slate-800 rounded-xl"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* LANGUAGE SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-xl text-xs font-bold text-slate-200 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase text-[11px] sm:text-xs">{locale}</span>
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

          {/* AUTH ACTION BUTTONS + CART BUTTON (ONLY VISIBLE WHEN LOGGED IN) */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {/* SHOPPING CART BUTTON */}
              <button
                onClick={handleCart}
                className="relative z-20 cursor-pointer pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">{dict.nav.cart}</span>
                {displayCartCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black bg-slate-950 text-cyan-400 rounded-full animate-bounce">
                    {displayCartCount}
                  </span>
                )}
              </button>

              {/* USER PROFILE BADGE */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-all text-xs font-bold text-slate-100 shadow-md group"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[110px] sm:max-w-[140px] truncate">{user?.name || "Account"}</span>
                </button>

                {/* Dropdown Overlay - Strictly Right Aligned */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 max-w-[calc(100vw-2rem)] bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in space-y-1">
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
            /* PUBLIC VISITOR AUTH BUTTONS */
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/${locale}/auth/login`}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>{dict.nav.login}</span>
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl transition-colors shadow-md shadow-cyan-500/10"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>{dict.nav.signup}</span>
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 lg:hidden text-slate-300 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-xl shrink-0"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>{dict.nav.searchPlaceholder}</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">Search</span>
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Navigation
            </p>
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.categoryId && onSelectCategory) {
                    onSelectCategory(link.categoryId);
                  }
                  router.push(link.href);
                }}
                className="w-full text-left block px-3 py-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-900 hover:text-cyan-400"
              >
                {link.name}
              </button>
            ))}

            {isAuthenticated && (
              <Link
                href={`/${locale}/profile`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 mt-2"
              >
                👤 My Account
              </Link>
            )}
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{user?.name || "Logged In User"}</div>
                  <div className="text-[10px] text-cyan-400 font-mono font-bold">Wallet: ৳{user?.walletBalance ?? 0}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push(`/${locale}`);
                  }}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-lg shrink-0 ml-2"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>{dict.nav.login}</span>
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>{dict.nav.signup}</span>
              </Link>
            </div>
          )}
        </div>
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
