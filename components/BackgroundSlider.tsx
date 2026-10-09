"use client";

import { useState, useEffect } from "react";

const BG_IMAGES = [
  "/images/bg1.jpg",
  "/images/bg2.jpg",
  "/images/bg3.jpg",
  "/images/bg4.jpg",
  "/images/bg5.jpg"
];

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 4000); // Strict 4-second interval

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 5 Layered 3D Background Images with Ken Burns Zoom & Smooth Crossfade */}
      {BG_IMAGES.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 animate-kenburns z-10" : "opacity-0 z-0"
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        );
      })}

      {/* Crystal Clear Balanced Gradient Overlay for Razor-Sharp Text Readability */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/45 via-slate-950/60 to-slate-950/85" />

      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] z-20" />

      {/* Slide Navigation Indicator Dots (Bottom Left) */}
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
    </div>
  );
}
