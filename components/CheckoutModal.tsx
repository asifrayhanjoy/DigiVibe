"use client";

import { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Lock,
  Phone
} from "lucide-react";
import { CartItem, PaymentMethodInfo, OrderResponse } from "@/types";
import { apiProcessOrder } from "@/lib/api/services";
import { useAuth } from "@/context/AuthContext";

const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: "bkash",
    name: "bKash (বিকাশ)",
    type: "Send Money",
    number: "01302271472",
    accountType: "Personal",
    color: "from-pink-500 to-rose-600",
    badge: "Send Money Only 🇧🇩",
    status: "active"
  },
  {
    id: "cellfin",
    name: "CellFin (সেলফিন)",
    type: "Send Money",
    number: "01302271472",
    accountType: "IBBL CellFin",
    color: "from-emerald-500 to-teal-600",
    badge: "Send Money Only ⚡",
    status: "active"
  },
  {
    id: "rocket",
    name: "Rocket (রকেট)",
    type: "Send Money",
    number: "01302271472",
    accountType: "Personal",
    color: "from-purple-600 to-indigo-600",
    badge: "Send Money Only ⚡",
    status: "active"
  },
  {
    id: "bank",
    name: "Bank Transfer (ব্যাংক)",
    type: "IBBL / City / EBL",
    number: "Under Processing",
    accountType: "Bank Account",
    color: "from-amber-500 to-yellow-600",
    badge: "Soon (প্রসেসিং)",
    status: "processing",
    disabled: true
  },
  {
    id: "binance",
    name: "Binance Pay (বাইনান্স)",
    type: "Binance Pay ID / USDT",
    number: "Under Processing",
    accountType: "Crypto USDT",
    color: "from-yellow-400 to-amber-600",
    badge: "Soon (প্রসেসিং)",
    status: "processing",
    disabled: true
  }
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsToBuy: CartItem[];
  totalAmount: number;
  onOrderSuccess?: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  itemsToBuy,
  totalAmount,
  onOrderSuccess
}: CheckoutModalProps) {
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>("bkash");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [trxId, setTrxId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<OrderResponse | null>(null);

  if (!isOpen) return null;

  const currentPaymentInfo = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone) {
      alert("Please enter your Phone or WhatsApp number for delivery!");
      return;
    }
    if (!trxId) {
      alert("Please enter your Payment Transaction ID (TrxID) or Reference Number!");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailToUse = customerEmail || user?.email || "mdasifrayhanjoy2@gmail.com";
      const res = await apiProcessOrder({
        items: itemsToBuy,
        totalAmount,
        paymentMethod: currentPaymentInfo?.name || selectedPayment,
        trxId,
        customerPhone,
        customerEmail: emailToUse
      });

      setIsSubmitting(false);
      setOrderComplete(res);
      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      setIsSubmitting(false);
      alert("Order processing failed. Please try again.");
    }
  };

  const resetAndClose = () => {
    setOrderComplete(null);
    setTrxId("");
    setCustomerPhone("");
    setCustomerEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={resetAndClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {orderComplete ? (
          /* SUCCESS ORDER STATE */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
                ⚡ Order Placed Successfully!
              </span>
              <h2 className="text-2xl font-black text-white mt-3">
                Order #{orderComplete.orderId}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                আপনার অর্ডারটি রিসিভ করা হয়েছে। ৫ মিনিটের ভেতর (Within 5 Minutes) অটোমেটেড প্রসেসিং এর মাধ্যমে সার্ভিস এক্টিভেট করে দেওয়া হবে।
              </p>
            </div>

            {/* Order Details Receipt Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-white font-bold">{currentPaymentInfo?.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="text-cyan-400 font-mono font-bold">{trxId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Customer Contact:</span>
                <span className="text-white font-bold">{customerPhone}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 text-sm font-bold">
                <span className="text-slate-200">Total Paid:</span>
                <span className="text-cyan-400">৳{totalAmount}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/8801700000000?text=Hi!%20My%20Order%20ID%20is%20${orderComplete.orderId}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Track on WhatsApp Support</span>
              </a>
              <button
                onClick={resetAndClose}
                className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                Back to Shop
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM STATE */
          <div>
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Instant Checkout</h2>
                  <p className="text-xs text-slate-400">
                    Secure 256-bit Encrypted Payment Gateway
                  </p>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Items Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order Summary
                </div>
                <div className="space-y-2">
                  {itemsToBuy.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-white font-medium">
                        {item.title} {item.quantity ? `(x${item.quantity})` : ""}
                      </span>
                      <span className="text-cyan-300 font-bold">
                        ৳{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Total Payable Amount</span>
                  <span className="text-xl font-black text-cyan-400">৳{totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Payment Method (পেমেন্ট মাধ্যম বেছে নিন)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = selectedPayment === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          if (pm.disabled) {
                            alert(`${pm.name} is currently under processing and will be activated soon. Please choose bKash, CellFin, or Rocket for fast checkout.`);
                            return;
                          }
                          setSelectedPayment(pm.id);
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${pm.disabled
                          ? "bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10"
                            : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 cursor-pointer"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{pm.name}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected
                              ? "border-cyan-400 bg-cyan-400"
                              : "border-slate-600"
                              }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{pm.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Instructions & Number */}
              {currentPaymentInfo && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/30 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      {currentPaymentInfo.name} Number ({currentPaymentInfo.accountType}):
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {currentPaymentInfo.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 font-bold">
                    <span>{currentPaymentInfo.number}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(currentPaymentInfo.number)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                    💡 <strong>নির্দেশনা:</strong> ওপরের নম্বরে ঠিক <strong className="text-white">৳{totalAmount}</strong> টাকা <strong className="text-cyan-400 font-extrabold">Send Money (সেন্ড মানি)</strong> করার পর নিচের বক্সে পেমেন্ট Transaction ID (TrxID) দিয়ে অর্ডার কনফার্ম করুন। <span className="text-rose-400 font-bold">(ক্যাশআউট গ্রহণযোগ্য নয় ❌)</span>
                  </p>
                </div>
              )}

              {/* Customer Info Form Inputs */}
              <form onSubmit={handleCompleteOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Mobile Number (ডেলিভারি মেসেজ পাওয়ার জন্য) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Transaction ID (TrxID) / Reference <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 9H3K2L8X1M"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-cyan-500/25 transition-all"
                >
                  {isSubmitting ? (
                    <span>Connecting Microservices...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Confirm & Complete Order (৳{totalAmount})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
