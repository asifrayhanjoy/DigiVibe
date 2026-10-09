"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import FilePreviewModal from "@/components/FilePreviewModal";
import BackgroundSlider from "@/components/BackgroundSlider";
import {
  Sparkles,
  Megaphone,
  Download,
  Trash2,
  Plus,
  X,
  Pin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  FileText,
  Paperclip,
  Clock,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  RefreshCw,
  Info
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetchUpdates, apiCreateUpdate, apiDeleteUpdate, apiPurgeAllUpdates, apiUploadToCloudinary } from "@/lib/api/services";

export default function UpdatesPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();

  const isAdmin = user?.role === "admin" || (user?.email || "").toLowerCase() === "mdasifrayhanjoy2@gmail.com";

  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  // Admin Modal / Creation Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Software Release");
  const [formBadge, setFormBadge] = useState("NEW UPDATE");
  const [formBanner, setFormBanner] = useState("");
  const [formPinned, setFormPinned] = useState(false);

  const [formCards, setFormCards] = useState<Array<{ title: string; content: string; badge: string; linkUrl: string }>>([
    { title: "Patch Notes / Highlights", content: "Key improvements and security enhancements included in this build.", badge: "V3.5", linkUrl: "" }
  ]);

  const [formFiles, setFormFiles] = useState<Array<{ name: string; url: string; size: string; type: string }>>([]);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Load All Updates from MongoDB Atlas
  const loadUpdates = async () => {
    setIsLoading(true);
    const data = await apiFetchUpdates();
    setUpdates(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUpdates();
  }, []);

  // Card Builder Helpers
  const handleAddCard = () => {
    setFormCards((prev) => [...prev, { title: "", content: "", badge: "", linkUrl: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    setFormCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (index: number, field: string, value: string) => {
    setFormCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  // File Builder Helpers
  const handleAddFile = () => {
    setFormFiles((prev) => [...prev, { name: "", url: "", size: "2.5 MB", type: "Software Package" }]);
  };

  const handleRemoveFile = (index: number) => {
    setFormFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, field: string, value: string) => {
    setFormFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  // Handle Attachment Upload (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Data = uploadEvent.target?.result as string;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        setFormFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, name: file.name, url: base64Data, size: sizeMb } : f))
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Image Upload (Base64)
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormBanner(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Update to MongoDB Atlas & Cloudinary
  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      showToast("Validation Warning ⚠️", "Please fill in title and description.");
      return;
    }

    setIsSubmitting(true);
    showToast("Uploading Assets to Cloudinary...", "Processing software binaries & banner image...");

    try {
      // 1. Upload Banner Image to Cloudinary if Base64
      let finalBannerUrl = formBanner;
      if (formBanner && formBanner.startsWith("data:")) {
        const bannerRes = await apiUploadToCloudinary(formBanner, "banner.png", "digivibe_banners");
        if (bannerRes.success && bannerRes.url) {
          finalBannerUrl = bannerRes.url;
        }
      }

      // 2. Upload Software / File Attachments to Cloudinary if Base64
      const validFiles = formFiles.filter((f) => f.name.trim() && f.url.trim());
      const uploadedCloudinaryFiles = await Promise.all(
        validFiles.map(async (file) => {
          if (file.url && file.url.startsWith("data:")) {
            const cloudRes = await apiUploadToCloudinary(file.url, file.name, "digivibe_software");
            if (cloudRes.success && cloudRes.url) {
              return {
                ...file,
                url: cloudRes.url,
              };
            }
          }
          return file;
        })
      );

      // 3. Save text metadata + Cloudinary URLs in MongoDB Atlas
      showToast("Saving to Database...", "Persisting update record to MongoDB Atlas...");
      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        category: formCategory,
        badgeText: formBadge || "NEW UPDATE",
        bannerImage: finalBannerUrl,
        cards: formCards.filter((c) => c.title.trim() && c.content.trim()),
        files: uploadedCloudinaryFiles,
        isPinned: formPinned,
        author: user?.name || "Master Admin",
      };

      const res = await apiCreateUpdate(payload);
      setIsSubmitting(false);

      if (res.success) {
        showToast("Update Published! 🚀", res.message);
        setIsCreating(false);
        // Reset Form
        setFormTitle("");
        setFormDescription("");
        setFormBanner("");
        setFormBadge("NEW UPDATE");
        setFormCards([{ title: "Patch Notes / Highlights", content: "Key improvements included.", badge: "V3.5", linkUrl: "" }]);
        setFormFiles([]);
        setFormPinned(false);
        // Refresh Stream
        loadUpdates();
      } else {
        showToast("Publishing Failed ❌", res.message);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      showToast("Publishing Error ❌", err?.message || "Failed to upload to Cloudinary or MongoDB.");
    }
  };

  // Delete Update Record from MongoDB Atlas (Admin Action)
  const handleDeleteUpdate = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the database?`)) return;

    // Optimistically update React state immediately for instant feedback
    setUpdates((prev) => prev.filter((u) => (u._id || u.id) !== id && u.title !== title));
    showToast("Deleting Update...", "Removing entry from database...");

    const res = await apiDeleteUpdate(id, title);
    if (res.success) {
      showToast("Entry Deleted 🗑️", `"${title}" has been deleted.`);
    } else {
      showToast("Delete Failed ❌", res.message || "Could not delete entry.");
      loadUpdates();
    }
  };

  // Delete ALL Update Records from MongoDB Atlas (Admin Purge Action)
  const handlePurgeAllUpdates = async () => {
    if (!confirm("Are you sure you want to permanently delete ALL entries in Today's Updates from MongoDB? This action cannot be undone.")) return;

    setUpdates([]);
    showToast("Purging All Updates...", "Deleting all update records from database...");

    const res = await apiPurgeAllUpdates();
    if (res.success) {
      showToast("All Entries Purged 🗑️", res.message);
    } else {
      showToast("Purge Failed ❌", res.message);
      loadUpdates();
    }
  };

  // Filter Updates
  const filteredUpdates = updates.filter((item) => {
    const matchesCat =
      selectedCategory === "all" ||
      (selectedCategory === "software" && item.category?.toLowerCase().includes("software")) ||
      (selectedCategory === "announcement" && item.category?.toLowerCase().includes("announcement")) ||
      (selectedCategory === "offer" && item.category?.toLowerCase().includes("offer"));

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* DYNAMIC 3D BACKGROUND SLIDER (Rotates 5 3D Tech Images every 4s with Dark Overlay) */}
      <BackgroundSlider />

      <Navbar onOpenSearch={() => { }} currentLocale={locale} />

      <main className="relative z-10 flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        
        {/* HERO HEADER BANNER */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-700/60 relative overflow-hidden bg-slate-900/80 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 w-max shadow-md shadow-cyan-500/10">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>Today's Update & Software Hub</span>
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Live System 🇧🇩
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                ⚡ Today's Live Updates & Downloads
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Stay informed with daily service updates, newly added software tools, app patches, premium downloads, and instant system notifications directly from our Master Admin team.
              </p>
            </div>

            {/* Admin Action Buttons */}
            {isAdmin && (
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-5 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>Publish New Update</span>
                </button>

                {updates.length > 0 && (
                  <button
                    onClick={handlePurgeAllUpdates}
                    className="px-4 py-3.5 bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-300 border border-rose-500/40 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Purge all updates permanently from MongoDB"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center gap-3 shadow-md">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Published</div>
                <div className="text-sm sm:text-base font-black text-white">{updates.length} Updates</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center gap-3 shadow-md">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Pin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pinned Feature</div>
                <div className="text-sm sm:text-base font-black text-amber-300">
                  {updates.filter((u) => u.isPinned).length} Pinned
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center gap-3 shadow-md">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Software Files</div>
                <div className="text-sm sm:text-base font-black text-emerald-400">
                  {updates.reduce((acc, curr) => acc + (curr.files?.length || 0), 0)} Software
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center gap-3 shadow-md">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verified By</div>
                <div className="text-sm sm:text-base font-black text-white">Master Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROL BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "all"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
            >
              All Updates ({updates.length})
            </button>

            <button
              onClick={() => setSelectedCategory("software")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "software"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                  : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                }`}
            >
              💻 Software & Tools
            </button>

            <button
              onClick={() => setSelectedCategory("announcement")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "announcement"
                  ? "bg-amber-500 text-slate-950 font-black shadow-md"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                }`}
            >
              📢 Announcements
            </button>

            <button
              onClick={() => setSelectedCategory("offer")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "offer"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                }`}
            >
              🎉 Daily Offers
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search updates or software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={loadUpdates}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
              title="Refresh Updates Stream"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* UPDATES STREAM LIST VIEW */}
        {isLoading ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl text-center space-y-3 shadow-2xl">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-300 font-extrabold">Fetching fresh daily updates from MongoDB Atlas...</p>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-slate-700/60 bg-slate-900/85 backdrop-blur-xl text-center space-y-4 shadow-2xl max-w-3xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
              <Megaphone className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white tracking-tight">No Updates Found</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">There are no updates matching your search query or filter criteria.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsCreating(true)}
                className="mt-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create First Update</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredUpdates.map((item) => (
              <article
                key={item._id}
                className={`glass-panel rounded-3xl border backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-2xl ${item.isPinned
                    ? "border-amber-500/50 bg-slate-900/85 hover:border-amber-400"
                    : "border-slate-700/60 bg-slate-900/80 hover:border-cyan-500/40"
                  }`}
              >
                {/* Header Metadata Bar */}
                <div className="p-6 sm:p-8 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {item.isPinned && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Pinned Update</span>
                      </span>
                    )}

                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {item.category || "Software Release"}
                    </span>

                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-slate-900 text-slate-300 border border-slate-800 rounded-md">
                      {item.badgeText || "NEW UPDATE"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{new Date(item.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </span>

                    {/* Admin Delete Action Button */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteUpdate(item._id, item.title)}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1"
                        title="Delete this update from database"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Entry</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Banner Image Preview */}
                  {item.bannerImage && (
                    <div className="rounded-2xl border border-slate-800 overflow-hidden max-h-96 relative group">
                      <img
                        src={item.bannerImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Structured Detail Cards Grid */}
                  {item.cards && item.cards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {item.cards.map((card: any, cIdx: number) => (
                        <div
                          key={cIdx}
                          className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 space-y-2 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-md"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-black text-white truncate">{card.title}</h4>
                              {card.badge && (
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md">
                                  {card.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                              {card.content}
                            </p>
                          </div>

                          {card.linkUrl && (
                            <Link
                              href={card.linkUrl.startsWith("http") ? card.linkUrl : `/${locale}${card.linkUrl}`}
                              className="mt-3 px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 inline-flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <span>Buy Now (অর্ডার করুন)</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Promotional Offer Direct CTA Actions */}
                  {item.category === "Promotional Offer" && (
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      {item.title.includes("ChatGPT") ? (
                        <Link
                          href={`/${locale}/services?query=ChatGPT`}
                          className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-pink-500/20 inline-flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4 fill-white" />
                          <span>Buy ChatGPT Plus Now (অর্ডার করুন)</span>
                          <ArrowRight className="w-4 h-4 stroke-[3]" />
                        </Link>
                      ) : (
                        <Link
                          href={`/${locale}/services?query=Gemini`}
                          className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4 fill-slate-950" />
                          <span>Order Gemini Pro Subscription Now (৳১৫০ / ৳২৫০)</span>
                          <ArrowRight className="w-4 h-4 stroke-[3]" />
                        </Link>
                      )}

                      <a
                        href={`https://wa.me/8801700000000?text=Hi!%20I%20want%20to%20order%20"${encodeURIComponent(item.title)}"`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 transition-all"
                      >
                        <span>Contact Admin on WhatsApp</span>
                      </a>
                    </div>
                  )}

                  {/* Downloadable Software & File Attachments Box */}
                  {item.files && item.files.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-black uppercase text-white tracking-wider">
                          Software Downloads & Attachments ({item.files.length})
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.files.map((file: any, fIdx: number) => (
                          <div
                            key={fIdx}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-500/40 transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                                💾
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                                  {file.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {file.size || "Software Attachment"}
                                </div>
                              </div>
                            </div>

                            <a
                              href={file.url}
                              download={file.name}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shrink-0"
                            >
                              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Download</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ADMIN CREATION MODAL DRAWER */}
      {isCreating && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Publish Today's Update (Admin)</h3>
                  <p className="text-xs text-amber-300 font-mono">Saved directly to MongoDB Atlas</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreating(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishUpdate} className="space-y-5">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Update Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v3.5 Superfast VPN & AI Tool Patch Released!"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Software Release">Software Release</option>
                    <option value="Daily Offer">Daily Offer</option>
                    <option value="System Update">System Update</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>
              </div>

              {/* Badge Text & Pinned Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Badge Pill Text</label>
                  <input
                    type="text"
                    placeholder="e.g. NEW RELEASE or CRITICAL UPDATE"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                    <input
                      type="checkbox"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>Pin this update to top 📌</span>
                  </label>
                </div>
              </div>

              {/* Main Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Main Description / Update Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete details about today's software release, service update or announcement..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Banner Image Input / Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Banner Image (Optional)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Image URL or upload file below..."
                    value={formBanner}
                    onChange={(e) => setFormBanner(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                  <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 cursor-pointer flex items-center gap-1">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* DYNAMIC CARD BUILDER */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Structured Information Cards ({formCards.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCard}
                    className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </button>
                </div>

                {formCards.map((card, cIdx) => (
                  <div key={cIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(cIdx)}
                      className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="Card Title (e.g. System Requirements)"
                        value={card.title}
                        onChange={(e) => handleCardChange(cIdx, "title", e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Badge (e.g. V3.5 or REQUIRED)"
                        value={card.badge}
                        onChange={(e) => handleCardChange(cIdx, "badge", e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Card details or instructions..."
                      value={card.content}
                      onChange={(e) => handleCardChange(cIdx, "content", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                ))}
              </div>

              {/* DYNAMIC FILE / SOFTWARE ATTACHMENT BUILDER */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-400" />
                    <span>Software & File Attachments ({formFiles.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFile}
                    className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add File Link</span>
                  </button>
                </div>

                {formFiles.map((file, fIdx) => (
                  <div key={fIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(fIdx)}
                      className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="File Name (e.g. DigiVibe_v3.zip)"
                        value={file.name}
                        onChange={(e) => handleFileChange(fIdx, "name", e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="File Size (e.g. 15 MB)"
                        value={file.size}
                        onChange={(e) => handleFileChange(fIdx, "size", e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <label className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 cursor-pointer flex items-center justify-center gap-1 truncate">
                        <UploadIcon />
                        <span>Upload File</span>
                        <input type="file" onChange={(e) => handleFileUpload(e, fIdx)} className="hidden" />
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Download URL or uploaded base64 data..."
                      value={file.url}
                      onChange={(e) => handleFileChange(fIdx, "url", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing..." : "Publish Today's Update"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <FilePreviewModal isOpen={!!previewFile} onClose={() => setPreviewFile(null)} file={previewFile} />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}
