"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  UploadCloud,
  FileText,
  Package,
  Download,
  Trash2,
  Lock,
  User,
  ShoppingBag,
  Sparkles,
  Paperclip
} from "lucide-react";
import { apiUpdateOrderStatus } from "@/lib/api/services";

export interface OrderApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onApproved: (updatedOrder: any) => void;
}

export default function OrderApprovalModal({
  isOpen,
  onClose,
  order,
  onApproved
}: OrderApprovalModalProps) {
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: number; type: string; data: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    if (order) {
      const firstItemTitle = order.items && order.items[0]?.title ? order.items[0].title : "Service";
      const cleanTitleKey = firstItemTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const sampleCreds = `User: ${cleanTitleKey}_vip@digivibe.com | Pass: DV#${Math.floor(1000 + Math.random() * 9000)}!\n\nNote: 24/7 Full Replacement Warranty Active. Please follow setup instructions.`;
      setDeliveryNotes(order.deliveryNotes || sampleCreds);
      setAttachedFiles(order.deliveryFiles || []);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const itemSummary = order.items && order.items.length > 0
    ? order.items.map((i: any) => `${i.title}${i.quantity ? ` (x${i.quantity})` : ""}`).join(", ")
    : "Digital Service";

  // File Upload Helper (converts file to Base64 object)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const filePromises = filesArray.map((file) => {
        return new Promise<{ name: string; size: number; type: string; data: string }>((resolve, reject) => {
          // Limit file size to 10MB per file for base64 storage
          if (file.size > 10 * 1024 * 1024) {
            reject(new Error(`File "${file.name}" exceeds 10MB limit.`));
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type || "application/octet-stream",
              data: event.target?.result as string
            });
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises)
        .then((newFiles) => {
          setAttachedFiles((prev) => [...prev, ...newFiles]);
        })
        .catch((err: any) => {
          setUploadError(err?.message || "File upload failed.");
        });
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiUpdateOrderStatus(
        order.orderId,
        "Completed",
        deliveryNotes,
        attachedFiles,
        deliveryNotes
      );

      setIsSubmitting(false);

      if (res.success) {
        onApproved(res.order || { ...order, status: "Completed", deliveryNotes, deliveryFiles: attachedFiles });
        onClose();
      } else {
        alert(`Approval Error: ${res.message}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      alert(`Approval error: ${err?.message || "Failed to update order in MongoDB Atlas."}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Approve & Deliver Order</h2>
              <p className="text-xs text-cyan-400 font-mono font-bold">#{order.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmApproval} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Order Summary Info Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span>Customer:</span>
              <span className="text-white font-bold">{order.customerEmail || order.userEmail}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Product(s):</span>
              <span className="text-cyan-300 font-bold">{itemSummary}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Payment & TrxID:</span>
              <span className="text-slate-200 font-mono">{order.paymentMethod} ({order.trxId})</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
              <span className="text-slate-300">Total Paid:</span>
              <span className="text-cyan-400 text-base">৳{order.totalAmount}</span>
            </div>
          </div>

          {/* Rich Text Delivery Details / Instructions Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Delivery Details, Credentials & Instructions (ক্রেতার জন্য অ্যাকসেস/নোট) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. User: account@domain.com | Pass: DV#2026! | Instructions: Follow setup notes."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed shadow-inner"
            />
          </div>

          {/* File & App Attachment Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Attach Apps / Files / PDFs (.apk, .zip, .pdf, .ovpn, software installers)
            </label>

            <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 bg-slate-900/40 text-center transition-all">
              <input
                type="file"
                multiple
                accept=".apk,.zip,.pdf,.ovpn,.json,.exe,.dmg,.txt,image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                <UploadCloud className="w-8 h-8 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">
                  Click or drag files here to attach to order
                </span>
                <span className="text-[10px] text-slate-400">
                  Supports .apk, .zip, .pdf, .ovpn, .json, and installer files
                </span>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 mt-1.5 font-bold">{uploadError}</p>
            )}

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Attached Files ({attachedFiles.length}):
                </div>
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-white font-medium truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>{isSubmitting ? "Approving & Saving..." : "Confirm & Deliver Order (অনুমোদন করুন)"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-2xl border border-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
