"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  XCircle,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  User,
  Phone,
  CheckCheck,
  Check
} from "lucide-react";
import { apiFetchAllOrders, apiUpdateOrderStatus, apiMarkNotificationRead, apiMarkAllNotificationsRead } from "@/lib/api/services";
import { getAdminWhatsAppLink, ADMIN_WHATSAPP_NUMBERS } from "@/lib/whatsappNotification";
import OrderApprovalModal from "@/components/OrderApprovalModal";

interface AdminNotificationBellProps {
  locale?: string;
}

// Synthesize a crisp Web Audio chime notification sound for new order alerts
const playNotificationSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Note 2: B5 (987.77 Hz) after 120ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    console.warn("Audio Context playback notice:", e);
  }
};

export default function AdminNotificationBell({ locale = "en" }: AdminNotificationBellProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [readOrderIds, setReadOrderIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const knownPendingIdsRef = useRef<Set<string>>(new Set());
  const isFirstFetchRef = useRef<boolean>(true);
  const originalTitleRef = useRef<string>("");

  // Load persisted read notification IDs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("digivibe_read_admin_notifications");
        if (saved) {
          setReadOrderIds(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, []);

  const fetchAdminOrders = async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) setIsLoading(true);
    try {
      const data = await apiFetchAllOrders();
      if (Array.isArray(data)) {
        setOrders((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          return data;
        });

        // Detect newly arrived pending orders to trigger audio chime alert
        const currentPending = data.filter((o: any) => o.status === "Pending");
        const currentPendingIds = currentPending.map((o: any) => o.orderId);

        if (!isFirstFetchRef.current) {
          const hasNewPending = currentPendingIds.some((id: string) => !knownPendingIdsRef.current.has(id));
          if (hasNewPending) {
            playNotificationSound();
          }
        } else {
          isFirstFetchRef.current = false;
        }

        knownPendingIdsRef.current = new Set(currentPendingIds);
      }
    } catch (err) {
      console.error("Error fetching admin notifications:", err);
    } finally {
      if (isManualRefresh) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders(true);
    // Real-time polling every 5 seconds for instant notification updates
    const interval = setInterval(() => fetchAdminOrders(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const unreadPendingOrders = pendingOrders.filter((o) => !o.isReadByAdmin && !readOrderIds.includes(o.orderId));
  const unreadCount = unreadPendingOrders.length;

  // Dynamic Browser Tab Title & Blinking Effect for unread notifications
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!originalTitleRef.current) {
      originalTitleRef.current = document.title || "DigiVibe - All-in-One Digital Store";
    }

    if (unreadCount > 0) {
      let toggle = false;
      const blinkInterval = setInterval(() => {
        toggle = !toggle;
        document.title = toggle
          ? `(${unreadCount}) 🚨 New Order Alert! - DigiVibe`
          : `🔔 Order Pending Approval - DigiVibe`;
      }, 1000);

      return () => {
        clearInterval(blinkInterval);
        if (originalTitleRef.current) {
          document.title = originalTitleRef.current;
        }
      };
    } else {
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }
    }
  }, [unreadCount]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markOrderAsRead = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, isReadByAdmin: true } : o)));
    setReadOrderIds((prev) => {
      if (prev.includes(orderId)) return prev;
      const updated = [...prev, orderId];
      if (typeof window !== "undefined") {
        localStorage.setItem("digivibe_read_admin_notifications", JSON.stringify(updated));
      }
      return updated;
    });
    apiMarkNotificationRead(orderId);
  };

  const markAllAsRead = () => {
    setOrders((prev) => prev.map((o) => ({ ...o, isReadByAdmin: true })));
    const pendingIds = orders.filter((o) => o.status === "Pending").map((o) => o.orderId);
    setReadOrderIds((prev) => {
      const combined = Array.from(new Set([...prev, ...pendingIds]));
      if (typeof window !== "undefined") {
        localStorage.setItem("digivibe_read_admin_notifications", JSON.stringify(combined));
      }
      return combined;
    });
    apiMarkAllNotificationsRead();
  };



  const [approvingOrder, setApprovingOrder] = useState<any | null>(null);

  const handleOpenApproveModal = (e: React.MouseEvent, order: any) => {
    e.stopPropagation();
    markOrderAsRead(order.orderId);
    setApprovingOrder(order);
  };

  const handleApproveComplete = (updatedOrder: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === updatedOrder.orderId ? { ...o, ...updatedOrder, status: "Completed" } : o))
    );
  };

  const handleReject = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    markOrderAsRead(orderId);
    setActionLoadingId(orderId);
    const res = await apiUpdateOrderStatus(orderId, "Rejected");
    setActionLoadingId(null);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: "Rejected" } : o))
      );
    }
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
          unreadCount > 0
            ? "bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 shadow-lg shadow-amber-500/20"
            : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
        }`}
        title="Admin Notifications"
        aria-label="Admin Notifications"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? "animate-bounce text-amber-400" : ""}`} />

        {/* Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-white font-black text-[9px] shadow-lg border border-rose-400 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Streamlined & Compact Dropdown Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Compact Header */}
          <div className="p-2.5 px-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-wider">
                Notifications
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 ? (
                <button
                  onClick={markAllAsRead}
                  className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-all"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3 text-cyan-400" />
                  <span>Mark Read ({unreadCount})</span>
                </button>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  All Read ✓
                </span>
              )}
              <button
                onClick={() => fetchAdminOrders(true)}
                disabled={isLoading}
                className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                title="Refresh Orders"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Compact Orders List Content */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1.5 space-y-1.5">
            {pendingOrders.length === 0 ? (
              <div className="py-6 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400/80 mx-auto" />
                <div className="text-xs font-bold text-white">All Caught Up! ✨</div>
                <p className="text-[10px] text-slate-400">
                  No pending orders waiting for approval.
                </p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const isRead = readOrderIds.includes(order.orderId);
                const itemSummary = order.items && order.items.length > 0
                  ? order.items.map((i: any) => `${i.title}${i.quantity ? ` (x${i.quantity})` : ""}`).join(", ")
                  : "Digital Service";

                const waLink = getAdminWhatsAppLink({
                  orderId: order.orderId,
                  customerEmail: order.customerEmail || order.userEmail,
                  customerPhone: order.customerPhone,
                  items: order.items,
                  totalAmount: order.totalAmount,
                  paymentMethod: order.paymentMethod,
                  trxId: order.trxId,
                  status: order.status
                }, ADMIN_WHATSAPP_NUMBERS[0].phone);

                const isProcessingThis = actionLoadingId === order.orderId;

                return (
                  <div
                    key={order._id || order.orderId}
                    onClick={() => markOrderAsRead(order.orderId)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      !isRead
                        ? "bg-slate-900 border-amber-500/30 shadow-sm"
                        : "bg-slate-950/60 border-slate-800/60 opacity-85 hover:opacity-100"
                    }`}
                  >
                    {/* Compact Top Row: Order ID, Status Dot, Amount */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {!isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" title="Unread Alert" />
                        )}
                        <span className="font-mono font-bold text-cyan-400">#{order.orderId}</span>
                        <span className="px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                          Pending
                        </span>
                      </div>
                      <span className="font-black text-white text-xs">৳{order.totalAmount}</span>
                    </div>

                    {/* Compact Customer & Product Details */}
                    <div className="text-[10px] text-slate-300 space-y-0.5 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span className="truncate max-w-[160px] sm:max-w-[180px]">{order.customerEmail || order.userEmail}</span>
                        {order.customerPhone && (
                          <span className="text-emerald-400 font-mono text-[9px]">{order.customerPhone}</span>
                        )}
                      </div>
                      <div className="text-slate-200 font-semibold truncate pt-0.5 border-t border-slate-800/60">
                        {itemSummary}
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5 font-mono">
                        <span className="text-slate-300 font-sans">{order.paymentMethod}</span>
                        <span className="text-cyan-300 font-bold">{order.trxId}</span>
                      </div>
                    </div>

                    {/* Compact Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <button
                        onClick={(e) => handleOpenApproveModal(e, order)}
                        disabled={isProcessingThis}
                        className="flex-1 py-1 px-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-bold text-[10px] rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isProcessingThis ? "..." : "Approve"}</span>
                      </button>

                      <button
                        onClick={(e) => handleReject(e, order.orderId)}
                        disabled={isProcessingThis}
                        className="py-1 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded-lg border border-rose-500/30 flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          markOrderAsRead(order.orderId);
                        }}
                        className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all active:scale-95"
                        title="Send Order Alert to Admin WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 fill-white" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Compact Footer */}
          <div className="py-2 px-3 bg-slate-900/90 border-t border-slate-800 text-center">
            <Link
              href={`/${locale}/profile`}
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1"
            >
              <span>Manage All Orders in Admin Panel</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Order Approval Modal */}
      <OrderApprovalModal
        isOpen={!!approvingOrder}
        onClose={() => setApprovingOrder(null)}
        order={approvingOrder}
        onApproved={handleApproveComplete}
      />
    </div>
  );
}
