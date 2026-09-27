"use client";

import { useState } from "react";
import {
  Shield,
  ShieldAlert,
  Lock,
  KeyRound,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Zap,
  Users,
  Wifi,
  Sparkles,
  PlayCircle,
  Tv,
  Video,
  Send,
  Cloud,
  Globe,
  Server,
  Radio,
  ThumbsUp,
  TrendingUp,
  Play,
  Mail,
  GraduationCap,
  Star,
  Check,
  ShoppingCart,
  ArrowRight,
  Clock
} from "lucide-react";
import { ServiceItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const ICON_MAP: Record<string, any> = {
  Shield,
  ShieldAlert,
  Lock,
  KeyRound,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Zap,
  Users,
  Wifi,
  Sparkles,
  PlayCircle,
  Tv,
  Video,
  Send,
  Cloud,
  Globe,
  Server,
  Radio,
  ThumbsUp,
  TrendingUp,
  Play,
  Mail,
  GraduationCap
};

interface ServiceCardProps {
  service: ServiceItem & { title_bn?: string; description_bn?: string };
  onAddToCart: (service: ServiceItem) => void;
  onBuyNow: (service: ServiceItem) => void;
}

export default function ServiceCard({ service, onAddToCart, onBuyNow }: ServiceCardProps) {
  const { locale } = useLanguage();
  const isBn = locale === "bn";
  const IconComponent = ICON_MAP[service.icon] || ShieldCheck;

  const [logoError, setLogoError] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discountPercent = Math.round(
    ((service.originalPrice - service.price) / service.originalPrice) * 100
  );

  const displayTitle = isBn ? service.title_bn || service.title : service.title;
  
  // Brand logo mapping for VPN products
  const isVpn = service.category?.toLowerCase() === "vpn";
  const firstWord = service.title.toLowerCase().split(" ")[0].replace(/[^a-z]/g, "");
  const rawLogo = (service as any).logo || `/images/vpns/${firstWord}.svg`;
  const fallbackLogo = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(service.title)}`;
  const displayLogo = logoError ? fallbackLogo : rawLogo;

  return (
    <div className="group relative glass-panel glass-panel-hover rounded-3xl p-4 flex flex-col justify-between overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
      {/* Background radial gradient on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />

      <div>
        {/* 1. Large Banner Image Container for VPN products (h-40) */}
        {isVpn ? (
          <div className="relative w-full h-40 rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:border-cyan-500/30 transition-all">
            {!imgError ? (
              <img
                src={displayLogo}
                alt={service.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => {
                  if (!logoError) setLogoError(true);
                  else setImgError(true);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-cyan-400">
                <span className="text-2xl font-black">{service.title?.slice(0, 2).toUpperCase()}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">VPN</span>
              </div>
            )}

            {/* Top Right Duration & Stock Badges ONLY */}
            <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
              <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 rounded-full backdrop-blur-md shadow-sm">
                {service.validity || (service as any).duration || "30 Days"}
              </span>
              {(service.stock === "Stock Out" || service.badge === "SOLD OUT" || (service as any).inStock === false) && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-md uppercase backdrop-blur-md">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Standard Top Badges for Non-VPN services */
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 p-1 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <IconComponent className="w-5 h-5 text-cyan-400 stroke-[2.2]" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-700 rounded-md">
                  {service.category.toUpperCase()}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              {service.badge}
            </span>
          </div>
        )}

        {/* Title with Small Left Brand Icon */}
        <div className="flex items-center gap-2.5 my-2">
          {isVpn && (
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 p-1 shrink-0 flex items-center justify-center">
              <img
                src={displayLogo}
                alt={service.title}
                className="w-full h-full object-contain"
                onError={() => {
                  if (!logoError) setLogoError(true);
                  else setImgError(true);
                }}
              />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {displayTitle}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
              {service.badge || "100% Full Fresh VPN ✅"}
            </p>
          </div>
        </div>

        {/* Rating & Stock */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-slate-200">{service.rating}</span>
            <span className="text-slate-500">({service.reviews})</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{isBn ? service.stock?.replace("In Stock", "স্টক আছে") : service.stock}</span>
          </div>
        </div>

        {/* Features list */}
        <div className="my-4 pt-3 border-t border-slate-800/80 space-y-2">
          {service.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <div className="p-0.5 rounded bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="leading-tight">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                ৳{service.price}
              </span>
              {service.originalPrice > service.price && (
                <span className="text-xs text-slate-500 line-through">
                  ৳{service.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{isBn ? "মেয়াদ:" : "Validity:"} <strong className="text-slate-200">{service.validity}</strong></span>
            </div>
          </div>

          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
              -{discountPercent}% {isBn ? "ছাড়" : "OFF"}
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(service)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
            <span>{isBn ? "কার্ট-এ যোগ করুন" : "Add Cart"}</span>
          </button>

          <button
            onClick={() => onBuyNow(service)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{isBn ? "এখনই কিনুন" : "Buy Now"}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
