"use client";

import { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Lock,
  Phone,
  Mail
} from "lucide-react";
import { CartItem, PaymentMethodInfo, OrderResponse } from "@/types";
import { apiProcessOrder } from "@/lib/api/services";
import { useAuth } from "@/context/AuthContext";

const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: "bkash",
    name: "bKash (বিকাশ)",
    type: "Send Money",
    number: "01516602381",
    accountType: "Personal",
    color: "from-pink-500 to-rose-600",
    badge: "Send Money Only 🇧🇩",
    status: "active"
  },
  {
    id: "nagad",
    name: "Nagad (নগদ)",
    type: "Send Money",
    number: "01516602381",
    accountType: "Personal",
    color: "from-orange-500 to-amber-600",
    badge: "Send Money Only ⚡",
    status: "active"
  },
  {
    id: "rocket",
    name: "Rocket (রকেট)",
    type: "Send Money",
    number: "01516602381",
    accountType: "Personal",
    color: "from-purple-600 to-indigo-600",
    badge: "Send Money Only ⚡",
    status: "active"
  },
  {
    id: "cellfin",
    name: "CellFin (সেলফিন)",
    type: "Send Money",
    number: "01516602381",
    accountType: "IBBL CellFin",
    color: "from-emerald-500 to-teal-600",
    badge: "Send Money Only ⚡",
    status: "active"
  },
  {
    id: "upay",
    name: "Upay (উপায়)",
    type: "Send Money",
    number: "01516602381",
    accountType: "Personal",
    color: "from-blue-500 to-cyan-600",
    badge: "Send Money Only ⚡",
    status: "active"
  },
  {
    id: "binance",
    name: "Binance Pay (বাইনান্স)",
    type: "Binance Pay User ID",
    number: "993800002",
    accountType: "Binance Pay User ID",
    color: "from-yellow-400 to-amber-600",
    badge: "Pay ID: 993800002 ⚡",
    status: "active",
    disabled: false
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
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<OrderResponse | null>(null);

  useEffect(() => {
    if (user?.email && !customerEmail) {
      setCustomerEmail(user.email);
    }
    if (user?.phone && !customerPhone) {
      setCustomerPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  const currentPaymentInfo = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

  const handleCopyNumber = (num: string) => {
    if (!num || num === "Under Processing") return;
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !customerPhone.trim()) {
      alert("Please enter your Phone or WhatsApp number for delivery!");
      return;
    }
    if (!customerEmail || !customerEmail.trim()) {
      alert("Please enter your valid Gmail / Email address for service delivery!");
      return;
    }
    if (!trxId || !trxId.trim()) {
      alert("Please enter your Payment Transaction ID (TrxID) or Reference Number!");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailToUse = customerEmail.trim();
      const res = await apiProcessOrder({
        items: itemsToBuy,
        totalAmount,
        paymentMethod: currentPaymentInfo?.name || selectedPayment,
        trxId: trxId.trim(),
        customerPhone: customerPhone.trim(),
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={resetAndClose}
        className="fixed inset-0 bg-slate-950/90 sm:backdrop-blur-md transition-opacity animate-in fade-in transform-gpu"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-4 sm:my-8 max-h-[90vh] flex flex-col transform-gpu">
        {orderComplete ? (
          /* SUCCESS ORDER STATE */
          <div className="p-6 sm:p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
                ⚡ Order Placed Successfully!
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
                Order #{orderComplete.orderId}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
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
                <span className="text-cyan-400 font-mono font-bold break-all">{trxId}</span>
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
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Instant Checkout</h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-tight">
                    Secure 256-bit Encrypted Payment Gateway
                  </p>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
              {/* Items Summary */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 sm:space-y-3">
                <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order Summary
                </div>
                <div className="space-y-2">
                  {itemsToBuy.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-white font-medium truncate pr-2">
                        {item.title} {item.quantity ? `(x${item.quantity})` : ""}
                      </span>
                      <span className="text-cyan-300 font-bold shrink-0">
                        ৳{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Total Payable Amount</span>
                  <span className="text-lg sm:text-xl font-black text-cyan-400">৳{totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Payment Method (পেমেন্ট মাধ্যম বেছে নিন)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = selectedPayment === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          if (pm.disabled) {
                            alert(`${pm.name} is currently under processing and will be activated soon. Please choose bKash, Nagad, CellFin, or Rocket for fast checkout.`);
                            return;
                          }
                          setSelectedPayment(pm.id);
                        }}
                        className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between min-w-0 ${pm.disabled
                          ? "bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10"
                            : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 cursor-pointer"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] sm:text-xs font-bold text-white truncate leading-tight">{pm.name}</span>
                          <span
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected
                              ? "border-cyan-400 bg-cyan-400"
                              : "border-slate-600"
                              }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950 stroke-[3]" />}
                          </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">{pm.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Instructions & Number */}
              {currentPaymentInfo && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-cyan-500/30 space-y-3 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                      <span>{currentPaymentInfo.name} ({currentPaymentInfo.accountType}):</span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-black text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                      ⚡ {currentPaymentInfo.type}
                    </span>
                  </div>

                  {/* Main Number Row */}
                  <div className="space-y-1">
                    {currentPaymentInfo.optionalNumber && (
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-cyan-400 uppercase tracking-wider px-1">
                        <span>Main Number (প্রধান নম্বর)</span>
                      </div>
                    )}
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                      <span className="font-mono text-sm sm:text-base text-cyan-300 font-bold tracking-wider select-all break-all min-w-0">
                        {currentPaymentInfo.number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(currentPaymentInfo.number)}
                        className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold transition-all active:scale-95 border border-cyan-500/30 ml-auto"
                      >
                        {copiedNumber === currentPaymentInfo.number ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{currentPaymentInfo.id === "binance" ? "Copy Pay ID" : "Copy Number"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Optional / Alternative Number Row (If present) */}
                  {currentPaymentInfo.optionalNumber && (
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>Optional / Alternative Number (বিকল্প নম্বর)</span>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                          <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-sans font-extrabold uppercase border border-amber-500/30 shrink-0">
                            Optional
                          </span>
                          <span className="font-mono text-xs sm:text-sm text-slate-200 font-bold tracking-wide select-all break-all min-w-0">
                            {currentPaymentInfo.optionalNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber(currentPaymentInfo.optionalNumber!)}
                          className="shrink-0 flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all active:scale-95 border border-slate-700 ml-auto"
                        >
                          {copiedNumber === currentPaymentInfo.optionalNumber ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {currentPaymentInfo.id === "binance" ? (
                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 rounded-xl break-words">
                      💡 <strong>নির্দেশনা:</strong> Binance অ্যাপ থেকে ওপরের <strong className="text-cyan-400 font-black">User ID: 993800002</strong> তে ঠিক <strong className="text-white">৳{totalAmount}</strong> (সমপরিমাণ USDT) সেন্ড করে পেমেন্ট এর Transaction ID (TrxID) বা Order ID নিচের ঘরে বসিয়ে কনফার্ম করুন। ⚡
                    </p>
                  ) : (
                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 rounded-xl break-words">
                      💡 <strong>নির্দেশনা:</strong> ওপরের নম্বরে ঠিক <strong className="text-white">৳{totalAmount}</strong> টাকা <strong className="text-cyan-400 font-extrabold">Send Money (সেন্ড মানি)</strong> করার পর নিচের বক্সে পেমেন্ট Transaction ID (TrxID) দিয়ে অর্ডার কনফার্ম করুন। <span className="text-rose-400 font-bold">(ক্যাশআউট গ্রহণযোগ্য নয় ❌)</span>
                    </p>
                  )}
                </div>
              )}

              {/* Customer Info Form Inputs */}
              <form onSubmit={handleCompleteOrder} className="space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                    Gmail / Email Address (আপনার জিমেইল অ্যাড্রেস) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                    Payment Transaction ID (TrxID) / Reference <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 9H3K2L8X1M"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-90 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 transition-all"
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
