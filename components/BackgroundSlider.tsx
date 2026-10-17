"use client";

import { useState, useEffect, memo, useRef, useCallback } from "react";

const BG_IMAGES = [
  "/images/bg1.jpg",
  "/images/bg2.jpg",
  "/images/bg3.jpg",
  "/images/bg4.jpg",
  "/images/bg5.jpg"
];

function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEligibleForSlider, setIsEligibleForSlider] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect capability: enable rich image slider only on capable desktop devices with good network & motion allowed
  useEffect(() => {
    const checkEligibility = () => {
      if (typeof window === "undefined") return;

      const isMobileWidth = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Detect Slow Network Connections (Save-Data mode, 2G, 3G)
      const navConn =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;
      const isSlowConnection = navConn
        ? navConn.saveData ||
          navConn.effectiveType === "slow-2g" ||
          navConn.effectiveType === "2g" ||
          navConn.effectiveType === "3g"
        : false;

      // Detect Low-End Hardware (<= 4 CPU cores or <= 4GB RAM)
      const isLowCPU = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
      const isLowRAM = typeof (navigator as any).deviceMemory === "number" && (navigator as any).deviceMemory <= 4;

      const eligible = !isMobileWidth && !prefersReducedMotion && !isSlowConnection && !isLowCPU && !isLowRAM;
      setIsEligibleForSlider(eligible);
    };

    checkEligibility();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkEligibility, 250);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
  }, []);

  // Interval timer with intelligent tab visibility handling (0% CPU when tab is hidden)
  useEffect(() => {
    if (!isEligibleForSlider) return;

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(nextSlide, 7000);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    startTimer();

    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isEligibleForSlider, nextSlide]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Fast CSS-Only Dark Ambient Gradient Mesh (Always active, 0 overhead) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#070b16] to-slate-950 z-0" />

      {/* 2. Hardware-Accelerated Dynamic Slider (Desktop with motion enabled only) */}
      {isEligibleForSlider && (
        <div className="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out">
          {BG_IMAGES.map((src, index) => {
            const isActive = index === currentIndex;
            // Only keep active or adjacent slides in the active layer to save GPU texture memory
            const isNear = Math.abs(index - currentIndex) <= 1 || (currentIndex === 0 && index === BG_IMAGES.length - 1);
            if (!isNear) return null;

            return (
              <div
                key={src}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 animate-kenburns z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  backgroundImage: `url('${src}')`,
                  transform: "translate3d(0, 0, 0)",
                  willChange: isActive ? "opacity, transform" : "auto",
                  animationPlayState: isActive ? "running" : "paused"
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3. Sleek Vignette Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/50 via-slate-950/70 to-slate-950/90 pointer-events-none" />

      {/* 4. Lightweight Ambient Radial Lighting (Only on High Performance Desktop) */}
      {isEligibleForSlider && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] z-20 pointer-events-none transform-gpu" />
      )}

      {/* 5. Navigation Indicator Dots (Desktop Only) */}
      {isEligibleForSlider && (
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
