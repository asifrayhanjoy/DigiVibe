"use client";

import { useState } from "react";
import {
  Shield,
  ShieldAlert,
  Lock,
  KeyRound,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Zap,
  Users,
  Wifi,
  Sparkles,
  PlayCircle,
  Tv,
  Video,
  Send,
  Cloud,
  Globe,
  Server,
  Radio,
  ThumbsUp,
  TrendingUp,
  Play,
  Mail,
  GraduationCap,
  Star,
  Check,
  ShoppingCart,
  ArrowRight,
  Heart,
  Cpu
} from "lucide-react";
import { ServiceItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const ICON_MAP: Record<string, any> = {
  Shield,
  ShieldAlert,
  Lock,
  KeyRound,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Zap,
  Users,
  Wifi,
  Sparkles,
  PlayCircle,
  Tv,
  Video,
  Send,
  Cloud,
  Globe,
  Server,
  Radio,
  ThumbsUp,
  TrendingUp,
  Play,
  Mail,
  GraduationCap,
  Cpu
};

// High-resolution SVGs for Brand Logos
function BrandLogoSvg({ logoType, title }: { logoType?: string; title: string }) {
  const type = (logoType || title).toLowerCase();

  if (type.includes("youtube")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 70" fill="none">
        <path d="M96.3 10.7c-1.1-4.2-4.4-7.5-8.6-8.6C80.1 0 49.2 0 49.2 0S18.3 0 10.7 2.1c-4.2 1.1-7.5 4.4-8.6 8.6C0 18.3 0 34.3 0 34.3s0 16 2.1 23.6c1.1 4.2 4.4 7.5 8.6 8.6 7.6 2.1 38.5 2.1 38.5 2.1s30.9 0 38.5-2.1c4.2-1.1 7.5-4.4 8.6-8.6 2.1-7.6 2.1-23.6 2.1-23.6s0-16-2.1-23.6z" fill="#FF0000"/>
        <path d="M39.3 49L64.8 34.3 39.3 19.6z" fill="#FFFFFF"/>
      </svg>
    );
  }

  if (type.includes("gemini") || type.includes("google")) {
    return (
      <svg className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-lg" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="geminiGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2196F3" />
            <stop offset="50%" stopColor="#4285F4" />
            <stop offset="100%" stopColor="#9C27B0" />
          </linearGradient>
        </defs>
        <path d="M50 0 C50 27.6 27.6 50 0 50 C27.6 50 50 72.4 50 100 C50 72.4 72.4 50 100 50 C72.4 50 50 27.6 50 0 Z" fill="url(#geminiGradCard)" />
      </svg>
    );
  }

  if (type.includes("chatgpt")) {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <path d="M49 10c-21.5 0-39 17.5-39 39 0 7.5 2.1 14.5 5.8 20.5L10 90l21-5.5C36.8 88 42.7 90 49 90c21.5 0 39-17.5 39-39S70.5 10 49 10z" fill="#10A37F" />
        <circle cx="36" cy="48" r="4" fill="#FFF" />
        <circle cx="49" cy="48" r="4" fill="#FFF" />
        <circle cx="62" cy="48" r="4" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("capcut")) {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#000" />
        <path d="M28 36L48 50L28 64M72 36L52 50L72 64" stroke="#00F0FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="50" r="10" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("netflix")) {
    return (
      <svg className="w-16 h-24 sm:w-20 sm:h-28 drop-shadow-md" viewBox="0 0 60 90" fill="none">
        <path d="M0 0H16V90H0V0Z" fill="#E50914"/>
        <path d="M44 0H60V90H44V0Z" fill="#E50914"/>
        <path d="M0 0L44 90H60L16 0H0Z" fill="#B81D24"/>
      </svg>
    );
  }

  if (type.includes("instagram")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="25%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#F56040" />
            <stop offset="75%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#E1306C" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#instaGrad)" />
        <rect x="22" y="22" width="56" height="56" rx="16" stroke="#FFF" strokeWidth="6" fill="none" />
        <circle cx="50" cy="50" r="14" stroke="#FFF" strokeWidth="6" fill="none" />
        <circle cx="67" cy="33" r="4.5" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("facebook") || type.includes("fb")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#1877F2" />
        <path d="M58 52L60 38H46V29C46 25.5 48 22 53.5 22H60V9.5C60 9.5 54.5 8.5 49.5 8.5C39 8.5 32 15 32 26.5V38H20V52H32V88C34.8 88.5 37.6 88.8 40.5 88.8C42.4 88.8 44.2 88.6 46 88.3V52H58Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("tiktok")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#010101" />
        <path d="M68 38.5C62.8 38.5 58 35.8 55.2 31.7V61.5C55.2 72.8 46 82 34.7 82C23.4 82 14.2 72.8 14.2 61.5C14.2 50.2 23.4 41 34.7 41C36.2 41 37.7 41.2 39.1 41.5V52.8C37.7 52.3 36.2 52 34.7 52C29.5 52 25.2 56.3 25.2 61.5C25.2 66.7 29.5 71 34.7 71C39.9 71 44.2 66.7 44.2 61.5V18H55.2C55.2 24.6 60.6 30 67.2 30V38.5H68Z" fill="#FFF" />
        <path d="M67.2 30C63 30 59.2 27.8 57 24.3V61.5C57 73.8 47 83.8 34.7 83.8C24 83.8 15 76 13 65.5C14.5 76.5 24 85 35.7 85C48 85 58 75 58 62.7V25C62.2 28.5 67.5 30.5 73.2 30.5V30H67.2Z" fill="#25F4EE" opacity="0.8" />
        <path d="M65.2 32C61 32 57.2 29.8 55 26.3V63.5C55 75.8 45 85.8 32.7 85.8C22 85.8 13 78 11 67.5C12.5 78.5 22 87 33.7 87C46 87 56 77 56 64.7V27C60.2 30.5 65.5 32.5 71.2 32.5V32H65.2Z" fill="#FE2C55" opacity="0.8" />
      </svg>
    );
  }

  if (type.includes("telegram-chn") || type.includes("chn")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="46" fill="#DE2910" />
        <polygon points="28,26 31,34 39,34 32,39 35,47 28,42 21,47 24,39 17,34 25,34" fill="#FFDE00" />
        <polygon points="44,20 46,23 49,23 47,25 48,28 44,26 41,28 42,25 40,23 43,23" fill="#FFDE00" />
        <polygon points="50,29 52,32 55,32 53,34 54,37 50,35 47,37 48,34 46,32 49,32" fill="#FFDE00" />
        <polygon points="50,42 52,45 55,45 53,47 54,50 50,48 47,50 48,47 46,45 49,45" fill="#FFDE00" />
        <polygon points="44,51 46,54 49,54 47,56 48,59 44,57 41,59 42,56 40,54 43,54" fill="#FFDE00" />
      </svg>
    );
  }

  if (type.includes("telegram-usa") || type.includes("usa")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <clipPath id="circleClipUsa">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
        <g clipPath="url(#circleClipUsa)">
          <rect width="100" height="100" fill="#FFF" />
          <path d="M0 0h100v7.7H0zm0 15.4h100v7.7H0zm0 15.4h100v7.7H0zm0 15.4h100v7.7H0zm0 15.4h100v7.7H0zm0 15.4h100v7.7H0zm0 15.4h100v7.7H0z" fill="#B22234" />
          <rect width="45" height="53.8" fill="#3C3B6E" />
          <circle cx="22" cy="27" r="18" fill="#229ED9" />
          <path d="M12 26.5L30 19L26 36L21 31L18 34L19 29.5L29 20.5L16 28L12 26.5Z" fill="#FFF" />
        </g>
      </svg>
    );
  }

  if (type.includes("telegram")) {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#229ED9"/>
        <path d="M22 49L75 28L63 76L48 62L39 70L41 57L69 32L32 54L22 49Z" fill="#FFF"/>
      </svg>
    );
  }

  if (type.includes("textnow") || type.includes("text now")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#6B21A8" />
        <path d="M28 42C28 35 34 30 42 30H58C66 30 72 35 72 42V54C72 61 66 66 58 66H42L32 74V64C29 62 28 58 28 54V42Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("hotmail") || type.includes("outlook") || type.includes("mail")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0078D4" />
        <path d="M20 30L50 52L80 30V70H20V30Z" fill="#FFF" opacity="0.9" />
        <path d="M20 30H80L50 52L20 30Z" fill="#E0E6ED" />
      </svg>
    );
  }

  if (type.includes("android")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#3DDC84" />
        <path d="M30 40C30 28 38 20 50 20C62 20 70 28 70 40H30Z" fill="#FFF" />
        <circle cx="42" cy="30" r="3" fill="#3DDC84" />
        <circle cx="58" cy="30" r="3" fill="#3DDC84" />
        <line x1="38" y1="12" x2="43" y2="20" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="62" y1="12" x2="57" y2="20" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("cpanel")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FF6C2C" />
        <path d="M25 50C25 36.2 36.2 25 50 25C59.5 25 67.8 30.3 71.8 38H60.5C57.8 34.4 54.1 32 50 32C40.1 32 32 40.1 32 50C32 59.9 40.1 68 50 68C54.1 68 57.8 65.6 60.5 62H71.8C67.8 69.7 59.5 75 50 75C36.2 75 25 63.8 25 50Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("vps") || type.includes("server") || type.includes("hosting")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" stroke="#334155" strokeWidth="4" />
        <rect x="18" y="22" width="64" height="22" rx="6" fill="#1E293B" stroke="#00F0FF" strokeWidth="2" />
        <circle cx="28" cy="33" r="3" fill="#00F0FF" />
        <circle cx="36" cy="33" r="3" fill="#10B981" />
        <rect x="52" y="31" width="22" height="4" rx="2" fill="#475569" />
        <rect x="18" y="56" width="64" height="22" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="28" cy="67" r="3" fill="#38BDF8" />
        <circle cx="36" cy="67" r="3" fill="#10B981" />
        <rect x="52" y="65" width="22" height="4" rx="2" fill="#475569" />
      </svg>
    );
  }

  if (type.includes("wordpress")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#21759B" />
        <circle cx="50" cy="50" r="44" stroke="#FFF" strokeWidth="3" fill="none" />
        <path d="M19 50C19 63.2 27.6 74.4 39.7 78.4L24.5 36.8C20.9 40.8 19 45.2 19 50Z" fill="#FFF" />
        <path d="M72.2 46.2C72.2 40.8 70.3 37.1 68.4 33.8C65.9 29.8 63.6 26.3 63.6 22.3C63.6 21.6 63.8 20.8 64.2 20.1C59.9 17.5 55.1 16 50 16C40.2 16 31.4 20.5 25.6 27.5L42.2 73.1C42.4 73.1 42.6 72.3 42.6 72.3L54.4 39.8L49.9 50H72.2Z" fill="#FFF" opacity="0.9" />
      </svg>
    );
  }

  if (type.includes("nid") || type.includes("tracking")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0284C7" />
        <rect x="18" y="24" width="64" height="52" rx="8" fill="#0369A1" stroke="#38BDF8" strokeWidth="3" />
        <circle cx="36" cy="45" r="10" fill="#E0F2FE" />
        <path d="M26 64c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="52" y="38" width="22" height="4" rx="2" fill="#BAE6FD" />
        <rect x="52" y="46" width="16" height="4" rx="2" fill="#BAE6FD" />
        <rect x="52" y="54" width="20" height="4" rx="2" fill="#BAE6FD" />
        <circle cx="75" cy="28" r="8" fill="#EF4444" />
        <circle cx="75" cy="28" r="3" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("711") || type.includes("71proxy")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FFF" />
        <path d="M22 22H78L62 38H38L22 22Z" fill="#0052FF" />
        <path d="M48 38L32 78H18L34 38H48Z" fill="#0052FF" />
        <path d="M68 38L52 78H38L54 38H68Z" fill="#0052FF" />
        <text x="50" y="92" textAnchor="middle" fill="#0A192F" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">71Proxy</text>
      </svg>
    );
  }

  if (type.includes("abc")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FFF" />
        <path d="M18 45L32 22L42 45H33L30 38H21L19 45H18ZM25 27L23 32H27L25 27Z" fill="#2563EB" />
        <path d="M44 22H56C61 22 64 25 64 28C64 31 62 32.5 59 33C63 33.5 65 35.5 65 39C65 43 61 45 55 45H44V22ZM52 27V31H55C57 31 58 30 58 29C58 28 57 27 55 27H52ZM52 36V40H56C58 40 59 39 59 38C59 37 58 36 56 36H52Z" fill="#2563EB" />
        <path d="M78 26C72 22 66 28 66 33.5C66 39 72 45 78 41L76 37C72 40 70 36 70 33.5C70 31 72 27 76 29.5L78 26Z" fill="#2563EB" />
        <text x="50" y="72" textAnchor="middle" fill="#1E3A8A" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">PROXY</text>
      </svg>
    );
  }

  if (type.includes("flame")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FFF" />
        <rect x="15" y="15" width="70" height="70" rx="22" fill="url(#flameGradCard)" />
        <defs>
          <linearGradient id="flameGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#FF2E55" />
          </linearGradient>
        </defs>
        <path d="M50 32C50 32 58 42 58 50C58 56.6 54.4 60 50 60C45.6 60 42 56.6 42 50C42 44 50 32 50 32Z" fill="#FFF" />
        <path d="M48 24C48 24 64 36 64 50C64 60 57.7 66 50 66C42.3 66 36 60 36 50C36 40 44 32 48 24Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("h143")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#F8FAFC" />
        <circle cx="50" cy="40" r="24" stroke="#1E293B" strokeWidth="3" />
        <circle cx="50" cy="40" r="18" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M42 28L58 52M58 28L42 52" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <text x="50" y="78" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">H143 PROXY</text>
      </svg>
    );
  }

  if (type.includes("9 proxy") || type.includes("9proxy") || type.includes("9")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#090d16" />
        <path d="M50 20C36.2 20 25 31.2 25 45C25 58.8 36.2 70 50 70C63.8 70 75 58.8 75 45V20H50ZM50 55C44.5 55 40 50.5 40 45C40 39.5 44.5 35 50 35C55.5 35 60 39.5 60 45C60 50.5 55.5 55 50 55Z" fill="#FFF" />
        <path d="M50 12 C72 12 88 28 88 50 C88 72 72 88 50 88" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" />
        <text x="50" y="85" textAnchor="middle" fill="#00F0FF" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">9 PROXY</text>
      </svg>
    );
  }

  if (type.includes("cli")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <rect x="25" y="22" width="50" height="48" rx="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
        <path d="M35 38L44 46L35 54M48 54H62" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="50" y="86" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">CLI PROXY</text>
      </svg>
    );
  }

  if (type.includes("dataimpluse") || type.includes("data impulse")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <circle cx="50" cy="42" r="22" fill="#2563EB" opacity="0.2" />
        <path d="M30 46L42 34L52 52L60 40L70 52" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="70" cy="52" r="4" fill="#60A5FA" />
        <text x="50" y="84" textAnchor="middle" fill="#93C5FD" fontSize="9" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">DATAIMPULSE</text>
      </svg>
    );
  }

  if (type.includes("iprocket") || type.includes("ip rocket") || type.includes("rocket")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0B1329" />
        <path d="M50 18C50 18 65 33 65 53H35C35 33 50 18 50 18Z" fill="#F97316" />
        <path d="M42 53L35 68H45L50 58L55 68H65L58 53" fill="#EF4444" />
        <circle cx="50" cy="38" r="6" fill="#FFF" />
        <text x="50" y="85" textAnchor="middle" fill="#FB923C" fontSize="9" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">IP ROCKET</text>
      </svg>
    );
  }

  if (type.includes("loki")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#064E3B" />
        <path d="M30 28C30 28 38 16 50 16C62 16 70 28 70 28M35 38L50 62L65 38" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="38" r="8" fill="#10B981" />
        <text x="50" y="84" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">LOKI PROXY</text>
      </svg>
    );
  }

  if (type.includes("1024")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <rect x="22" y="22" width="56" height="42" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="2" />
        <text x="50" y="49" textAnchor="middle" fill="#A5B4FC" fontSize="16" fontWeight="900" fontFamily="sans-serif">1024</text>
        <text x="50" y="84" textAnchor="middle" fill="#818CF8" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">PROXY</text>
      </svg>
    );
  }

  if (type.includes("owl proxy") || type.includes("owl")) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FFF" />
        <path d="M20 30L50 80L80 30L50 50Z" fill="#3B82F6" />
        <circle cx="38" cy="42" r="7" fill="#FFF" />
        <circle cx="62" cy="42" r="7" fill="#FFF" />
        <circle cx="38" cy="42" r="3.5" fill="#1E40AF" />
        <circle cx="62" cy="42" r="3.5" fill="#1E40AF" />
      </svg>
    );
  }

  if (type.includes("proxy") || type.includes("ip")) {
    return (
      <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <circle cx="50" cy="50" r="32" stroke="#f59e0b" strokeWidth="4" />
        <path d="M20 50H80M50 18V82" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
      </svg>
    );
  }

  return null;
}

