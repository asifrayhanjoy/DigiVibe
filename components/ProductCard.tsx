'use client';

import React, { useState } from 'react';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    category?: string;
    subtitle?: string;
    price: number;
    originalPrice?: number;
    duration?: string;
    validity?: string;
    rating?: number;
    reviews?: number;
    inStock?: boolean;
    stock?: string;
    badge?: string;
    logo?: string;
    image?: string;
    features?: string[];
  };
  onAddToCart?: (product: any) => void;
  onBuyNow?: (product: any) => void;
}

export const ProductCard = ({ product, onAddToCart, onBuyNow }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);

  const brandName = product.title?.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '') || 'vpn';
  const imageSrc = product.image || product.logo || `/images/vpns/${brandName}.svg`;
  const logoSrc = product.logo || product.image || `/images/vpns/${brandName}.svg`;

  const isSoldOut = product.inStock === false || product.stock === 'Stock Out' || product.badge === 'SOLD OUT';

  return (
    <div className="group relative glass-panel glass-panel-hover rounded-3xl p-4 flex flex-col justify-between overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
      {/* 1. Large Prominent Banner Image Container (h-40) */}
      <div className="relative w-full h-40 rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:border-cyan-500/30 transition-all">
        {!imgError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-cyan-400">
            <span className="text-2xl font-black">{product.title?.slice(0, 2).toUpperCase()}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{product.category || 'VPN'}</span>
          </div>
        )}

        {/* Top Right Duration & Stock Badges ONLY */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 rounded-full backdrop-blur-md shadow-sm">
            {product.duration || product.validity || '30 Days'}
          </span>
          {isSoldOut && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-md uppercase backdrop-blur-md">
              SOLD OUT
            </span>
          )}
        </div>
      </div>

      {/* 2. Title & Specific Brand Information */}
      <div className="my-2 flex items-center gap-2.5">
        {/* Small Left Brand Icon */}
        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 p-1 shrink-0 flex items-center justify-center">
          <img
            src={logoSrc}
            alt={product.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
            {product.subtitle || '100% Full Fresh VPN ✅'}
          </p>
        </div>
      </div>

      {/* 3. Pricing & Actions */}
      <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-xl font-black text-white tracking-tight">
            ৳{product.price}.00
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-500 line-through block text-[11px]">
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onAddToCart && !isSoldOut && (
            <button
              onClick={() => onAddToCart(product)}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all active:scale-95"
            >
              Cart
            </button>
          )}

          <button
            disabled={isSoldOut}
            onClick={() => !isSoldOut && onBuyNow?.(product)}
            className={`py-2 px-4 font-black text-xs rounded-xl shadow-md transition-all ${
              isSoldOut
                ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 shadow-cyan-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            {isSoldOut ? 'STOCK OUT' : '⚡ Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
