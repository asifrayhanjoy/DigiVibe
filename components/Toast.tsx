"use client";

import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  toast: { title: string; message: string } | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-cyan-500/40 text-white rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-cyan-300">{toast.title}</h4>
          <p className="text-xs text-slate-300">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-slate-500 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
