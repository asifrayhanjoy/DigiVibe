"use client";

import { useEffect } from "react";
import { Search, X, Zap, ArrowRight } from "lucide-react";
import { ServiceItem } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  onSearchSubmit?: (query: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectService,
  onSearchSubmit
}: SearchModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center transform-gpu">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 sm:backdrop-blur-md transition-opacity animate-in fade-in"
      />

      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 self-start transform-gpu">
        {/* Search Header Form */}
        <form onSubmit={handleFormSubmit} className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 ml-2" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search VPNs, Netflix, ChatGPT, SIM Packs..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching digital services found for "{searchQuery}".
            </div>
          ) : (
            searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectService(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="uppercase text-cyan-400 font-semibold">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-cyan-400">৳{item.price}</span>
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Esc</kbd> to exit</span>
          <span className="text-cyan-400 font-semibold">{searchResults.length} Products Available</span>
        </div>
      </div>
    </div>
  );
}
