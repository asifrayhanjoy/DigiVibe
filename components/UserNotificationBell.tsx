"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShoppingBag,
  Paperclip,
  Check,
  Sparkles,
  Download
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetchUserOrders, apiFetchUserAssets } from "@/lib/api/services";

interface UserNotificationBellProps {
  locale?: string;
}

// Synthesize a crisp Web Audio chime notification sound for customer order status updates
const playNotificationSound = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // High Note 1 (E5 - 659.25 Hz)
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

    // High Note 2 (B5 - 987.77 Hz) after 120ms
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

export default function UserNotificationBell({ locale = "en" }: UserNotificationBellProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const prevStatusesRef = useRef<Record<string, string>>({});
  const isFirstFetchRef = useRef<boolean>(true);

  // Load read notification IDs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("digivibe_read_user_notifications");
        if (saved) {
          setReadIds(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, []);

  const fetchUserOrders = useCallback(async () => {
    if (!user?.email) return;
    try {
      const userOrds = await apiFetchUserOrders(user.email);
      if (Array.isArray(userOrds)) {
        setOrders(userOrds);

        // Build notification list from order status updates & deliverables
        const notifList: any[] = [];

        userOrds.forEach((ord: any) => {
          const oldStatus = prevStatusesRef.current[ord.orderId];
          const currentStatus = ord.status || "Pending";

          // Trigger audio chime if status changed from Pending -> Completed or Rejected
          if (!isFirstFetchRef.current && oldStatus && oldStatus !== currentStatus) {
            playNotificationSound();
          }

          prevStatusesRef.current[ord.orderId] = currentStatus;

          const itemTitle = ord.items && ord.items.length > 0 ? ord.items[0].title : "Digital Service";

          const ordDate = ord.updatedAt || ord.createdAt || "2026-01-01T00:00:00.000Z";

          if (currentStatus === "Completed") {
            notifList.push({
              id: `${ord.orderId}_completed`,
              orderId: ord.orderId,
              title: `🎉 Order Approved & Delivered!`,
              message: `Your order #${ord.orderId} (${itemTitle}) is completed. Access credentials & files are ready!`,
              type: "approved",
              date: ordDate,
              hasFiles: ord.deliveryFiles && ord.deliveryFiles.length > 0,
              fileCount: ord.deliveryFiles ? ord.deliveryFiles.length : 0
            });
          } else if (currentStatus === "Rejected") {
            notifList.push({
              id: `${ord.orderId}_rejected`,
              orderId: ord.orderId,
              title: `❌ Order Rejected`,
              message: `Order #${ord.orderId} (${itemTitle}) was rejected. Contact support if needed.`,
              type: "rejected",
              date: ordDate,
              hasFiles: false,
              fileCount: 0
            });
          } else {
            notifList.push({
              id: `${ord.orderId}_pending`,
              orderId: ord.orderId,
              title: `⏳ Order Pending Approval`,
              message: `Order #${ord.orderId} (${itemTitle}) is under admin review. Delivery within 5 minutes.`,
              type: "pending",
              date: ordDate,
              hasFiles: false,
              fileCount: 0
            });
          }
        });

        isFirstFetchRef.current = false;
        setNotifications((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(notifList)) return prev;
          return notifList;
        });
      }
    } catch (err) {
      console.error("Error fetching user notifications:", err);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchUserOrders();

    const handleVisibilityAndPoll = () => {
      if (document.visibilityState === "visible") {
        fetchUserOrders();
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchUserOrders();
      }
    }, 15000);

    document.addEventListener("visibilitychange", handleVisibilityAndPoll);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityAndPoll);
    };
  }, [user?.email, fetchUserOrders]);

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

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("digivibe_read_user_notifications", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    if (typeof window !== "undefined") {
      localStorage.setItem("digivibe_read_user_notifications", JSON.stringify(allIds));
    }
  };

  const unreadNotifications = notifications.filter((n) => !readIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  if (!user) return null;

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
          unreadCount > 0
            ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/20"
            : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
        }`}
        title="Order Notifications"
        aria-label="Order Notifications"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? "animate-bounce text-cyan-400" : ""}`} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] shadow-lg border border-cyan-300 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="py-3 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Order Updates</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-black bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 underline"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-900">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No recent order notifications.
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !readIds.includes(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-2xl transition-all space-y-1.5 cursor-pointer ${
                      isUnread ? "bg-slate-900/90 border border-cyan-500/30" : "hover:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {n.type === "approved" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {n.type === "rejected" && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        {n.type === "pending" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                        <span className={`text-xs font-bold ${n.type === "approved" ? "text-emerald-400" : n.type === "rejected" ? "text-rose-400" : "text-amber-400"}`}>
                          {n.title}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(n.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{n.message}</p>

                    {n.type === "approved" && (
                      <div className="pt-1 flex items-center justify-between">
                        {n.hasFiles && (
                          <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            <span>{n.fileCount} Attached File(s)</span>
                          </span>
                        )}
                        <Link
                          href={`/${locale}/profile`}
                          onClick={() => setIsOpen(false)}
                          className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
                        >
                          <span>View Assets & Download</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="py-2.5 px-4 bg-slate-900/90 border-t border-slate-800 text-center">
            <Link
              href={`/${locale}/profile`}
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1"
            >
              <span>View All Assets & Deliverables</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
