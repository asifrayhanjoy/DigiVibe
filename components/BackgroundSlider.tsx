"use client";

import { useState, useEffect, memo } from "react";

const BG_IMAGES = [
  "/images/bg1.jpg",
  "/images/bg2.jpg",
  "/images/bg3.jpg",
  "/images/bg4.jpg",
  "/images/bg5.jpg"
];

function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileOrLowEnd, setIsMobileOrLowEnd] = useState<boolean>(false);

  useEffect(() => {
    const checkPerformanceProfile = () => {
      if (typeof window === "undefined") return;

      const isMobileWidth = window.innerWidth < 768;

      // Detect Slow Network Connections (2G / 3G / Save-Data mode)
      const navConn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const isSlowConnection = navConn
        ? navConn.saveData || navConn.effectiveType === "slow-2g" || navConn.effectiveType === "2g" || navConn.effectiveType === "3g"
        : false;

      // Detect Low-End Hardware (<= 4 CPU cores, <= 4GB RAM, or prefers-reduced-motion)
      const isLowCPU = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
      const isLowRAM = typeof (navigator as any).deviceMemory === "number" && (navigator as any).deviceMemory <= 4;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setIsMobileOrLowEnd(isMobileWidth || isSlowConnection || isLowCPU || isLowRAM || prefersReducedMotion);
    };

    checkPerformanceProfile();

    window.addEventListener("resize", checkPerformanceProfile, { passive: true });
    return () => window.removeEventListener("resize", checkPerformanceProfile);
  }, []);

  useEffect(() => {
    // Completely disable timer loops on mobile or low-performance profiles for zero CPU/GPU overhead
    if (isMobileOrLowEnd) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isMobileOrLowEnd]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none contain-strict">
      {/* Smart Adaptation: Render ultra-lightweight dark gradient background for low-end / mobile / slow network users */}
      {isMobileOrLowEnd ? (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#070b16] to-slate-950 z-10" />
      ) : (
        /* Layered Desktop Background Slider */
        BG_IMAGES.map((src, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 animate-kenburns z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url('${src}')`,
                willChange: isActive ? "opacity, transform" : "opacity",
                transform: "translateZ(0)"
              }}
            />
          );
        })
      )}

      {/* Crystal Clear Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/45 via-slate-950/60 to-slate-950/85" />

      {/* Lightweight Ambient Radial Lighting (Only on High Performance Desktop) */}
      {!isMobileOrLowEnd && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] z-20 pointer-events-none" />
      )}

      {/* Navigation Indicator Dots (Desktop Only) */}
      {!isMobileOrLowEnd && (
        <div className="absolute bottom-6 left-6 z-30 flex items-center gap-1.5 pointer-events-auto">
          {BG_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-cyan-400 shadow-lg shadow-cyan-400/50"
                  : "w-1.5 bg-slate-500/60 hover:bg-slate-300"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(BackgroundSlider);
