'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';

export const VPNProductGrid = ({
  products,
  onAddToCart,
  onBuyNow,
  onEditProduct,
  onDeleteProduct
}: {
  products: any[];
  onAddToCart?: (product: any) => void;
  onBuyNow?: (product: any) => void;
  onEditProduct?: (product: any) => void;
  onDeleteProduct?: (product: any) => void;
}) => {
  const [activeTab, setActiveTab] = useState('All');

  const durationTabs = [
    { label: 'All VPNs', value: 'All' },
    { label: '3 Days', value: '3 Days' },
    { label: '7 Days (1 Week)', value: '7 Days' },
    { label: '14 Days', value: '14 Days' },
    { label: '30 Days (1 Month)', value: '30 Days' }
  ];

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter((p) => (p.duration || p.validity) === activeTab);

  return (
    <div className="w-full space-y-3.5">
      {/* 1. Duration Sub-category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {durationTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.value
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default VPNProductGrid;
