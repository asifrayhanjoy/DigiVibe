"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Plus, Trash2, Check, Image as ImageIcon, Save, AlertCircle } from "lucide-react";
import { ServiceItem } from "@/types";

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (product: any) => void;
  mode: "add" | "edit";
  initialData?: ServiceItem | null;
}

export default function AdminProductModal({
  isOpen,
  onClose,
  onSaveSuccess,
  mode,
  initialData,
}: AdminProductModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "subscriptions",
    subtitle: "",
    price: 0,
    originalPrice: 0,
    badge: "",
    stock: "In Stock",
    inStock: true,
    rating: 4.9,
    reviews: 120,
    logo: "",
    image: "",
    logoType: "",
    icon: "Sparkles",
    popular: false,
    unit: "",
    delivery: "Instant Auto-Delivery",
    duration: "7 Days",
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      if (mode === "edit" && initialData) {
        setFormData({
          id: initialData.id || "",
          title: initialData.title || "",
          category: initialData.category || "subscriptions",
          subtitle: initialData.subtitle || initialData.badge || "",
          price: initialData.price || 0,
          originalPrice: initialData.originalPrice || Math.round((initialData.price || 0) * 1.2),
          badge: initialData.badge || initialData.subtitle || "",
          stock: initialData.stock || (initialData.inStock === false ? "Out of Stock" : "In Stock"),
          inStock: initialData.inStock !== false && initialData.stock !== "Out of Stock" && initialData.stock !== "Stock Out" && initialData.stock !== "Sold Out",
          rating: initialData.rating || 4.9,
          reviews: initialData.reviews || 120,
          logo: (initialData as any).logo || (initialData as any).image || "",
          image: (initialData as any).image || (initialData as any).logo || "",
          logoType: (initialData as any).logoType || "",
          icon: initialData.icon || "Sparkles",
          popular: !!initialData.popular,
          unit: initialData.unit || "",
          delivery: initialData.delivery || "Instant Auto-Delivery",
          duration: initialData.validity || (initialData as any).duration || "7 Days",
        });
        setFeatures(
          Array.isArray(initialData.features) && initialData.features.length > 0
            ? [...initialData.features]
            : ["Full Replacement Warranty Support", "High Speed Instant Delivery", "100% Guaranteed Genuine"]
        );
      } else {
        // Default values for ADD mode
        setFormData({
          id: "",
          title: "",
          category: "subscriptions",
          subtitle: "24h warranty",
          price: 100,
          originalPrice: 150,
          badge: "Popular 🔥",
          stock: "In Stock",
          inStock: true,
          rating: 5.0,
          reviews: 100,
          logo: "",
          image: "",
          logoType: "chatgpt",
          icon: "Sparkles",
          popular: true,
          unit: "",
          delivery: "Instant Auto-Delivery",
          duration: "30 Days",
        });
        setFeatures([
          "Access to GPT-4o, GPT-4 Turbo & DALL-E 3",
          "Custom GPTs & Sora Video Creator Access",
          "Private Email Login / Shared VIP Slot",
          "24 Hours Full Replacement Warranty",
        ]);
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage("Please enter a valid product title.");
      return;
    }
    if (formData.price <= 0) {
      setErrorMessage("Price must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        features,
        badge: formData.badge || formData.subtitle,
        tag: formData.badge,
        validity: formData.duration,
      };

      const url = mode === "edit" && formData.id ? `/api/products/${encodeURIComponent(formData.id)}` : "/api/products";
      const method = mode === "edit" && formData.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save product.");
      }

      onSaveSuccess(data.product);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 sm:backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto transform-gpu">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col transform-gpu">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5 fill-cyan-400/20" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {mode === "edit" ? "Edit Service Card" : "Add New Service Card"}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === "edit" ? "Update details & sync directly with database" : "Create a new database-driven service card"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Service Card Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. ChatGPT Plus (GPT-4o & Sora)"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Category <span className="text-cyan-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-cyan-300 font-bold focus:outline-none transition-colors"
              >
                <option value="subscriptions">subscriptions (AI Tools)</option>
                <option value="vpn">vpn (VPN Services)</option>
                <option value="ip">ip (IP & Proxies)</option>
                <option value="smm">smm (SMM Growth)</option>
                <option value="email">email (Email Accounts)</option>
                <option value="telegram">telegram (Telegram)</option>
                <option value="hosting">hosting (Hosting)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price, Original Price, Stock Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price (৳) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white font-bold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Original Price (৳) <span className="text-slate-500">(For discount calculation)</span>
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-slate-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Stock Status
              </label>
              <select
                value={formData.stock}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    stock: val,
                    inStock: val === "In Stock",
                  });
                }}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm font-bold focus:outline-none transition-colors text-emerald-400"
              >
                <option value="In Stock" className="text-emerald-400">In Stock (Available)</option>
                <option value="Out of Stock" className="text-rose-400">Out of Stock (Stock Out)</option>
                <option value="Sold Out" className="text-rose-400">Sold Out</option>
              </select>
            </div>
          </div>

          {/* Row 3: Subtitle/Badge & LogoType/Image */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Badge / Subtitle
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value, subtitle: e.target.value })}
                placeholder="e.g. 24h warranty or Popular 🔥"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Logo Type / Brand Preset
              </label>
              <select
                value={formData.logoType}
                onChange={(e) => setFormData({ ...formData, logoType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-cyan-300 font-bold focus:outline-none transition-colors"
              >
                <option value="">Custom Image URL</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="capcut">CapCut</option>
                <option value="netflix">Netflix</option>
                <option value="telegram">Telegram</option>
                <option value="youtube">YouTube</option>
                <option value="gemini">Google Gemini</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="textnow">TextNow</option>
                <option value="owl proxy">Owl Proxy</option>
                <option value="cli proxy">Cli Proxy</option>
                <option value="9 proxy">9 Proxy</option>
                <option value="h143 proxy">H143 Proxy</option>
                <option value="abc proxy">ABC Proxy</option>
                <option value="711 proxy">711 Proxy</option>
                <option value="loki proxy">Loki Proxy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Custom Logo/Image URL
              </label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value, image: e.target.value })}
                placeholder="e.g. /images/vpns/nordvpn.svg"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Rating, Reviews, Unit & Popular Checkbox */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                max="5"
                min="1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-amber-400 font-bold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Reviews Count</label>
              <input
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Unit (optional)</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. PCS, GB, 1000pcs"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="pt-5 flex items-center gap-2">
              <label className="relative flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-4 h-4 text-cyan-400 rounded bg-slate-950 border-slate-800 focus:ring-cyan-400 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-xs font-bold text-cyan-300">🔥 Mark Popular</span>
              </label>
            </div>
          </div>

          {/* Row 5: Dynamic Features Checklist List */}
          <div className="pt-3 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Card Features Checklist ({features.length})
            </label>

            <div className="space-y-2 mb-3">
              {features.map((feat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-1 hover:text-rose-400 text-slate-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add a new feature point..."
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? "Saving to DB..." : mode === "edit" ? "Save Changes" : "Create Card"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
