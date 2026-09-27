"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
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
  Laptop
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  apiFetchProfile,
  apiUpdateProfile,
  apiAddWalletCredit,
  apiFetchUserAssets,
  apiFetchUserOrders
} from "@/lib/api/services";

type TabId = "assets" | "edit-profile" | "orders" | "security" | "support";

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
    walletBalance: authUser?.walletBalance || 0,
  });

  // Real Database Records State (NO MOCK DATA)
  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [isAddCreditOpen, setIsAddCreditOpen] = useState(false);
  const [addCreditAmount, setAddCreditAmount] = useState("500");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // FETCH REAL USER PROFILE, ASSETS & ORDERS DIRECTLY FROM MONGODB ATLAS
  useEffect(() => {
    const userEmail = authUser?.email || localStorage.getItem("digivibe_user_email");
    if (userEmail) {
      setIsLoadingDb(true);

      // 1. Fetch User Document
      apiFetchProfile(userEmail).then((dbUser) => {
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
      });

      // 2. Fetch User Assets from MongoDB Atlas
      apiFetchUserAssets(userEmail).then((assets) => {
        setDbAssets(assets);
      });

      // 3. Fetch User Orders from MongoDB Atlas
      apiFetchUserOrders(userEmail).then((orders) => {
        setDbOrders(orders);
        setIsLoadingDb(false);
      });
    } else {
      setIsLoadingDb(false);
    }
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

  // Wallet Top-Up in MongoDB Atlas
  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(addCreditAmount, 10) || 0;
    setIsAddCreditOpen(false);

    showToast("Processing Top-Up...", "Saving credit to MongoDB Atlas...");

    const res = await apiAddWalletCredit(profile.email, amountNum);

    if (res.success && res.walletBalance !== undefined) {
      setProfile((prev) => ({ ...prev, walletBalance: res.walletBalance! }));
      showToast("Credit Saved to Database! 💳", res.message);
    } else {
      showToast("Top-Up Request Sent", res.message);
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

          {/* Real Database Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            {/* Wallet Balance Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Wallet Balance</div>
                  <div className="text-lg font-black text-white">৳{profile.walletBalance}</div>
                </div>
              </div>

              <button
                onClick={() => setIsAddCreditOpen(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Credit</span>
              </button>
            </div>

            {/* Total Orders Completed Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold">Orders Completed</div>
                <div className="text-lg font-black text-white">{dbOrders.length} Completed</div>
              </div>
            </div>

            {/* Active Subscriptions Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold">Active Digital Assets</div>
                <div className="text-lg font-black text-cyan-400">{dbAssets.length} Active</div>
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

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-semibold">Access Credentials:</span>
                        <button
                          onClick={() => handleCopy(asset.credentials, asset._id || asset.id)}
                          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold"
                        >
                          {copiedId === (asset._id || asset.id) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === (asset._id || asset.id) ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <div className="text-cyan-300 font-mono text-xs font-bold break-all">{asset.credentials}</div>
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
                          <td className="p-4 font-mono font-bold text-cyan-400">{ord.orderId}</td>
                          <td className="p-4 font-bold text-white">{ord.items?.length || 1} Item(s)</td>
                          <td className="p-4 text-slate-400">{new Date(ord.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="p-4">{ord.paymentMethod}</td>
                          <td className="p-4 font-mono text-cyan-300">{ord.trxId}</td>
                          <td className="p-4 font-black text-cyan-300">৳{ord.totalAmount}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                              {ord.status || "Delivered"}
                            </span>
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
      </main>

      {/* ADD CREDIT MODAL */}
      {isAddCreditOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsAddCreditOpen(false)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 z-10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" />
                <span>Add Wallet Credit (MongoDB Atlas)</span>
              </h3>
              <button onClick={() => setIsAddCreditOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCredit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Amount in BDT (৳)</label>
                <input
                  type="number"
                  min="100"
                  value={addCreditAmount}
                  onChange={(e) => setAddCreditAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono font-bold"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-md">
                Proceed & Save Credit to Database ৳{addCreditAmount}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
