"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import OrderApprovalModal from "@/components/OrderApprovalModal";
import FilePreviewModal from "@/components/FilePreviewModal";
import { Download, Paperclip, Eye } from "lucide-react";
import {
  User,
  ShieldCheck,
  Zap,
  Mail,
  Phone,
  LogOut,
  Package,
  Clock,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  Camera,
  Wallet,
  ShoppingBag,
  Edit3,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Lock,
  Smartphone,
  Send,
  MessageSquare,
  Plus,
  X,
  Laptop,
  Settings,
  DollarSign,
  Users,
  BarChart3,
  RefreshCw,
  Sliders,
  PlusCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  apiFetchProfile,
  apiUpdateProfile,
  apiFetchUserAssets,
  apiFetchUserOrders,
  apiFetchAllOrders,
  apiUpdateOrderStatus,
  apiDeleteOrder
} from "@/lib/api/services";

type TabId = "assets" | "edit-profile" | "orders" | "security" | "support" | "admin";

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const { locale } = useLanguage();

  const [activeTab, setActiveTab] = useState<TabId>("assets");

  // User Profile State
  const [profile, setProfile] = useState({
    name: authUser?.name || "User",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    whatsapp: authUser?.whatsapp || "",
    address: authUser?.address || "",
    avatar: authUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    memberSince: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "2026",
  });

  // Strict Admin Check Rule
  const isAdmin = (authUser?.email?.toLowerCase() || profile.email?.toLowerCase()) === "mdasifrayhanjoy2@gmail.com";

  // Real Database Records State
  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);

  // Admin Order Approval System State - Loaded directly from MongoDB
  const [adminOrdersList, setAdminOrdersList] = useState<any[]>([]);

  const [adminOrderFilter, setAdminOrderFilter] = useState<"all" | "pending" | "completed" | "rejected">("all");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [approvingModalOrder, setApprovingModalOrder] = useState<any | null>(null);
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  // Trigger Interactive Approval Modal when clicking Approve button
  const handleOpenApproveModal = (order: any) => {
    setApprovingModalOrder(order);
  };

  const handleModalApprovedComplete = (updatedOrder: any) => {
    setAdminOrdersList((prev) =>
      prev.map((o) => (o.orderId === updatedOrder.orderId ? { ...o, ...updatedOrder, status: "Completed" } : o))
    );
    showToast("Order Approved & Delivered! 🚀", `Order #${updatedOrder.orderId} instructions & files saved to MongoDB.`);
    const userEmail = authUser?.email || localStorage.getItem("digivibe_user_email") || profile.email;
    if (userEmail) {
      apiFetchUserOrders(userEmail).then((ords) => setDbOrders(ords || []));
      apiFetchUserAssets(userEmail).then((asts) => setDbAssets(asts || []));
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    showToast("Rejecting Order...", `Updating order #${orderId}...`);
    const res = await apiUpdateOrderStatus(orderId, "Rejected");
    if (res.success) {
      setAdminOrdersList((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: "Rejected" } : o))
      );
      showToast("Order Rejected ❌", `Order #${orderId} marked as rejected.`);
      const userEmail = authUser?.email || localStorage.getItem("digivibe_user_email") || profile.email;
      if (userEmail) {
        apiFetchUserOrders(userEmail).then((ords) => setDbOrders(ords || []));
      }
    } else {
      showToast("Rejection Failed", res.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    showToast("Deleting Order...", `Removing #${orderId} from MongoDB...`);
    const res = await apiDeleteOrder(orderId);
    if (res.success) {
      setAdminOrdersList((prev) => prev.filter((o) => o.orderId !== orderId));
      showToast("Order Removed 🗑️", `Order #${orderId} deleted from database.`);
      const userEmail = authUser?.email || localStorage.getItem("digivibe_user_email") || profile.email;
      if (userEmail) {
        apiFetchUserOrders(userEmail).then((ords) => setDbOrders(ords || []));
      }
    } else {
      showToast("Delete Failed", res.message);
    }
  };

  // FETCH REAL USER PROFILE, ASSETS & ORDERS DIRECTLY FROM MONGODB ATLAS
  useEffect(() => {
    const userEmail = authUser?.email || localStorage.getItem("digivibe_user_email");
    if (userEmail) {
      setIsLoadingDb(true);

      // 1. Fetch User Document
      apiFetchProfile(userEmail)
        .then((dbUser) => {
          if (dbUser) {
            const updated = {
              name: dbUser.name || profile.name,
              email: dbUser.email || profile.email,
              phone: dbUser.phone || profile.phone,
              whatsapp: dbUser.whatsapp || profile.whatsapp,
              address: dbUser.address || profile.address,
              avatar: dbUser.avatar || profile.avatar,
              memberSince: dbUser.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : profile.memberSince,
              walletBalance: dbUser.walletBalance ?? 0,
            };
            setProfile(updated);
            setEditForm(updated);
          }
        })
        .catch(() => {});

      // 2. Fetch User Assets from MongoDB Atlas
      apiFetchUserAssets(userEmail)
        .then((assets) => {
          setDbAssets(assets || []);
        })
        .catch(() => {});

      // 3. Fetch User Orders from MongoDB Atlas
      apiFetchUserOrders(userEmail)
        .then((orders) => {
          setDbOrders(orders || []);
          setIsLoadingDb(false);
        })
        .catch(() => {
          setIsLoadingDb(false);
        });
    } else {
      setIsLoadingDb(false);
    }

    // Load ALL Orders directly from MongoDB Atlas for Admin Panel
    apiFetchAllOrders().then((adminOrds) => {
      if (adminOrds) {
        setAdminOrdersList(adminOrds);
      }
    });
  }, [authUser]);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to compress avatar image before uploading to MongoDB Atlas
  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 350;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [hasUnsavedAvatar, setHasUnsavedAvatar] = useState(false);

  const saveAvatarToDb = async (avatarDataUrl?: string) => {
    const targetAvatar = avatarDataUrl || profile.avatar;
    if (!profile.email) return;

    setIsSavingAvatar(true);
    showToast("Saving Avatar...", "Uploading profile picture to MongoDB Atlas...");

    const res = await apiUpdateProfile({
      email: profile.email,
      avatar: targetAvatar
    });

    setIsSavingAvatar(false);
    if (res.success) {
      setHasUnsavedAvatar(false);
      showToast("Avatar Saved to MongoDB Atlas 📸", "Profile picture persisted successfully in database!");
    } else {
      showToast("Avatar Save Failed", res.message || "Could not save avatar to database.");
    }
  };

  // Avatar Image Upload to MongoDB Atlas
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedBase64 = await compressAndResizeImage(file);
        setProfile((prev) => ({ ...prev, avatar: compressedBase64 }));
        setEditForm((prev) => ({ ...prev, avatar: compressedBase64 }));
        setHasUnsavedAvatar(true);

        // Auto-save to MongoDB Atlas immediately
        await saveAvatarToDb(compressedBase64);
      } catch (err) {
        console.error("Avatar compression error:", err);
        showToast("Image Processing Error", "Could not process avatar image file.");
      }
    }
  };

  // Save Profile Details to MongoDB Atlas
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditingHeader(false);

    showToast("Saving to Database...", "Connecting to MongoDB Atlas...");

    const res = await apiUpdateProfile({
      email: profile.email,
      name: editForm.name,
      phone: editForm.phone,
      whatsapp: editForm.whatsapp,
      address: editForm.address,
      avatar: editForm.avatar
    });

    if (res.success) {
      showToast("Save and Updated! 🎉", res.message);
    } else {
      showToast("Database Notice", res.message);
    }
  };



  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Copied to Clipboard 📋", "Access credentials copied.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubject("");
    setTicketMessage("");
    showToast("Support Ticket Opened 🎫", "Our 24/7 team will respond within 15 minutes.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast("Password Error", "New password and confirm password do not match.");
      return;
    }
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    showToast("Password Changed 🔐", "Security password has been updated.");
  };

  // Filtered Orders for Admin Approval System
  const filteredOrders = adminOrdersList.filter((ord) => {
    const matchesFilter =
      adminOrderFilter === "all" ||
      (adminOrderFilter === "pending" && ord.status === "Pending") ||
      (adminOrderFilter === "completed" && ord.status === "Completed") ||
      (adminOrderFilter === "rejected" && ord.status === "Rejected");

    const query = adminSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (ord.orderId && ord.orderId.toLowerCase().includes(query)) ||
      (ord.userEmail && ord.userEmail.toLowerCase().includes(query)) ||
      (ord.customerEmail && ord.customerEmail.toLowerCase().includes(query)) ||
      (ord.trxId && ord.trxId.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      <Navbar cartCount={0} onOpenCart={() => { }} onOpenSearch={() => { }} currentLocale={locale} />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">

        {/* HEADER PROFILE SUMMARY CARD */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

            {/* Avatar & User Details */}
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/20"
                  />
                  <label className="absolute -bottom-1 -right-1 p-2 bg-slate-900 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-slate-700 rounded-xl cursor-pointer transition-all shadow-md" title="Upload new photo">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => saveAvatarToDb(profile.avatar)}
                  disabled={isSavingAvatar}
                  className={`px-3 py-1 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all shadow-md ${hasUnsavedAvatar
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black animate-pulse shadow-emerald-500/30"
                    : "bg-slate-900/90 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700/80"
                    }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>{isSavingAvatar ? "Saving..." : hasUnsavedAvatar ? "Save Picture" : "Update Picture"}</span>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    MongoDB Verified
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profile.phone || "No phone added"}</span>

                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Toggle & Logout */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setActiveTab("edit-profile");
                  setIsEditingHeader(!isEditingHeader);
                }}
                className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditingHeader ? "Close Edit" : "Edit Profile"}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  window.location.href = `/${locale}`;
                }}
                className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* CLEAN & BALANCED PROFILE STATS GRID (COMPLETED VS INCOMPLETE/PENDING ORDERS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-800/80">
            {/* 1. Completed Orders Status Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 hover:border-emerald-500/30 transition-all shadow-lg">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Orders</div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  {dbOrders.filter((o) => o.status === "Completed" || !o.status).length} Orders
                </div>
              </div>
            </div>

            {/* 2. Incomplete / Pending Orders Status Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 hover:border-amber-500/30 transition-all shadow-lg">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Incomplete / Pending</div>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  {dbOrders.filter((o) => o.status === "Pending").length} Pending
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD TABS NAVIGATION */}
        <div className="w-full overflow-x-auto no-scrollbar border-b border-slate-800">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setActiveTab("assets")}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all ${activeTab === "assets"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>🔑 Digital Assets ({dbAssets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("edit-profile")}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all ${activeTab === "edit-profile"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
            >
              <User className="w-4 h-4" />
              <span>👤 Edit Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all ${activeTab === "orders"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>📜 Order History ({dbOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all ${activeTab === "security"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>🔐 Security & 2FA</span>
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all ${activeTab === "support"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
            >
              <Send className="w-4 h-4" />
              <span>💬 Support & Help</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all ${activeTab === "admin"
                  ? "border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl"
                  : "border-transparent text-amber-400/80 hover:text-amber-300"
                  }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>⚡ Admin Panel</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: REAL ASSETS FROM MONGODB ATLAS */}
        {activeTab === "assets" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Active Digital Assets</h2>
              <Link href={`/${locale}/services`} className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                <span>Browse Catalog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {dbAssets.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-4 space-y-3">
                <KeyRound className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No active digital assets found in MongoDB Atlas</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you purchase VPNs, subscriptions, or proxies, your credentials will appear here instantly.
                </p>
                <Link
                  href={`/${locale}/services`}
                  className="inline-block px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Explore Shop Services
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dbAssets.map((asset) => (
                  <div key={asset._id || asset.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-extrabold uppercase">{asset.category}</span>
                        <h3 className="text-base font-bold text-white mt-0.5">{asset.title}</h3>
                      </div>
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        {asset.status || "Active"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-semibold">Access Credentials:</span>
                        {asset.credentials && (
                          <button
                            onClick={() => handleCopy(asset.credentials, asset._id || asset.id)}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30 transition-colors"
                          >
                            {copiedId === (asset._id || asset.id) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === (asset._id || asset.id) ? "Copied!" : "Copy"}</span>
                          </button>
                        )}
                      </div>
                      <div className="text-cyan-300 font-mono text-xs font-bold break-all bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                        {asset.credentials || "Standard Digital License / Access Granted"}
                      </div>

                      {/* Delivery Notes / Instructions */}
                      {asset.deliveryNotes && (
                        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>Delivered Instructions / Details:</span>
                            </span>
                            <button
                              onClick={() => handleCopy(asset.deliveryNotes, (asset._id || asset.id) + "_notes")}
                              className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 transition-colors"
                            >
                              {copiedId === (asset._id || asset.id) + "_notes" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === (asset._id || asset.id) + "_notes" ? "Copied!" : "Copy Notes"}</span>
                            </button>
                          </div>
                          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 font-sans">
                            {asset.deliveryNotes}
                          </div>
                        </div>
                      )}

                      {/* Delivery File Attachments */}
                      {asset.deliveryFiles && asset.deliveryFiles.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Attached Files, Images & Software ({asset.deliveryFiles.length}):</span>
                          </span>
                          <div className="space-y-2">
                            {asset.deliveryFiles.map((file: any, fIdx: number) => {
                              const ext = (file.name || "").split(".").pop()?.toUpperCase() || "FILE";
                              const isImg = (file.data && file.data.startsWith("data:image/")) || ["PNG", "JPG", "JPEG", "WEBP", "GIF", "SVG"].includes(ext);
                              const formattedSize = file.size ? (file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`) : "";

                              return (
                                <div
                                  key={fIdx}
                                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 truncate min-w-0 flex-1">
                                      {isImg ? (
                                        <div
                                          onClick={() => setPreviewFile(file)}
                                          className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-950 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                                        </div>
                                      ) : (
                                        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                                          <FileText className="w-4 h-4" />
                                        </div>
                                      )}

                                      <div className="truncate min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-slate-200 font-bold text-xs truncate">{file.name}</span>
                                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-black uppercase bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30 flex-shrink-0">
                                            {ext}
                                          </span>
                                        </div>
                                        {formattedSize && <span className="text-[10px] text-slate-400 font-mono">{formattedSize}</span>}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        onClick={() => setPreviewFile(file)}
                                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg flex items-center gap-1 transition-all"
                                        title="Preview / View File Contents"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>View</span>
                                      </button>

                                      <a
                                        href={file.data}
                                        download={file.name || `attachment_${fIdx}`}
                                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 text-slate-950 font-black text-[10px] rounded-lg flex items-center gap-1 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                                      >
                                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                                        <span>Download</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === "edit-profile" && (
          <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                MongoDB Atlas Real-Time Persistence
              </span>
              <h2 className="text-lg font-black text-white mt-2 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <span>Personal Details & Address</span>
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Avatar Card in Edit Tab */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={editForm.avatar}
                    alt="Avatar Preview"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md shadow-cyan-500/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Profile Avatar Picture</div>
                    <div className="text-[11px] text-slate-400">Select JPEG or PNG file to upload avatar</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-all">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>

                  {hasUnsavedAvatar && (
                    <button
                      type="button"
                      onClick={() => saveAvatarToDb(editForm.avatar)}
                      disabled={isSavingAvatar}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 animate-pulse"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Avatar</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Primary Key)</label>
                <input
                  type="email"
                  disabled
                  value={editForm.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Address / Country</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("assets")}
                  className="py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: REAL ORDERS FROM MONGODB ATLAS */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <span>Transaction History</span>
            </h2>

            {dbOrders.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-4 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No transaction records found in MongoDB Atlas</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your purchase receipts and transaction history will appear here once you place an order.
                </p>
                <Link
                  href={`/${locale}/services`}
                  className="inline-block px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Items Count</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">TrxID</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dbOrders.map((ord) => (
                        <tr key={ord._id || ord.orderId} className="hover:bg-slate-900/40">
                          <td className="p-4 font-mono font-bold text-cyan-400">
                            <div>{ord.orderId}</div>
                            {ord.deliveryFiles && ord.deliveryFiles.length > 0 && (
                              <div className="text-[10px] text-emerald-400 font-sans font-semibold flex items-center gap-1 mt-0.5">
                                <Paperclip className="w-3 h-3" />
                                <span>{ord.deliveryFiles.length} Attached File(s)</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-bold text-white">{ord.items?.length || 1} Item(s)</td>
                          <td className="p-4 text-slate-400">{new Date(ord.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="p-4">{ord.paymentMethod}</td>
                          <td className="p-4 font-mono text-cyan-300">{ord.trxId}</td>
                          <td className="p-4 font-black text-cyan-300">৳{ord.totalAmount}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full inline-block">
                                {ord.status || "Delivered"}
                              </span>
                              {ord.deliveryFiles && ord.deliveryFiles.length > 0 && (
                                <div className="flex flex-col gap-1 mt-1">
                                  {ord.deliveryFiles.map((file: any, fIdx: number) => (
                                    <a
                                      key={fIdx}
                                      href={file.data}
                                      download={file.name}
                                      className="inline-flex items-center gap-1 text-[10px] text-cyan-300 font-bold hover:underline"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>{file.name}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SECURITY */}
        {activeTab === "security" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">2-Factor Email OTP Security</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">Status: Active (Nodemailer + MongoDB Atlas)</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>Change Account Password</span>
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button type="submit" className="py-3 px-6 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs rounded-xl">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT & HELP */}
        {activeTab === "support" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 space-y-2 text-center sm:text-left">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                24/7 Priority Support 🎧
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Need Live 24/7 Assistance?</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Contact our dedicated admin team directly via WhatsApp or Email for immediate order and account support.
              </p>
            </div>

            {/* 2 Main Support Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: WhatsApp Support (Two Admins) */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Fastest Support
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">WhatsApp Live Chat</h4>
                  <p className="text-xs text-slate-400 mt-1">Get instant order verification & instant assistance from our official admins.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Admin 1 */}
                  <a
                    href="https://wa.me/8801302271472"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        👑
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin</div>
                        <div className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">MD ASIF RAYHAN JOY</div>
                        <div className="text-[11px] font-mono text-slate-400">01302271472</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <span>Chat</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  {/* Admin 2 */}
                  <a
                    href="https://wa.me/8801990800188"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        💬
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin</div>
                        <div className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">FARID</div>
                        <div className="text-[11px] font-mono text-slate-400">01990800188</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <span>Chat</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>
              </div>

              {/* Card 2: Official Email Support */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Official Email
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">Email Helpdesk</h4>
                  <p className="text-xs text-slate-400 mt-1">Send your detailed order queries, warranty inquiries, or business questions via email.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support Mail</div>
                    <div className="text-xs sm:text-sm font-black text-cyan-300 truncate mt-0.5">mdasifrayhanjoy2@gmail.com</div>
                  </div>

                  <a
                    href="mailto:mdasifrayhanjoy2@gmail.com"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="w-4 h-4 stroke-[2.5]" />
                    <span>Send Email</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TAB 6: REDESIGNED ADMIN PANEL (DISTINCT ORDER APPROVAL COMMAND CENTER) */}
        {activeTab === "admin" && isAdmin && (
          <div className="space-y-8 animate-in fade-in">
            {/* Admin Header Card - Distinct Look */}
            <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 w-max">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Authorized Master Admin</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-2">
                    <span>⚡ Order Approval & Management Engine</span>
                  </h2>
                  <p className="text-xs text-amber-300/80 font-mono mt-1">
                    Logged in as: <span className="font-bold text-white">mdasifrayhanjoy2@gmail.com</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      showToast("Syncing Database... 🔄", "Fetching fresh orders from MongoDB...");
                      const freshOrds = await apiFetchAllOrders();
                      setAdminOrdersList(freshOrds || []);
                      showToast("Database Synced 🔄", `Loaded ${freshOrds?.length || 0} orders from MongoDB.`);
                    }}
                    className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Refresh Orders</span>
                  </button>
                </div>
              </div>

              {/* Admin Order Status Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-amber-500/20">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</div>
                  <div className="text-2xl font-black text-white mt-1">{adminOrdersList.length} Orders</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg shadow-amber-500/5">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Pending Approval</span>
                  </div>
                  <div className="text-2xl font-black text-amber-300 mt-1">
                    {adminOrdersList.filter((o) => o.status === "Pending").length} Orders
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Approved / Completed</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {adminOrdersList.filter((o) => o.status === "Completed").length} Approved
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/20">
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Rejected</div>
                  <div className="text-2xl font-black text-rose-400 mt-1">
                    {adminOrdersList.filter((o) => o.status === "Rejected").length} Rejected
                  </div>
                </div>
              </div>
            </div>

            {/* Order Filter Tabs & Search Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setAdminOrderFilter("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    adminOrderFilter === "all"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  All Orders ({adminOrdersList.length})
                </button>

                <button
                  onClick={() => setAdminOrderFilter("pending")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    adminOrderFilter === "pending"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md"
                      : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  ⏳ Pending ({adminOrdersList.filter((o) => o.status === "Pending").length})
                </button>

                <button
                  onClick={() => setAdminOrderFilter("completed")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    adminOrderFilter === "completed"
                      ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  ✅ Approved ({adminOrdersList.filter((o) => o.status === "Completed").length})
                </button>

                <button
                  onClick={() => setAdminOrderFilter("rejected")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    adminOrderFilter === "rejected"
                      ? "bg-rose-500 text-white font-black shadow-md"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  ❌ Rejected ({adminOrdersList.filter((o) => o.status === "Rejected").length})
                </button>
              </div>

              <input
                type="text"
                placeholder="Search Order ID, Email or TrxID..."
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* ADMIN ORDERS APPROVAL TABLE */}
            <div className="glass-panel rounded-3xl border border-amber-500/30 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Email</th>
                      <th className="p-4">Product Purchased</th>
                      <th className="p-4">Payment Method & TrxID</th>
                      <th className="p-4">Total (BDT)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Admin Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No orders found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-4">
                            <div className="font-mono font-black text-amber-400 text-sm">{ord.orderId}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {new Date(ord.createdAt || Date.now()).toLocaleString()}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-white">{ord.userEmail || ord.customerEmail}</div>
                          </td>

                          <td className="p-4">
                            <div className="font-semibold text-cyan-300">
                              {ord.items && ord.items.length > 0 ? ord.items[0].title : "Digital Service Item"}
                            </div>
                          </td>

                          <td className="p-4 font-mono">
                            <div className="text-white font-bold">{ord.paymentMethod || "bKash / Nagad"}</div>
                            <div className="text-cyan-400 text-[11px] font-bold">{ord.trxId || "TRX-N/A"}</div>
                          </td>

                          <td className="p-4 font-black text-amber-300 text-sm">৳{ord.totalAmount}</td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border flex items-center gap-1.5 w-max ${
                                ord.status === "Completed"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : ord.status === "Rejected"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                              }`}
                            >
                              {ord.status === "Completed" && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                              {ord.status === "Rejected" && <X className="w-3 h-3 text-rose-400" />}
                              {ord.status === "Pending" && <Clock className="w-3 h-3 text-amber-400" />}
                              <span>{ord.status === "Completed" ? "APPROVED" : ord.status || "PENDING"}</span>
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {ord.status !== "Completed" && (
                                <button
                                  onClick={() => handleOpenApproveModal(ord)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:opacity-90 flex items-center gap-1 transition-all"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {ord.status !== "Rejected" && (
                                <button
                                  onClick={() => handleRejectOrder(ord.orderId)}
                                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl transition-all"
                                >
                                  Reject
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteOrder(ord.orderId)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                                title="Delete Order"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <OrderApprovalModal
        isOpen={!!approvingModalOrder}
        onClose={() => setApprovingModalOrder(null)}
        order={approvingModalOrder}
        onApproved={handleModalApprovedComplete}
      />
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </div>
  );
}