interface ServiceCardProps {
  service?: ServiceItem & { title_bn?: string; description_bn?: string; logoType?: string; usdPrice?: string; subtitle?: string };
  product?: ServiceItem & { title_bn?: string; description_bn?: string; logoType?: string; usdPrice?: string; subtitle?: string };
  onAddToCart?: (service: ServiceItem) => void;
  onBuyNow?: (service: ServiceItem) => void;
  isHighlighted?: boolean;
}

export default function ServiceCard({ service: inputService, product, onAddToCart, onBuyNow, isHighlighted }: ServiceCardProps) {
  const service = inputService || product;
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  if (!service) return null;

  const IconComponent = ICON_MAP[service.icon] || Sparkles;

  const [logoError, setLogoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const calcOriginalPrice = service.originalPrice && service.originalPrice > service.price
    ? service.originalPrice
    : Math.round(service.price * 1.2) || service.price + 10;

  const discountPercent = Math.max(0, Math.round(((calcOriginalPrice - service.price) / calcOriginalPrice) * 100));

  const displayTitle = isBn ? service.title_bn || service.title : service.title;
  
  const isSubscription = service.category?.toLowerCase() === "subscriptions";
  const isSoldOut = service.stock === "Sold Out" || service.badge === "Sold Out ❌" || service.badge === "SOLD OUT" || (service as any).inStock === false;

  const firstWord = service.title.toLowerCase().split(" ")[0].replace(/[^a-z]/g, "");
  const rawLogo = (service as any).logo || (service as any).image || `/images/vpns/${firstWord}.svg`;
  const fallbackLogo = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(service.title)}`;
  const displayLogo = logoError ? fallbackLogo : rawLogo;

  // Features list guarantee (at least 3-4 professional features tailored per category)
  const defaultCategoryFeatures: Record<string, string[]> = {
    ip: [
      "100% Clean High Anonymity Pool",
      "Instant Code / Account Delivery",
      "Socks5 & HTTP Protocol Support",
      "Full Replacement Warranty Support"
    ],
    smm: [
      "Instant Fast Order Start",
      "Non-Drop High Speed Delivery",
      "Safe for Account & Monetization",
      "Refill Guarantee Support"
    ],
    vpn: [
      "100% Full Fresh Dedicated Account",
      "High Speed Zero-Logging Servers",
      "Multi-Device Platform Support",
      "Full Replacement Warranty"
    ],
    default: [
      "100% Genuine Guaranteed Service",
      "Instant Automated Order Processing",
      "Full Replacement Warranty Support",
      "Secure Instant Delivery Mechanism"
    ]
  };

  const categoryKey = (service.category || "").toLowerCase();
  const fallbackFeatures = defaultCategoryFeatures[categoryKey] || defaultCategoryFeatures.default;
  
  const featureList = (service.features && service.features.length >= 2 ? service.features : fallbackFeatures)
    .filter((feat) => !/500 days|30 days|90d|180d|365d/i.test(feat) || /replacement|full fresh|guaranteed/i.test(feat));

  const hasSvgLogo = isSubscription || !!service.logoType || service.category?.toLowerCase() === "ip" || service.category?.toLowerCase() === "smm";

  // Clean Badge text without time/validity mention
  const rawBadge = service.badge || service.subtitle || "";
  const cleanBadge = /500 days|30 days|90d|180d|365d|validity/i.test(rawBadge)
    ? "Full Replacement Support ✅"
    : rawBadge;

  const cleanSubtitle = /500 days|30 days|90d|180d|365d|validity/i.test(service.subtitle || "")
    ? "Full Replacement Support ✅"
    : (service.subtitle || "100% Genuine Digital Service ✅");

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(service);
  };

  const handleBuy = () => {
    if (onBuyNow) onBuyNow(service);
  };

  return (
    <div
      id={`product-${service.id}`}
      className={`group relative glass-panel glass-panel-hover rounded-[28px] p-5 flex flex-col justify-between overflow-hidden border transition-all duration-500 min-h-[520px] ${
        isHighlighted
          ? "border-cyan-400 ring-4 ring-cyan-400/40 shadow-2xl shadow-cyan-500/30 scale-[1.02] bg-slate-900/90"
          : "border-slate-800/80 hover:border-cyan-500/40"
      }`}
    >
      {/* Radial Hover Glow Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />

      <div>
        {/* 1. TOP BANNER IMAGE / LOGO CONTAINER (Strictly matching image_a1c63a.png) */}
        <div className="relative w-full h-44 sm:h-48 rounded-2xl bg-slate-900/80 border border-slate-800/80 p-2 mb-4 group-hover:border-cyan-500/30 transition-all">
          <div className="w-full h-full rounded-xl bg-white p-3 flex items-center justify-center shadow-inner relative overflow-hidden">
            {hasSvgLogo ? (
              <BrandLogoSvg logoType={service.logoType} title={service.title} />
            ) : !imgError ? (
              <img
                src={displayLogo}
                alt={service.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => {
                  if (!logoError) setLogoError(true);
                  else setImgError(true);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-cyan-400">
                <IconComponent className="w-12 h-12 stroke-[1.8]" />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5">{service.category}</span>
              </div>
            )}

            {/* Heart Favorite Button (Bottom Left of Image Container) */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
              className="absolute bottom-2.5 left-2.5 w-7 h-7 rounded-full bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center backdrop-blur-md z-10 border border-slate-800"
              aria-label="Add to Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* FLOATING TOP-RIGHT BADGE CHIP (Strictly matching image_a1c63a.png) */}
            {!isSoldOut ? (
              <span className="absolute top-2.5 right-2.5 px-3 py-1 text-xs font-extrabold bg-[#0f172a]/90 text-cyan-400 border border-cyan-500/40 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 z-10 font-sans">
                ⚡ {cleanBadge}
              </span>
            ) : (
              <span className="absolute top-2.5 right-2.5 px-3 py-1 text-xs font-extrabold bg-rose-500/90 text-white rounded-full uppercase backdrop-blur-md shadow-md z-10 font-sans">
                SOLD OUT
              </span>
            )}
          </div>
        </div>

        {/* 2. CATEGORY ICON ROW & TITLE */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-cyan-950/90 border border-cyan-500/40 p-1.5 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
            <IconComponent className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-slate-300 border border-slate-700/80 rounded-md">
            {(service.category || "Subscriptions").toUpperCase()}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-cyan-400 group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 tracking-tight">
          {displayTitle}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
          {service.subtitle || cleanSubtitle}
        </p>

        {/* 3. RATING & STOCK STATUS ROW (Matching image_a1c63a.png) */}
        <div className="my-2.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-white text-sm">{service.rating || 4.9}</span>
            <span className="text-slate-400">({service.reviews || 120})</span>
          </div>

          {!isSoldOut ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isBn ? "স্টক আছে" : "In Stock"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span>{isBn ? "স্টক শেষ" : "Stock Out"}</span>
            </div>
          )}
        </div>

        {/* 4. CHECKLIST FEATURES SECTION (Matching image_a1c63a.png) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 my-3 flex-1">
          {featureList.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
              <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/30">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="leading-relaxed">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BOTTOM PRICING & ACTION BUTTONS SECTION (Strictly matching image_a1c63a.png) */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              ৳{service.price}
            </span>
            {calcOriginalPrice > service.price && (
              <span className="text-xs sm:text-sm text-slate-500 line-through font-normal font-sans">
                ৳{calcOriginalPrice}
              </span>
            )}
            {service.unit && (
              <span className="text-xs text-slate-400 font-semibold">
                /{service.unit.replace(/^\//, "")}
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="px-2.5 py-1 text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl uppercase tracking-wider font-sans">
              -{discountPercent}% {isBn ? "ছাড়" : "OFF"}
            </span>
          )}
        </div>

        {/* CTA BUTTONS ROW (Matching image_a1c63a.png) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700/80 hover:border-cyan-500/50 transition-all active:scale-95 shadow-inner"
          >
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
            <span>{isBn ? "কার্ট যোগ করুন" : "Add Cart"}</span>
          </button>

          {!isSoldOut ? (
            <button
              onClick={handleBuy}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>{isBn ? "এখনই কিনুন" : "Buy Now"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 text-rose-400 font-bold text-xs sm:text-sm rounded-xl border border-rose-500/30 cursor-not-allowed"
            >
              <span>{isBn ? "স্টক শেষ" : "Stock Out"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



