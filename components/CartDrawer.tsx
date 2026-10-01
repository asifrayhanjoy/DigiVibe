"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag, CheckCircle2 } from "lucide-react";
import { CartItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo?: { code: string; discountPercent: number } | null;
  onApplyPromo: (promo: { code: string; discountPercent: number }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const { dict } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (promoInput.trim().toUpperCase() === "DIGIVIBE10") {
      onApplyPromo({ code: "DIGIVIBE10", discountPercent: 10 });
      setPromoInput("");
    } else {
      alert("Invalid Promo Code! Try 'DIGIVIBE10' for 10% OFF 🏷️");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-hidden flex justify-end transform-gpu">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 sm:backdrop-blur-md transition-opacity animate-in fade-in duration-200 transform-gpu"
      />

      <div className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between z-50 animate-in slide-in-from-right duration-200 transform-gpu will-change-transform">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{dict.cart.title}</h2>
                <p className="text-xs text-slate-400">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-300">{dict.cart.emptyTitle}</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    {dict.cart.emptyDesc}
                  </p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3 items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      ৳{item.price} x {item.quantity} = <strong className="text-cyan-300">৳{item.price * item.quantity}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 space-y-4">
              {/* Promo Code Coupon */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={dict.cart.couponPlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700"
                >
                  {dict.cart.apply}
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Coupon '{appliedPromo.code}' Applied (-10%)
                  </span>
                  <span>-৳{discountAmount}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>{dict.cart.subtotal}</span>
                  <span className="text-slate-200">৳{subtotal}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{dict.cart.discount}</span>
                    <span>-৳{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>{dict.cart.total}</span>
                  <span className="text-cyan-400">৳{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200"
              >
                <span>{dict.cart.proceed}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
    </div>,
    document.body
  );
}
