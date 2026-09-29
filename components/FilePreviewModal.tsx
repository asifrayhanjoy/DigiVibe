"use client";

import { useState } from "react";
import { X, Download, FileText, Check, Copy, Eye, FileCode, Shield } from "lucide-react";

interface FileAttachment {
  name: string;
  type?: string;
  size?: number;
  data: string;
}

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileAttachment | null;
}

export default function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const fileName = file.name || "Attachment";
  const fileExtension = fileName.split(".").pop()?.toUpperCase() || "FILE";
  const isImage = file.data.startsWith("data:image/") || ["PNG", "JPG", "JPEG", "WEBP", "SVG"].includes(fileExtension);
  const isText = file.data.startsWith("data:text/") || file.data.startsWith("data:application/json") || ["TXT", "JSON", "OVPN", "CONF", "LOG", "MD", "CSV"].includes(fileExtension);

  let textContent = "";
  if (isText && file.data.includes(";base64,")) {
    try {
      const base64Str = file.data.split(";base64,")[1];
      textContent = atob(base64Str);
    } catch (e) {
      textContent = "Unable to decode text preview directly.";
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCopyText = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate max-w-[300px]">{fileName}</h3>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30">
                  {fileExtension}
                </span>
              </div>
              {file.size && (
                <span className="text-xs text-slate-400 font-mono">{formatFileSize(file.size)}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isImage ? (
            <div className="flex justify-center items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.data} alt={fileName} className="max-h-[60vh] object-contain rounded-lg" />
            </div>
          ) : isText && textContent ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>File Contents / Config Data:</span>
                </span>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Contents"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs font-semibold whitespace-pre-wrap break-all max-h-[50vh] overflow-y-auto leading-relaxed">
                {textContent}
              </pre>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <Shield className="w-10 h-10 text-cyan-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Attachment Ready for Download</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                This item is an application package or binary file ({fileExtension}). Click the button below to download and install/open it on your device.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Close
          </button>
          <a
            href={file.data}
            download={fileName}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download {fileName}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
