'use client';

import React, { useState } from 'react';
import { Globe, Zap, Wifi, Smartphone, Radio, Sparkles } from 'lucide-react';
import ServiceCard from './ServiceCard';

export interface SimFilterBarProps {
  selectedOperator: string;
  setSelectedOperator: (op: string) => void;
}

export const SimFilterBar = ({ selectedOperator, setSelectedOperator }: SimFilterBarProps) => {
  const operatorTabs = [
    { label: 'All', value: 'All', icon: <Globe className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Recharge', value: 'Recharge', icon: <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> },
    { label: 'GP', value: 'GP', icon: <Wifi className="w-3.5 h-3.5 text-sky-400" /> },
    { label: 'BL', value: 'BL', icon: <Smartphone className="w-3.5 h-3.5 text-orange-400" /> },
    { label: 'RB', value: 'RB', icon: <Radio className="w-3.5 h-3.5 text-rose-500" /> },
    { label: 'CRL', value: 'CRL', icon: <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> },
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
      {operatorTabs.map((tab) => {
        const isActive = selectedOperator === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => setSelectedOperator(tab.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              isActive
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export interface SimOfferGridProps {
  simOffers: any[];
  onAddToCart?: (offer: any) => void;
  onBuyNow?: (offer: any) => void;
}

export const SimOfferGrid = ({
  simOffers,
  onAddToCart,
  onBuyNow
}: SimOfferGridProps) => {
  const [selectedOperator, setSelectedOperator] = useState('All');

  // Helper function to detect operator dynamically if not explicitly set
  const getOperatorType = (item: any) => {
    if (item.operator) {
      const op = item.operator.toUpperCase();
      if (op === 'GP' || op === 'GRAMEENPHONE' || op === 'SKITTO') return 'GP';
      if (op === 'BL' || op === 'BANGLALINK') return 'BL';
      if (op === 'RB' || op === 'ROBI') return 'RB';
      if (op === 'CRL' || op === 'AIRTEL' || op === 'CIRKLE') return 'CRL';
      if (op === 'RECHARGE') return 'Recharge';
      return item.operator;
    }
    const title = (item.title + ' ' + (item.subtitle || '') + ' ' + (item.id || '')).toLowerCase();
    if (title.includes('রবি') || title.includes('robi')) return 'RB';
    if (title.includes('airtel') || title.includes('cirkle') || title.includes('crl')) return 'CRL';
    if (title.includes('recharge') || title.includes('রিচার্জ') || title.includes('brilliant') || title.includes('alaap') || title.includes('stc')) return 'Recharge';
    if (title.includes('বাংলালিংক') || title.includes('bl') || title.includes('banglalink')) return 'BL';
    if (title.includes('gp') || title.includes('grameen') || title.includes('skitto') || title.includes('গ্রামীণ')) return 'GP';
    return 'RB'; // default fallback
  };

  const filteredOffers = selectedOperator === 'All'
    ? simOffers
    : simOffers.filter((item) => getOperatorType(item) === selectedOperator);

  return (
    <div className="w-full space-y-6">
      {/* Operator Filter Tabs Bar */}
      <SimFilterBar
        selectedOperator={selectedOperator}
        setSelectedOperator={setSelectedOperator}
      />

      {/* Showing Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
        <span>
          Showing <strong className="text-amber-400 font-extrabold">{filteredOffers.length}</strong> Offers for{' '}
          <strong className="text-slate-200">{selectedOperator === 'All' ? 'All Operators' : selectedOperator}</strong>
        </span>
      </div>

      {/* SIM Offer Cards Grid */}
      {filteredOffers.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-4">
          <h3 className="text-base font-bold text-slate-300">No SIM offers found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different operator tab above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOffers.map((offer) => (
            <ServiceCard
              key={offer.id}
              service={offer}
              onAddToCart={onAddToCart || (() => {})}
              onBuyNow={onBuyNow || (() => {})}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimOfferGrid;
