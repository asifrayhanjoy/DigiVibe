"use client";

import { useState, memo, useMemo, useCallback } from "react";
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
  Cpu,
  Pencil,
  Trash2,
  Pin,
  Clock,
  Headphones,
  Laptop,
  Network,
  Layout,
  Code2,
  QrCode,
  Receipt,
  FileSignature,
  FileText,
  Presentation,
  Wrench,
  CreditCard,
  Palette,
  Mic,
  Film,
  Clipboard,
  Languages,
  Layers,
  CloudSun,
  Compass,
  Gift
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getCanonicalCategory, getCategoryQueryParam } from "@/lib/categories";

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
  Cpu,
  Laptop,
  Network,
  Layout,
  Code2,
  QrCode,
  Receipt,
  FileSignature,
  FileText,
  Presentation,
  Wrench,
  CreditCard,
  Palette,
  Mic,
  Film,
  Clock,
  Clipboard,
  Languages,
  Layers,
  CloudSun,
  Compass,
  Gift
};

// High-resolution SVGs for Brand Logos
export const BrandLogoSvg = memo(function BrandLogoSvg({ logoType, title }: { logoType?: string; title: string }) {
  const type = (logoType || title).toLowerCase();

  if (type.includes("lovable")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="lovableCardGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FF385C" />
            <stop offset="35%" stopColor="#FF5252" />
            <stop offset="65%" stopColor="#DE3FA8" />
            <stop offset="100%" stopColor="#7952F5" />
          </linearGradient>
        </defs>
        <path d="M100,168 C62,136 28,106 28,68 C28,40 48,22 74,22 C89,22 100,31 100,31 C100,31 111,22 126,22 C152,22 172,40 172,68 C172,106 138,136 100,168 Z" fill="url(#lovableCardGrad)" />
      </svg>
    );
  }

  if (type.includes("prime") || type.includes("amazon")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" rx="36" fill="#00A8E1" />
        <g fill="#FFFFFF">
          <path d="M46,82 L46,120 L53,120 L53,104 C55.5,106.5 59,107.5 63,107.5 C71,107.5 77,101 77,93 C77,84.5 71,78.5 63,78.5 C59,78.5 55.5,79.5 53,82 L53,82 L53,82 L53,79.5 L46,79.5 L46,82 Z M61,85 C65.5,85 69,88.5 69,93 C69,97.5 65.5,101 61,101 C56.5,101 53,97.5 53,93 C53,88.5 56.5,85 61,85 Z" />
          <path d="M80,79.5 L80,107 L87,107 L87,91.5 C88.5,88.5 92.5,86.5 96.5,87 L96.5,79.5 C92.5,79.5 88.5,81.5 87,85 L87,79.5 L80,79.5 Z" />
          <path d="M101,72 C103.5,72 105.5,70 105.5,67.5 C105.5,65 103.5,63 101,63 C98.5,63 96.5,65 96.5,67.5 C96.5,70 98.5,72 101,72 Z M97.5,79.5 L97.5,107 L104.5,107 L104.5,79.5 L97.5,79.5 Z" />
          <path d="M110,79.5 L110,107 L117,107 L117,92 C118,87.5 121.5,85.5 125,85.5 C128.5,85.5 131,87.5 131,92 L131,107 L138,107 L138,92 C139,87.5 142.5,85.5 146,85.5 C149.5,85.5 152,87.5 152,92 L152,107 L159,107 L159,90 C159,82.5 154.5,78.5 148,78.5 C143,78.5 139.5,81 137.5,84.5 C135.5,81 132,78.5 127,78.5 C122.5,78.5 119,81 117,84.5 L117,79.5 L110,79.5 Z" />
          <path d="M174,93 C174,84.5 168.5,78.5 160.5,78.5 C152.5,78.5 146.5,85 146.5,93.5 C146.5,102 152.5,107.5 161,107.5 C166.5,107.5 171,105 173.5,100.5 L168,97.5 C166.5,99.5 164,101 161,101 C157.5,101 154.5,98.5 154,95 L174,95 C174,94.5 174,93.5 174,93 Z M154,90 C154.5,87 157,84.5 160.5,84.5 C164,84.5 166.5,87 167,90 L154,90 Z" />
        </g>
        <g fill="#FFFFFF" opacity="0.95">
          <path d="M56,118 L62,136 L68,118 L74,118 L65.5,142 L58.5,142 L50,118 L56,118 Z" />
          <path d="M78,113 C79.7,113 81,111.7 81,110 C81,108.3 79.7,107 78,107 C76.3,107 75,108.3 75,110 C75,111.7 76.3,113 78,113 Z M75.5,118 L80.5,118 L80.5,142 L75.5,142 L75.5,118 Z" />
          <path d="M96,111 L96,119 C94.5,117.5 92,117 89.5,117 C83.5,117 79,122.5 79,130 C79,137.5 83.5,143 89.5,143 C92,143 94.5,142 96,140.5 L96,142 L101,142 L101,111 L96,111 Z M90.5,122 C94,122 96.5,125 96.5,130 C96.5,135 94,138 90.5,138 C87,138 84.5,135 84.5,130 C84.5,125 87,122 90.5,122 Z" />
          <path d="M117,130 C117,122.5 112.5,117 106,117 C99.5,117 95,122.5 95,130 C95,137.5 100,143 106.5,143 C111,143 114.5,141 116.5,137.5 L112.5,135 C111,137 109,138.5 106.5,138.5 C103.5,138.5 101,136.5 100.5,132.5 L117,132.5 C117,131.5 117,130.5 117,130 Z M100.5,127.5 C101,124.5 103,122 106,122 C109,122 111,124.5 111.5,127.5 L100.5,127.5 Z" />
          <path d="M119,130 C119,122.5 124,117 130.5,117 C137,117 142,122.5 142,130 C142,137.5 137,143 130.5,143 C124,143 119,137.5 119,130 Z M124.5,130 C124.5,135.5 127,138.5 130.5,138.5 C134,138.5 136.5,135.5 136.5,130 C136.5,124.5 134,121.5 130.5,121.5 C127,121.5 124.5,124.5 124.5,130 Z" />
        </g>
        <path d="M48,154 C82,176 126,172 154,146 C155,145 153.5,144 152.5,145 C126.5,168 85,171 50,151 C48.5,150 47,152.5 48,154 Z" fill="#FFFFFF" />
        <path d="M152,143 L159,145 C160,145.5 159.5,147 158.5,147.5 L151.5,150 C150.5,150.5 150,149.5 150.5,148.5 L152,143 Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type.includes("muse")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <path d="M42,142 C38,142 34,138 36,132 C42,108 55,68 68,54 C74,48 81,46 87,49 C93,52 96,59 95,68 C98,60 104,54 112,54 C120,54 126,60 125,72 C132,60 142,54 153,55 C166,57 172,69 167,88 C160,112 153,136 150,142 C148,146 142,148 137,145 C132,142 131,135 133,128 C137,114 145,86 145,77 C145,73 142,71 138,71 C130,71 123,83 118,102 C113,121 110,138 107,143 C105,147 99,149 94,146 C89,143 88,136 90,129 C95,112 103,84 103,75 C103,71 100,69 96,69 C88,69 78,85 71,114 C67,130 63,142 56,142 C51,142 46,142 42,142 Z" fill="#1A73E8" />
      </svg>
    );
  }

  if (type.includes("duolingo")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <rect width="200" height="200" rx="36" fill="#58CC02" />
        <circle cx="68" cy="98" r="38" fill="#FFFFFF" />
        <circle cx="132" cy="98" r="38" fill="#FFFFFF" />
        <circle cx="68" cy="98" r="23" fill="#4B4B4B" />
        <circle cx="132" cy="98" r="23" fill="#4B4B4B" />
        <circle cx="62" cy="90" r="8" fill="#FFFFFF" />
        <circle cx="126" cy="90" r="8" fill="#FFFFFF" />
        <path d="M84,102 C84,102 91,126 100,126 C109,126 116,102 116,102 Z" fill="#FF9600" />
        <path d="M88,102 C88,102 94,116 100,116 C106,116 112,102 112,102 Z" fill="#FFC800" />
      </svg>
    );
  }

  if (type.includes("androidstudio") || type.includes("android studio")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <path d="M100,10 C108,10 114,16 122,18 C130,20 138,18 145,23 C152,28 155,36 161,42 C167,48 175,51 179,59 C183,67 180,75 182,84 C184,93 190,99 190,108 C190,117 184,123 182,132 C180,141 183,149 179,157 C175,165 167,168 161,174 C155,180 152,188 145,193 C138,198 130,196 122,198 C114,200 108,206 100,206 C92,206 86,200 78,198 C70,196 62,198 55,193 C48,188 45,180 39,174 C33,168 25,165 21,157 C17,149 20,141 18,132 C16,123 10,117 10,108 C10,99 16,93 18,84 C20,75 17,67 21,59 C25,51 33,48 39,42 C45,36 48,28 55,23 C62,18 70,20 78,18 C86,16 92,10 100,10 Z" fill="#FFFFFF" transform="scale(0.9) translate(11, 11)" />
        <g transform="translate(122, 58) rotate(15)">
          <path d="M6,22 C6,10 16,0 28,0 C40,0 50,10 50,22 Z" fill="#3DDC84" />
          <circle cx="18" cy="12" r="3" fill="#FFFFFF" />
          <circle cx="38" cy="12" r="3" fill="#FFFFFF" />
          <line x1="16" y1="2" x2="8" y2="-8" stroke="#3DDC84" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="2" x2="48" y2="-8" stroke="#3DDC84" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="46" r="14" fill="#0079D3" />
        <circle cx="100" cy="46" r="8" fill="#FFFFFF" />
        <path d="M92,54 C82,80 56,120 46,146 C44,151 47,156 52,156 C56,156 59,153 61,148 C72,122 96,86 102,60 Z" fill="#1976D2" />
        <path d="M108,54 C118,80 144,120 154,146 C156,151 153,156 148,156 C144,156 141,153 139,148 C128,122 104,86 98,60 Z" fill="#2196F3" />
        <path d="M68,110 C86,122 114,122 132,110" stroke="#42A5F5" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (type.includes("youtube")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 70" fill="none">
        <path d="M96.3 10.7c-1.1-4.2-4.4-7.5-8.6-8.6C80.1 0 49.2 0 49.2 0S18.3 0 10.7 2.1c-4.2 1.1-7.5 4.4-8.6 8.6C0 18.3 0 34.3 0 34.3s0 16 2.1 23.6c1.1 4.2 4.4 7.5 8.6 8.6 7.6 2.1 38.5 2.1 38.5 2.1s30.9 0 38.5-2.1c4.2-1.1 7.5-4.4 8.6-8.6 2.1-7.6 2.1-23.6 2.1-23.6s0-16-2.1-23.6z" fill="#FF0000"/>
        <path d="M39.3 49L64.8 34.3 39.3 19.6z" fill="#FFFFFF"/>
      </svg>
    );
  }

  if (type.includes("gemini") || type.includes("google")) {
    return (
      <svg className="w-16 h-16 sm:w-18 sm:h-18 max-h-[85%] max-w-[85%] drop-shadow-lg" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <path d="M49 10c-21.5 0-39 17.5-39 39 0 7.5 2.1 14.5 5.8 20.5L10 90l21-5.5C36.8 88 42.7 90 49 90c21.5 0 39-17.5 39-39S70.5 10 49 10z" fill="#10A37F" />
        <circle cx="36" cy="48" r="4" fill="#FFF" />
        <circle cx="49" cy="48" r="4" fill="#FFF" />
        <circle cx="62" cy="48" r="4" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("capcut")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#000" />
        <path d="M28 36L48 50L28 64M72 36L52 50L72 64" stroke="#00F0FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="50" r="10" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("netflix")) {
    return (
      <svg className="w-11 h-14 sm:w-13 sm:h-18 max-h-[85%] drop-shadow-md" viewBox="0 0 60 90" fill="none">
        <path d="M0 0H16V90H0V0Z" fill="#E50914"/>
        <path d="M44 0H60V90H44V0Z" fill="#E50914"/>
        <path d="M0 0L44 90H60L16 0H0Z" fill="#B81D24"/>
      </svg>
    );
  }

  if (type.includes("instagram")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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

  if (type.includes("pinterest")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#E60023" />
        <path d="M50 16C31.2 16 16 31.2 16 50C16 64.5 25.1 76.9 38 81.9C37.7 79.2 37.5 75 38.2 72.1L42.5 53.9C42.5 53.9 41.4 51.7 41.4 48.4C41.4 43.2 44.4 39.3 48.2 39.3C51.4 39.3 53 41.7 53 44.5C53 47.7 51 52.4 49.8 57.2C48.9 61 51.7 64.1 55.4 64.1C62.1 64.1 67.2 57 67.2 46.8C67.2 37.8 60.7 31.5 50 31.5C37.6 31.5 30.4 40.8 30.4 50.4C30.4 54.1 31.8 58.1 33.6 60.3C34 60.8 34.1 61.3 34 61.8L32.7 67.1C32.5 67.9 31.9 68.2 31.1 67.8C25.9 65.4 22.7 57.8 22.7 50.1C22.7 34.5 34 20.3 50.6 20.3C64 20.3 74.4 29.8 74.4 46.2C74.4 59.5 66 70.1 54.4 70.1C50.5 70.1 46.8 68 45.6 65.6L43.2 74.8C42.3 78.3 39.8 83.2 38.3 85.7C42 86.9 46 87.5 50 87.5C70.7 87.5 87.5 70.7 87.5 50C87.5 29.3 70.7 12.5 50 12.5Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("twitter") || type.includes("tweet") || type.includes("x.com")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#000000" />
        <path d="M72 24H82.5L59.5 50.3L86.5 86H65.3L48.7 64.3L29.7 86H19.2L43.8 57.8L18 24H39.7L54.7 43.8L72 24ZM68.3 79.7H74.1L36.5 30H30.3L68.3 79.7Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type.includes("twitch")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#9146FF" />
        <path d="M22 18L16 34V82H34V94L46 82H58L82 58V18H22ZM76 54L64 66H48L38 76V66H28V24H76V54Z" fill="#FFFFFF" />
        <rect x="58" y="34" width="8" height="18" fill="#9146FF" />
        <rect x="42" y="34" width="8" height="18" fill="#9146FF" />
      </svg>
    );
  }

  if (type.includes("whatsapp") || type.includes("wa")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#25D366" />
        <path d="M50 18C32.3 18 18 32.3 18 50C18 56.1 19.7 61.8 22.7 66.7L19 81L33.7 77.3C38.4 80 44 82 50 82C67.7 82 82 67.7 82 50C82 32.3 67.7 18 50 18ZM66.5 61.2C65.8 63.2 62.8 65 60.5 65.5C58.8 65.8 56.6 66.1 49.3 63C40 59.2 34 49.7 33.5 49C33 48.3 29.8 44 29.8 39.5C29.8 35 32.1 32.8 33 31.8C33.7 31 34.8 30.6 35.8 30.6C36.4 30.6 37 30.6 37.5 30.7C38.6 30.7 39.2 30.9 39.9 32.6C40.8 34.7 43 40.1 43.3 40.7C43.6 41.3 43.8 42.1 43.4 42.9C43 43.7 42.6 44.3 42 45C41.4 45.7 40.7 46.5 41.3 47.5C41.9 48.5 44 52 47.1 54.8C51.1 58.4 54.3 59.6 55.4 60.1C56.3 60.5 57.2 60.4 57.8 59.7C58.6 58.8 59.6 57.4 60.6 56C61.3 55 62.2 54.9 63.1 55.2C64 55.5 68.8 57.9 69.8 58.4C70.8 58.9 71.5 59.2 71.7 59.7C71.9 60.2 71.9 61.2 66.5 61.2Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("spotify")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#1DB954" />
        <path d="M71 67.5C70 69 68 69.5 66.5 68.5C55 61.5 40.7 60 24 63.8C22.3 64.2 20.7 63.1 20.3 61.5C19.9 59.8 21 58.2 22.6 57.8C41 53.6 56.8 55.3 69.8 63.3C71.2 64.2 71.6 66.2 71 67.5ZM77.2 54.8C75.9 56.7 73.3 57.3 71.4 56.1C58.3 48.1 38.5 45.8 23.1 50.4C20.9 51.1 18.5 49.9 17.8 47.7C17.1 45.5 18.3 43.1 20.5 42.4C38.1 37.1 60 39.6 74.9 48.8C76.8 50 77.4 52.8 77.2 54.8ZM77.8 41.7C62.1 32.4 36.1 31.5 21 36.1C18.4 36.9 15.6 35.4 14.8 32.8C14 30.2 15.5 27.4 18.1 26.6C35.5 21.3 64.3 22.3 82.5 33.1C84.9 34.5 85.7 37.6 84.3 40C82.9 42.4 79.8 43.1 77.8 41.7Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("kawai") || type.includes("kwai")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#FF5E00" />
        <path d="M50 20C33.4 20 20 33.4 20 50C20 66.6 33.4 80 50 80C66.6 80 80 66.6 80 50C80 33.4 66.6 20 50 20ZM42 62L32 52L37.6 46.4L42 50.8L62.4 30.4L68 36L42 62Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type.includes("facebook") || type.includes("fb")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#1877F2" />
        <path d="M58 52L60 38H46V29C46 25.5 48 22 53.5 22H60V9.5C60 9.5 54.5 8.5 49.5 8.5C39 8.5 32 15 32 26.5V38H20V52H32V88C34.8 88.5 37.6 88.8 40.5 88.8C42.4 88.8 44.2 88.6 46 88.3V52H58Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("tiktok")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="24" fill="#010101" />
        <path d="M68 38.5C62.8 38.5 58 35.8 55.2 31.7V61.5C55.2 72.8 46 82 34.7 82C23.4 82 14.2 72.8 14.2 61.5C14.2 50.2 23.4 41 34.7 41C36.2 41 37.7 41.2 39.1 41.5V52.8C37.7 52.3 36.2 52 34.7 52C29.5 52 25.2 56.3 25.2 61.5C25.2 66.7 29.5 71 34.7 71C39.9 71 44.2 66.7 44.2 61.5V18H55.2C55.2 24.6 60.6 30 67.2 30V38.5H68Z" fill="#FFF" />
        <path d="M67.2 30C63 30 59.2 27.8 57 24.3V61.5C57 73.8 47 83.8 34.7 83.8C24 83.8 15 76 13 65.5C14.5 76.5 24 85 35.7 85C48 85 58 75 58 62.7V25C62.2 28.5 67.5 30.5 73.2 30.5V30H67.2Z" fill="#25F4EE" opacity="0.8" />
        <path d="M65.2 32C61 32 57.2 29.8 55 26.3V63.5C55 75.8 45 85.8 32.7 85.8C22 85.8 13 78 11 67.5C12.5 78.5 22 87 33.7 87C46 87 56 77 56 64.7V27C60.2 30.5 65.5 32.5 71.2 32.5V32H65.2Z" fill="#FE2C55" opacity="0.8" />
      </svg>
    );
  }

  if (type.includes("telegram-chn") || type.includes("chn")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="#229ED9"/>
        <path d="M22 49L75 28L63 76L48 62L39 70L41 57L69 32L32 54L22 49Z" fill="#FFF"/>
      </svg>
    );
  }

  if (type.includes("textnow") || type.includes("text now")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id="textNowGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="url(#textNowGradCard)" />
        <path d="M46,84 C46,74 54,66 66,66 L134,66 C146,66 154,74 154,84 L154,88 C154,92 150,96 144,96 L132,96 C124,96 120,90 114,88 C106,86 94,86 86,88 C80,90 76,96 68,96 L56,96 C50,96 46,92 46,88 L46,84 Z M42,104 C42,100 46,98 52,98 L148,98 C154,98 158,100 158,104 C158,124 140,140 120,140 L84,140 C76,140 68,146 64,152 C62,154 58,152 58,148 L58,138 C48,132 42,118 42,104 Z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type.includes("gmail")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="92" fill="#FFFFFF" />
        <g transform="translate(38, 48) scale(1.24)">
          <path d="M8,76 L8,24 C8,15.2 15.2,8 24,8 L32,8 L50,26 L68,8 L76,8 C84.8,8 92,15.2 92,24 L92,76 L76,76 L76,38 L50,58 L24,38 L24,76 L8,76 Z" fill="#EA4335" />
          <path d="M8,24 C8,15.2 15.2,8 24,8 L32,8 L8,28 L8,24 Z" fill="#4285F4" />
          <path d="M68,8 L76,8 C84.8,8 92,15.2 92,24 L92,28 L68,8 Z" fill="#FBBC04" />
          <path d="M8,28 L8,76 L24,76 L24,38 L8,28 Z" fill="#34A853" />
          <path d="M76,38 L76,76 L92,76 L92,28 L76,38 Z" fill="#4285F4" />
        </g>
      </svg>
    );
  }

  if (type.includes("hotmail")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#FF5E00" />
        <path d="M22 32L50 54L78 32V68H22V32Z" fill="#FFF" />
        <path d="M22 32H78L50 54L22 32Z" fill="#FFE5D9" />
      </svg>
    );
  }

  if (type.includes("outlook") || type.includes("mail")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0078D4" />
        <path d="M20 30L50 52L80 30V70H20V30Z" fill="#FFF" opacity="0.9" />
        <path d="M20 30H80L50 52L20 30Z" fill="#E0E6ED" />
      </svg>
    );
  }

  if (type.includes("android")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#FF6C2C" />
        <path d="M25 50C25 36.2 36.2 25 50 25C59.5 25 67.8 30.3 71.8 38H60.5C57.8 34.4 54.1 32 50 32C40.1 32 32 40.1 32 50C32 59.9 40.1 68 50 68C54.1 68 57.8 65.6 60.5 62H71.8C67.8 69.7 59.5 75 50 75C36.2 75 25 63.8 25 50Z" fill="#FFF" />
      </svg>
    );
  }

  if (type.includes("vps") || type.includes("server") || type.includes("hosting")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#21759B" />
        <circle cx="50" cy="50" r="44" stroke="#FFF" strokeWidth="3" fill="none" />
        <path d="M19 50C19 63.2 27.6 74.4 39.7 78.4L24.5 36.8C20.9 40.8 19 45.2 19 50Z" fill="#FFF" />
        <path d="M72.2 46.2C72.2 40.8 70.3 37.1 68.4 33.8C65.9 29.8 63.6 26.3 63.6 22.3C63.6 21.6 63.8 20.8 64.2 20.1C59.9 17.5 55.1 16 50 16C40.2 16 31.4 20.5 25.6 27.5L42.2 73.1C42.4 73.1 42.6 72.3 42.6 72.3L54.4 39.8L49.9 50H72.2Z" fill="#FFF" opacity="0.9" />
      </svg>
    );
  }

  if (type.includes("nid") || type.includes("tracking")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#090d16" />
        <path d="M50 20C36.2 20 25 31.2 25 45C25 58.8 36.2 70 50 70C63.8 70 75 58.8 75 45V20H50ZM50 55C44.5 55 40 50.5 40 45C40 39.5 44.5 35 50 35C55.5 35 60 39.5 60 45C60 50.5 55.5 55 50 55Z" fill="#FFF" />
        <path d="M50 12 C72 12 88 28 88 50 C88 72 72 88 50 88" stroke="#00F0FF" strokeWidth="6" strokeLinecap="round" />
        <text x="50" y="85" textAnchor="middle" fill="#00F0FF" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">9 PROXY</text>
      </svg>
    );
  }

  if (type.includes("cli")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <rect x="25" y="22" width="50" height="48" rx="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
        <path d="M35 38L44 46L35 54M48 54H62" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="50" y="86" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">CLI PROXY</text>
      </svg>
    );
  }

  if (type.includes("dataimpluse") || type.includes("data impulse")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#064E3B" />
        <path d="M30 28C30 28 38 16 50 16C62 16 70 28 70 28M35 38L50 62L65 38" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="38" r="8" fill="#10B981" />
        <text x="50" y="84" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">LOKI PROXY</text>
      </svg>
    );
  }

  if (type.includes("1024")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <rect x="22" y="22" width="56" height="42" rx="8" fill="#1E293B" stroke="#818CF8" strokeWidth="2" />
        <text x="50" y="49" textAnchor="middle" fill="#A5B4FC" fontSize="16" fontWeight="900" fontFamily="sans-serif">1024</text>
        <text x="50" y="84" textAnchor="middle" fill="#818CF8" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">PROXY</text>
      </svg>
    );
  }

  if (type.includes("owl proxy") || type.includes("owl")) {
    return (
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
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
      <svg className="w-14 h-14 sm:w-16 sm:h-16 max-h-[85%] max-w-[85%] drop-shadow-md" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <circle cx="50" cy="50" r="32" stroke="#f59e0b" strokeWidth="4" />
        <path d="M20 50H80M50 18V82" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
      </svg>
    );
  }

  // --- ADVANCED SERVICES MINIMALIST & CLEAN SVG LOGOS ---
  if (type.includes("extension") || type.includes("ব্রাউজার") || type.includes("টুলস")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#082f49" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.5" />
        <path d="M17 21a2 2 0 012-2h2a3 3 0 006 0h2a2 2 0 012 2v2a3 3 0 000 6v2a2 2 0 01-2 2h-2a3 3 0 00-6 0h-2a2 2 0 01-2-2v-2a3 3 0 000-6v-2z" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="27" cy="27" r="1.5" fill="#38bdf8" />
      </svg>
    );
  }

  if (type.includes("saas") || type.includes("ফুল-স্ট্যাক") || type.includes("অনলাইন সিস্টেম") || type.includes("সিস্টেম")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#0c1e3d" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
        <path d="M16 30h16a5.5 5.5 0 001.2-10.8A8 8 0 0018 20.5 5 5 0 0016 30z" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 24v5M21.5 26.5L24 29l2.5-2.5" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("api") || type.includes("এপিআই") || type.includes("লিংক") || type.includes("integration") || type.includes("কানেকশন")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#042f2e" fillOpacity="0.35" stroke="#0d9488" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="3.5" stroke="#2dd4bf" strokeWidth="2.2" />
        <circle cx="32" cy="17" r="3.5" stroke="#2dd4bf" strokeWidth="2.2" />
        <circle cx="32" cy="31" r="3.5" stroke="#2dd4bf" strokeWidth="2.2" />
        <path d="M19.5 24H25M25 24V17H28.5M25 24V31H28.5" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("performance") || type.includes("speed") || type.includes("স্পিড") || type.includes("পারফরম্যান্স")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#2d1f04" fillOpacity="0.35" stroke="#d97706" strokeWidth="1.5" />
        <path d="M26 13L16 26h8l-2 11 12-14H24l2-9z" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" fillOpacity="0.15" />
      </svg>
    );
  }

  if (type.includes("devops") || type.includes("সার্ভার") || type.includes("ক্লাউড") || type.includes("ডেভপস")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#1e1b4b" fillOpacity="0.35" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="15" y="16" width="18" height="6.5" rx="2" stroke="#818cf8" strokeWidth="2" />
        <rect x="15" y="25.5" width="18" height="6.5" rx="2" stroke="#818cf8" strokeWidth="2" />
        <circle cx="19.5" cy="19.25" r="1" fill="#818cf8" />
        <circle cx="19.5" cy="28.75" r="1" fill="#818cf8" />
      </svg>
    );
  }

  if (type.includes("school") || type.includes("coaching") || type.includes("স্কুল") || type.includes("কোচিং")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#064e3b" fillOpacity="0.3" stroke="#059669" strokeWidth="1.5" />
        <path d="M24 15L13 21l11 6 11-6-11-6z" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 23.5v7c0 3 3.5 5.5 8 5.5s8-2.5 8-5.5v-7" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 21.5v9" stroke="#a7f3d0" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("qrmenu") || type.includes("qr") || type.includes("কিউআর") || type.includes("মেনু")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#431407" fillOpacity="0.3" stroke="#ea580c" strokeWidth="1.5" />
        <rect x="15" y="15" width="7" height="7" rx="1.5" stroke="#fb923c" strokeWidth="2.2" />
        <rect x="26" y="15" width="7" height="7" rx="1.5" stroke="#fb923c" strokeWidth="2.2" />
        <rect x="15" y="26" width="7" height="7" rx="1.5" stroke="#fb923c" strokeWidth="2.2" />
        <circle cx="29.5" cy="29.5" r="2" fill="#fdba74" />
      </svg>
    );
  }

  if (type.includes("pos") || type.includes("দোকান") || type.includes("হিসাব") || type.includes("ক্যাশ") || type.includes("ক্যাশিয়ার")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#082f49" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.5" />
        <path d="M16 14h16v20l-2.5-1.5-2.5 1.5-3-1.5-3 1.5-2.5-1.5-2.5 1.5V14z" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 20h6M21 24h6M21 28h3" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("resume") || type.includes("বায়োডাটা") || type.includes("বায়োডাটা")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#3b0764" fillOpacity="0.3" stroke="#9333ea" strokeWidth="1.5" />
        <path d="M17 14h10l6 6v14a2 2 0 01-2 2H17a2 2 0 01-2-2V16a2 2 0 012-2z" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 26h8M20 30h5" stroke="#e9d5ff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("thesis") || type.includes("থিসিস") || type.includes("টাইপিং") || type.includes("অ্যাসাইনমেন্ট")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#082f49" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.5" />
        <path d="M15 14h18v20H15z" stroke="#38bdf8" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M20 20h8M20 24h8M20 28h5" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("presentation") || type.includes("স্লাইড") || type.includes("প্রেজেন্টেশন")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#431407" fillOpacity="0.3" stroke="#ea580c" strokeWidth="1.5" />
        <rect x="15" y="15" width="18" height="12" rx="2" stroke="#fb923c" strokeWidth="2.2" />
        <path d="M19 22v-2M24 22v-4M29 22v-3" stroke="#fdba74" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 27v6M19 36l5-3 5 3" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("software") || type.includes("সফটওয়্যার") || type.includes("সফটওয়্যার") || type.includes("অ্যাপ")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#0c1e3d" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
        <rect x="14" y="15" width="16" height="12" rx="2" stroke="#60a5fa" strokeWidth="2.2" />
        <path d="M19 27v3M16 30h12" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="27" y="20" width="8" height="13" rx="1.5" stroke="#93c5fd" strokeWidth="1.8" fill="#0c1e3d" />
        <circle cx="31" cy="30.5" r="0.6" fill="#93c5fd" />
      </svg>
    );
  }

  if (type.includes("web") || type.includes("ওয়েব") || type.includes("ওয়েবসাইট")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#042f2e" fillOpacity="0.35" stroke="#0891b2" strokeWidth="1.5" />
        <rect x="14" y="15" width="20" height="18" rx="3" stroke="#22d3ee" strokeWidth="2.2" />
        <path d="M14 21h20" stroke="#22d3ee" strokeWidth="1.8" />
        <circle cx="18" cy="18" r="1" fill="#67e8f9" />
        <circle cx="21" cy="18" r="1" fill="#67e8f9" />
        <path d="M20 27l2-2-2-2M25 27h3" stroke="#a5f3fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("graphic") || type.includes("গ্রাফিক") || type.includes("design") || type.includes("ডিজাইন")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#500724" fillOpacity="0.3" stroke="#db2777" strokeWidth="1.5" />
        <path d="M24 14c-6.6 0-10.5 4-10.5 10 0 5 4 8.5 8.5 8.5 1.5 0 2.5-.8 3.5-2 1-1 1.5-1.5 2.5-1.5h1.5c4 0 6.5-3 6.5-6.5C36 17.5 31.5 14 24 14z" stroke="#f472b6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19.5" cy="20" r="1.5" fill="#f472b6" />
        <circle cx="25.5" cy="18.5" r="1.5" fill="#fbcfe8" />
        <circle cx="30.5" cy="22" r="1.5" fill="#f472b6" />
      </svg>
    );
  }

  if (type.includes("video") || type.includes("ভিডিও") || type.includes("এডিটর") || type.includes("এডিটিং") || type.includes("কালার")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#4c0519" fillOpacity="0.3" stroke="#e11d48" strokeWidth="1.5" />
        <rect x="14" y="18" width="15" height="12" rx="2.5" stroke="#fb7185" strokeWidth="2.2" />
        <path d="M29 22l6-3v10l-6-3v-4z" stroke="#fb7185" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="21.5" cy="24" r="2" stroke="#fda4af" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type.includes("growth") || type.includes("গ্রোথ") || type.includes("চ্যানেল") || type.includes("পেজ")) {
    if (title.includes("ইউটিউব") || title.includes("ফেসবুক") || type.includes("yt-fb")) {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" viewBox="0 0 100 70" fill="none">
            <path d="M96.3 10.7c-1.1-4.2-4.4-7.5-8.6-8.6C80.1 0 49.2 0 49.2 0S18.3 0 10.7 2.1c-4.2 1.1-7.5 4.4-8.6 8.6C0 18.3 0 34.3 0 34.3s0 16 2.1 23.6c1.1 4.2 4.4 7.5 8.6 8.6 7.6 2.1 38.5 2.1 38.5 2.1s30.9 0 38.5-2.1c4.2-1.1 7.5-4.4 8.6-8.6 2.1-7.6 2.1-23.6 2.1-23.6s0-16-2.1-23.6z" fill="#FF0000"/>
            <path d="M39.3 49L64.8 34.3 39.3 19.6z" fill="#FFFFFF"/>
          </svg>
          <svg className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill="#1877F2" />
            <path d="M58 52L60 38H46V29C46 25.5 48 22 53.5 22H60V9.5C60 9.5 54.5 8.5 49.5 8.5C39 8.5 32 15 32 26.5V38H20V52H32V88C34.8 88.5 37.6 88.8 40.5 88.8C42.4 88.8 44.2 88.6 46 88.3V52H58Z" fill="#FFF" />
          </svg>
        </div>
      );
    }
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#2d1f04" fillOpacity="0.35" stroke="#d97706" strokeWidth="1.5" />
        <path d="M15 33l6-6 4.5 4.5 9-10.5" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28.5 21H34.5v6" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("location") || type.includes("লোকেশন") || type.includes("ট্রেকিং") || type.includes("ট্র্যাকিং")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#064e3b" fillOpacity="0.3" stroke="#059669" strokeWidth="1.5" />
        <path d="M24 14c-4.2 0-7.5 3.3-7.5 7.5 0 5.6 7.5 13.5 7.5 13.5s7.5-7.9 7.5-13.5c0-4.2-3.3-7.5-7.5-7.5z" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="21.5" r="2.5" stroke="#a7f3d0" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type.includes("remote") || type.includes("রিমোট") || type.includes("কম্পিউটার")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#1e1b4b" fillOpacity="0.35" stroke="#4338ca" strokeWidth="1.5" />
        <rect x="18" y="16" width="16" height="11" rx="1.5" stroke="#818cf8" strokeWidth="2.2" />
        <path d="M15 29h22" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="14" y="21" width="7" height="12" rx="1.5" stroke="#a5b4fc" strokeWidth="1.8" fill="#1e1b4b" />
      </svg>
    );
  }

  if (type.includes("cv") || type.includes("সিভি") || type.includes("প্রোফাইল")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#1e1b4b" fillOpacity="0.35" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="15" y="14" width="18" height="21" rx="2.5" stroke="#818cf8" strokeWidth="2.2" />
        <circle cx="24" cy="20.5" r="3" stroke="#c7d2fe" strokeWidth="1.8" />
        <path d="M19 29.5c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="#c7d2fe" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("security") || type.includes("নিরাপত্তা") || type.includes("সিকিউরিটি") || type.includes("হ্যাকিং")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#064e3b" fillOpacity="0.3" stroke="#059669" strokeWidth="1.5" />
        <path d="M24 14l9 4v7c0 7-4.5 10-9 11.5-4.5-1.5-9-4.5-9-11.5v-7l9-4z" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5 24.5l2.5 2.5 5-5" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("bug") || type.includes("সমস্যা") || type.includes("ত্রুটি") || type.includes("এরর")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#2d1f04" fillOpacity="0.35" stroke="#d97706" strokeWidth="1.5" />
        <path d="M28.5 16a5 5 0 00-4.8 6.2l-8 8a1.5 1.5 0 002.1 2.1l8-8A5 5 0 0032 20.2l-3 3-3-3 1.5-4.2z" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("payment") || type.includes("পেমেন্ট") || type.includes("বিকাশ") || type.includes("নগদ")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#064e3b" fillOpacity="0.3" stroke="#059669" strokeWidth="1.5" />
        <rect x="14" y="17" width="20" height="14" rx="2.5" stroke="#34d399" strokeWidth="2.2" />
        <path d="M14 21.5h20" stroke="#34d399" strokeWidth="1.8" />
        <rect x="17.5" y="25" width="4" height="2.5" rx="0.5" fill="#a7f3d0" />
      </svg>
    );
  }

  if (type.includes("voice") || type.includes("ভয়েস") || type.includes("ভয়েস") || type.includes("অডিও")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#3b0764" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="1.5" />
        <rect x="21" y="15" width="6" height="11" rx="3" stroke="#a78bfa" strokeWidth="2.2" />
        <path d="M17.5 22.5a6.5 6.5 0 0013 0" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 29v5M20 34h8" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type.includes("ui") || type.includes("ux") || type.includes("লুক")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#500724" fillOpacity="0.3" stroke="#db2777" strokeWidth="1.5" />
        <rect x="14" y="15" width="20" height="18" rx="2.5" stroke="#f472b6" strokeWidth="2.2" />
        <rect x="17" y="18" width="6" height="12" rx="1" fill="#f472b6" fillOpacity="0.3" />
        <rect x="25" y="18" width="6" height="5" rx="1" fill="#fbcfe8" fillOpacity="0.4" />
        <rect x="25" y="25" width="6" height="5" rx="1" fill="#fbcfe8" fillOpacity="0.4" />
      </svg>
    );
  }

  if (type.includes("hosting") || type.includes("vps") || type.includes("হোস্টিং") || type.includes("ডোমেইন")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#082f49" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="14" y="16" width="20" height="7" rx="2" stroke="#38bdf8" strokeWidth="2.2" />
        <rect x="14" y="26" width="20" height="7" rx="2" stroke="#38bdf8" strokeWidth="2.2" />
        <circle cx="18" cy="19.5" r="1" fill="#7dd3fc" />
        <circle cx="18" cy="29.5" r="1" fill="#7dd3fc" />
      </svg>
    );
  }

  if (type.includes("advanced") || type.includes("custom") || type.includes("rdp") || type.includes("service") || type.includes("সার্ভিস")) {
    return (
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#082f49" fillOpacity="0.35" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="8" stroke="#38bdf8" strokeWidth="2.2" />
        <path d="M24 12v3M24 33v3M12 24h3M33 24h3" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // Reliable, clean minimalist fallback SVG for any unspecified service (ensures visual is NEVER blank)
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#082f49" fillOpacity="0.35" stroke="#0ea5e9" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="8" stroke="#38bdf8" strokeWidth="2.2" />
      <path d="M24 12v3M24 33v3M12 24h3M33 24h3" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
});

// Curated high-resolution professional themed images for all Advanced Services
export const ADVANCED_SERVICE_THEME_IMAGES: Record<string, string> = {
  // Web Development
  "adv-web-development": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
  "web": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",

  // Phone / Location Tracing
  "adv-phone-location-tracing": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
  "location": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",

  // Video Editing
  "adv-video-editor-service": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  "video": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",

  // YouTube & Facebook Growth
  "adv-yt-fb-growth-masterclass": "/images/services/youtube-facebook-growth.svg",
  "growth": "/images/services/youtube-facebook-growth.svg",

  // Browser Extension & Custom Tools
  "adv-custom-browser-extension": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  "extension": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",

  // Mobile to PC Remote Control
  "adv-mobile-pc-remote-control": "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&q=80",
  "remote": "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&q=80",

  // Smart Meeting Minutes & Action Item Generator
  "adv-meeting-minutes-generator": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
  "meeting-minutes": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",

  // Smart Social Media Comment Moderator
  "adv-social-comment-moderator": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80",
  "comment-moderator": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80",

  // Automatic Job Apply & CV Optimization
  "adv-job-apply-cv-optimizer": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  "job-apply-cv": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",

  // Smart Voice Password & Biometric Lock
  "adv-voice-password-biometric-lock": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80",
  "voice-biometric-lock": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80",

  // Automatic Rent & Utility Bill Payer
  "adv-rent-utility-bill-payer": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
  "rent-utility-bill": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",

  // Automatic Travel & Route Planner
  "adv-travel-route-planner": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
  "travel-route-planner": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",

  // Smart Event & Birthday Reminder
  "adv-birthday-event-reminder": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
  "birthday-event-reminder": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",

  // Automatic Voice Note Summary
  "adv-voice-note-summary": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
  "voice-note-summary": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",

  // Smart Email Drafting & Reply
  "adv-smart-email-drafting": "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",
  "email-drafting": "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",

  // Smart Clipboard Manager
  "adv-smart-clipboard-manager": "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=600&q=80",
  "clipboard-manager": "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=600&q=80",

  // Live Language Translation & Conversation
  "adv-live-language-translation": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
  "language-translation": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",

  // Smart Project & Task Assigner
  "adv-smart-task-assigner": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  "task-assigner": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",

  // Automatic Contact Finder
  "adv-auto-contact-finder": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  "contact-finder": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",

  // Smart Alarm & Weather Updates
  "adv-smart-alarm-weather": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",
  "alarm-weather": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",

  // Password & Security Reminder
  "adv-password-security-reminder": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
  "password-security": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",

  // Smart Reminder & Scheduling
  "adv-smart-reminder-scheduling": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
  "smart-reminder": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",

  // Web & App Location Tracking
  "adv-web-app-location-tracking": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
  "web-app-tracking": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",

  // Full Autonomous AI Device Control
  "adv-full-device-ai-control": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
  "ai-device-control": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",

  // Remote Phone Control & Access
  "adv-remote-phone-control": "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80",
  "phone-control": "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80",

  // Device Monitoring & Setup
  "adv-device-monitoring-setup": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=600&q=80",
  "device-monitoring": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=600&q=80",

  // Real-time Device & Location Tracking
  "adv-realtime-device-location-tracking": "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",
  "device-tracking": "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",

  // CV / Portfolio / LinkedIn Optimization
  "adv-cv-portfolio-linkedin-optimization": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
  "cv": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",

  // Custom Software & Mobile App Development
  "adv-custom-software-app-development": "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80",
  "software": "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80",

  // Cybersecurity Audit & Safe Website
  "adv-cyber-security-audit": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "security": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",

  // Domain & Hosting Consultancy
  "adv-domain-hosting-consultancy": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "vps": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "hosting": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",

  // Video Color Grading & Premium Editing
  "adv-video-editing-color-grading": "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80",

  // Bug Fixing & Coding Support
  "adv-bug-fixing-coding-support": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80",
  "bug": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80",

  // Payment Gateway Integration (Bkash, Nagad)
  "adv-payment-gateway-integration": "https://images.unsplash.com/photo-1556742049-0a67e5574f73?auto=format&fit=crop&w=600&q=80",
  "payment": "https://images.unsplash.com/photo-1556742049-0a67e5574f73?auto=format&fit=crop&w=600&q=80",

  // Graphic Design Service
  "adv-graphic-design-service": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
  "graphic": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",

  // Voiceover & Audio Editing
  "adv-voiceover-audio-editing": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
  "voice": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",

  // UI/UX Design Service
  "adv-ui-ux-design-service": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
  "ui-ux": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",

  // Fullstack SaaS Development
  "adv-fullstack-saas-development": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "saas": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",

  // Third-party API Integration
  "adv-thirdparty-api-integration": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "api": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",

  // Web Performance Optimization
  "adv-web-performance-optimization": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "performance": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",

  // DevOps & Cloud Automation
  "adv-devops-cloud-automation": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  "devops": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",

  // School & Coaching Management
  "adv-school-coaching-management": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  "school": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",

  // Restaurant QR Menu
  "adv-restaurant-qr-menu": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  "qrmenu": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",

  // Local POS Software
  "adv-local-pos-software": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80",
  "pos": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80",

  // CV & Resume Writing
  "adv-cv-resume-writing": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  "resume": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",

  // Assignment & Thesis Typing
  "adv-assignment-thesis-typing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "thesis": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",

  // Presentation & Student Projects
  "adv-student-project-presentation": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
  "presentation": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
};

export function getAdvancedServiceImage(service: any): string {
  const id = (service?.id || (service as any)?._id || (service as any)?.productId || "").toString();
  const title = (service?.title || "").toLowerCase();
  const logoType = (service?.logoType || "").toLowerCase();

  // YouTube & Facebook Growth priority check (side-by-side original logos)
  if (
    id === "adv-yt-fb-growth-masterclass" ||
    logoType === "growth" ||
    logoType === "yt-fb-growth" ||
    (title.includes("ইউটিউব") && title.includes("ফেসবুক"))
  ) {
    return "/images/services/youtube-facebook-growth.svg";
  }

  // Intercept and sanitize any stale Unsplash Netflix photo placeholder reference
  if (
    service?.imageUrl?.includes("1611162617474-5b21e879e113") ||
    service?.image?.includes("1611162617474-5b21e879e113")
  ) {
    return "/images/services/youtube-facebook-growth.svg";
  }

  if (service?.imageUrl && (service.imageUrl.startsWith("http") || service.imageUrl.startsWith("/"))) {
    return service.imageUrl;
  }
  if (service?.image && (service.image.startsWith("http") || service.image.startsWith("/"))) {
    return service.image;
  }
  if (id && ADVANCED_SERVICE_THEME_IMAGES[id]) {
    return ADVANCED_SERVICE_THEME_IMAGES[id];
  }
  if (logoType && ADVANCED_SERVICE_THEME_IMAGES[logoType]) {
    return ADVANCED_SERVICE_THEME_IMAGES[logoType];
  }
  if (title.includes("মিটিং মিনিটস") || title.includes("অ্যাকশন আইটেম") || title.includes("meeting minutes")) return ADVANCED_SERVICE_THEME_IMAGES["meeting-minutes"];
  if (title.includes("কমেন্ট মডারেটর") || title.includes("সোশ্যাল মিডিয়া কমেন্ট") || title.includes("comment moderator")) return ADVANCED_SERVICE_THEME_IMAGES["comment-moderator"];
  if (title.includes("জব অ্যাপ্লাই") || title.includes("সিভি অপ্টিমাইজেশন") || title.includes("job apply")) return ADVANCED_SERVICE_THEME_IMAGES["job-apply-cv"];
  if (title.includes("ভয়েস পাসওয়ার্ড") || title.includes("বায়োমেট্রিক লক") || title.includes("biometric lock")) return ADVANCED_SERVICE_THEME_IMAGES["voice-biometric-lock"];
  if (title.includes("বিল পেয়ার") || title.includes("ইউটিলিটি বিল") || title.includes("বাসা ভাড়া") || title.includes("utility bill")) return ADVANCED_SERVICE_THEME_IMAGES["rent-utility-bill"];
  if (title.includes("ট্রাভেল") || title.includes("রুট প্ল্যানার") || title.includes("travel planner")) return ADVANCED_SERVICE_THEME_IMAGES["travel-route-planner"];
  if (title.includes("বার্থডে") || title.includes("ইভেন্ট ও বার্থডে") || title.includes("birthday reminder")) return ADVANCED_SERVICE_THEME_IMAGES["birthday-event-reminder"];
  if (title.includes("ভয়েস নোট") || title.includes("ভয়েস নোট") || title.includes("নোট সামারি") || title.includes("voice note")) return ADVANCED_SERVICE_THEME_IMAGES["voice-note-summary"];
  if (title.includes("ইমেল ড্রাফটিং") || title.includes("ইমেইল ড্রাফটিং") || title.includes("ড্রাফটিং ও রিপ্লাই") || title.includes("email drafting")) return ADVANCED_SERVICE_THEME_IMAGES["email-drafting"];
  if (title.includes("ক্লিপবোর্ড") || title.includes("clipboard")) return ADVANCED_SERVICE_THEME_IMAGES["clipboard-manager"];
  if (title.includes("ভাষা অনুবাদ") || title.includes("লাইভ কনভার্সেশন") || title.includes("লাইভ অনুবাদ") || title.includes("translation")) return ADVANCED_SERVICE_THEME_IMAGES["language-translation"];
  if (title.includes("টাস্ক অ্যাসাইনার") || title.includes("প্রজেক্ট ও টাস্ক") || title.includes("task assigner")) return ADVANCED_SERVICE_THEME_IMAGES["task-assigner"];
  if (title.includes("কন্টাক্ট ফাইন্ডার") || title.includes("contact finder")) return ADVANCED_SERVICE_THEME_IMAGES["contact-finder"];
  if (title.includes("অ্যালার্ম ও ওয়েদার") || title.includes("ওয়েদার আপডেটস") || title.includes("alarm & weather")) return ADVANCED_SERVICE_THEME_IMAGES["alarm-weather"];
  if (title.includes("পাসওয়ার্ড ও সিকিউরিটি") || title.includes("সিকিউরিটি রিমাইন্ডার") || title.includes("password & security")) return ADVANCED_SERVICE_THEME_IMAGES["password-security"];
  if (title.includes("স্মার্ট রিমাইন্ডার") || title.includes("smart reminder") || title.includes("রিমাইন্ডার ও শিডিউলিং") || title.includes("শিডিউলিং")) return ADVANCED_SERVICE_THEME_IMAGES["smart-reminder"];
  if (title.includes("ফুল ডিভাইস কন্ট্রোল") || title.includes("ফুল ডিভাইস") || title.includes("device ai control") || title.includes("ডিভাইস কন্ট্রোল এআই")) return ADVANCED_SERVICE_THEME_IMAGES["ai-device-control"];
  if (title.includes("ওয়েবসাইট ও অ্যাপ লোকেশন") || title.includes("location tracking setup") || title.includes("অ্যাপ লোকেশন")) return ADVANCED_SERVICE_THEME_IMAGES["web-app-tracking"] || ADVANCED_SERVICE_THEME_IMAGES["location"];
  if (title.includes("ওয়েবসাইট") || title.includes("web")) return ADVANCED_SERVICE_THEME_IMAGES["web"];
  if (title.includes("রিয়েল-টাইম") || title.includes("রিয়েল টাইম") || title.includes("location tracker") || title.includes("ডিভাইস ও লোকেশন")) return ADVANCED_SERVICE_THEME_IMAGES["device-tracking"];
  if (title.includes("লোকেশন") || title.includes("ট্র্যাকিং")) return ADVANCED_SERVICE_THEME_IMAGES["location"];
  if (title.includes("ভিডিও") || title.includes("কালার")) return ADVANCED_SERVICE_THEME_IMAGES["video"];
  if (title.includes("গ্রোথ") || title.includes("ইউটিউব") || title.includes("ফেসবুক")) return ADVANCED_SERVICE_THEME_IMAGES["growth"];
  if (title.includes("টুলস") || title.includes("ক্রোম") || title.includes("এক্সটেনশন")) return ADVANCED_SERVICE_THEME_IMAGES["extension"];
  if (title.includes("রিমোট ফোন") || title.includes("ফোন কন্ট্রোল") || title.includes("remote phone")) return ADVANCED_SERVICE_THEME_IMAGES["phone-control"];
  if (title.includes("ডিভাইস মনিটরিং") || title.includes("মনিটরিং") || title.includes("monitoring")) return ADVANCED_SERVICE_THEME_IMAGES["device-monitoring"];
  if (title.includes("রিমোট") || title.includes("কম্পিউটার")) return ADVANCED_SERVICE_THEME_IMAGES["remote"];
  if (title.includes("সিভি") || title.includes("বায়োডাটা") || title.includes("প্রোফাইল")) return ADVANCED_SERVICE_THEME_IMAGES["cv"];
  if (title.includes("সফটওয়্যার") || title.includes("অ্যাপ")) return ADVANCED_SERVICE_THEME_IMAGES["software"];
  if (title.includes("নিরাপত্তা") || title.includes("হ্যাকিং") || title.includes("সিকিউরিটি")) return ADVANCED_SERVICE_THEME_IMAGES["security"];
  if (title.includes("হোস্টিং") || title.includes("ডোমেইন")) return ADVANCED_SERVICE_THEME_IMAGES["hosting"];
  if (title.includes("বাগ") || title.includes("সমস্যা") || title.includes("এরর")) return ADVANCED_SERVICE_THEME_IMAGES["bug"];
  if (title.includes("পেমেন্ট") || title.includes("বিকাশ") || title.includes("নগদ")) return ADVANCED_SERVICE_THEME_IMAGES["payment"];
  if (title.includes("গ্রাফিক") || title.includes("লোগো") || title.includes("ব্যানার")) return ADVANCED_SERVICE_THEME_IMAGES["graphic"];
  if (title.includes("ভয়েস") || title.includes("ভয়েস") || title.includes("অডিও")) return ADVANCED_SERVICE_THEME_IMAGES["voice"];
  if (title.includes("ডিজাইন") || title.includes("ui") || title.includes("ux")) return ADVANCED_SERVICE_THEME_IMAGES["ui-ux"];
  if (title.includes("সাআস") || title.includes("saas") || title.includes("সিস্টেম")) return ADVANCED_SERVICE_THEME_IMAGES["saas"];
  if (title.includes("api") || title.includes("লিংক") || title.includes("সংযোগ")) return ADVANCED_SERVICE_THEME_IMAGES["api"];
  if (title.includes("স্পিড") || title.includes("ফাস্ট") || title.includes("গতি")) return ADVANCED_SERVICE_THEME_IMAGES["performance"];
  if (title.includes("ক্লাউড") || title.includes("সার্ভার") || title.includes("ব্যাকআপ")) return ADVANCED_SERVICE_THEME_IMAGES["devops"];
  if (title.includes("স্কুল") || title.includes("কোচিং")) return ADVANCED_SERVICE_THEME_IMAGES["school"];
  if (title.includes("কিউআর") || title.includes("রেস্টুরেন্ট") || title.includes("মেনু")) return ADVANCED_SERVICE_THEME_IMAGES["qrmenu"];
  if (title.includes("দোকান") || title.includes("ক্যাশ") || title.includes("মেমো") || title.includes("pos")) return ADVANCED_SERVICE_THEME_IMAGES["pos"];
  if (title.includes("থিসিস") || title.includes("টাইপিং") || title.includes("অ্যাসাইনমেন্ট")) return ADVANCED_SERVICE_THEME_IMAGES["thesis"];
  if (title.includes("স্লাইড") || title.includes("প্রেজেন্টেশন")) return ADVANCED_SERVICE_THEME_IMAGES["presentation"];

  return "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80";
}

interface ServiceCardProps {
  service?: ServiceItem;
  product?: ServiceItem;
  currentCategory?: string;
  onAddToCart?: (service: ServiceItem) => void;
  onBuyNow?: (service: ServiceItem) => void;
  onEdit?: (service: ServiceItem) => void;
  onDelete?: (service: ServiceItem) => void;
  onTogglePin?: (service: ServiceItem) => void;
  isHighlighted?: boolean;
}

function ServiceCard({ service: inputService, product, currentCategory, onAddToCart, onBuyNow, onEdit, onDelete, onTogglePin, isHighlighted }: ServiceCardProps) {
  const service = inputService || product;
  const { locale } = useLanguage();
  const { user } = useAuth();
  const isBn = locale === "bn";
  const isAdmin = user?.role === "admin" || (user?.email || "").toLowerCase() === "mdasifrayhanjoy2@gmail.com";

  if (!service) return null;

  const IconComponent = ICON_MAP[service.icon] || Sparkles;

  const [logoError, setLogoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const calcOriginalPrice = useMemo(() => {
    return service.originalPrice && service.originalPrice > service.price
      ? service.originalPrice
      : Math.round(service.price * 1.2) || service.price + 10;
  }, [service.originalPrice, service.price]);

  const discountPercent = useMemo(() => {
    return Math.max(0, Math.round(((calcOriginalPrice - service.price) / calcOriginalPrice) * 100));
  }, [calcOriginalPrice, service.price]);

  const displayTitle = isBn ? service.title_bn || service.title : service.title;
  const isPinned = !!(service.isPinned ?? (service as any).pinned);
  
  const isSubscription = service.category?.toLowerCase() === "subscriptions";
  const rawInStock = service.inStock;
  const rawStock = (service.stock || "").toString().trim();
  const rawStatus = ((service as any).status || (service as any).stockStatus || "").toString().trim().toLowerCase();

  const isSoldOut =
    rawInStock === false ||
    (rawInStock as any) === "false" ||
    rawStock === "Stock Out" ||
    rawStock === "Out of Stock" ||
    rawStock === "Sold Out" ||
    rawStatus === "stock-out" ||
    rawStatus === "out-of-stock" ||
    (rawInStock === undefined && rawStock === "" && (service.badge === "Sold Out ❌" || service.badge === "SOLD OUT"));

  const customImgUrl = useMemo(() => {
    return ((service as any).imageUrl || service.image || service.logo || "").toString().trim();
  }, [(service as any).imageUrl, service.image, service.logo]);

  const hasExplicitCustomImage = useMemo(() => {
    if (!customImgUrl) return false;
    return (
      customImgUrl.startsWith("http://") ||
      customImgUrl.startsWith("https://") ||
      customImgUrl.startsWith("/") ||
      customImgUrl.startsWith("data:") ||
      /\.(png|jpe?g|svg|webp|gif|avif|ico)(\?.*)?$/i.test(customImgUrl)
    );
  }, [customImgUrl]);

  const displayLogo = useMemo(() => {
    if (logoError) return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(service.title)}`;
    if (customImgUrl) return customImgUrl;
    const firstWord = service.title.toLowerCase().split(" ")[0].replace(/[^a-z]/g, "");
    return `/images/vpns/${firstWord}.svg`;
  }, [logoError, service.title, customImgUrl]);

  const featureList = useMemo(() => {
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
      advanced: [
        "100% Guaranteed Genuine Advanced Service",
        "Dedicated VIP High-Priority Allocation",
        "Instant Automated Order Processing",
        "Full Replacement Warranty Support"
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
    
    return Array.isArray(service.features) && service.features.length >= 1 ? service.features : fallbackFeatures;
  }, [service.category, service.features]);

  const isStudent = useMemo(() => {
    const cat = (currentCategory || "").toLowerCase();
    const servCat = (service?.category || "").toLowerCase();
    const canonical = getCanonicalCategory(service || {});
    return cat === "student" || servCat === "student" || canonical === "student";
  }, [currentCategory, service]);

  const isAdvanced = useMemo(() => {
    const cat = (currentCategory || "").toLowerCase();
    const servCat = (service?.category || "").toLowerCase();
    const canonical = getCanonicalCategory(service || {});
    const wideSet = new Set(["advanced", "tech", "ai-voice", "security", "media-marketing", "utilities"]);
    return wideSet.has(cat) || wideSet.has(servCat) || wideSet.has(canonical);
  }, [currentCategory, service]);

  const categoryBadgeText = useMemo(() => {
    if (isStudent) return "STUDENT SERVICE";
    const canonical = getCanonicalCategory(service || {});
    const servCat = (service?.category || "").toLowerCase();
    if (canonical === "tech" || servCat === "tech") return "ADVANCED TECH";
    if (canonical === "ai-voice" || servCat === "ai-voice") return "AI & VOICE";
    if (canonical === "security" || servCat === "security") return "DIGITAL SECURITY";
    if (canonical === "media-marketing" || servCat === "media-marketing") return "MEDIA & MARKETING";
    if (canonical === "utilities" || servCat === "utilities") return "SMART UTILITIES";
    return "ADVANCED SERVICE";
  }, [isStudent, service]);

  const isWideCard = isAdvanced || isStudent;

  const hasSvgLogo = isSubscription || !!service.logoType || service.category?.toLowerCase() === "ip" || service.category?.toLowerCase() === "smm" || service.category?.toLowerCase() === "email";

  const cleanBadge = useMemo(() => {
    const rawBadge = (service.badge || service.subtitle || "").toString().trim();
    if (isSoldOut) return "STOCK OUT";
    if (rawBadge === "SOLD OUT" || rawBadge === "Sold Out ❌" || rawBadge.toLowerCase() === "sold out") {
      const sub = (service.subtitle || "").toString().trim();
      return sub && sub !== "SOLD OUT" && sub !== "Sold Out ❌" ? sub : "Full Replacement Support ✅";
    }
    return rawBadge || "Full Replacement Support ✅";
  }, [service.badge, service.subtitle, isSoldOut]);

  const cleanSubtitle = useMemo(() => {
    const rawSub = (service.subtitle || "").toString().trim();
    if (rawSub === "SOLD OUT" || rawSub === "Sold Out ❌" || rawSub.toLowerCase() === "sold out") {
      return "100% Genuine Digital Service ✅";
    }
    return rawSub || "100% Genuine Digital Service ✅";
  }, [service.subtitle]);

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to product detail page preserving category context and query aliases
    const effectiveCategory = currentCategory && currentCategory !== "all" ? currentCategory : (service.category || getCanonicalCategory(service));
    const cat = getCategoryQueryParam(effectiveCategory, getCanonicalCategory(service));
    router.push(cat ? `/${locale}/services/${service.id}?cat=${cat}` : `/${locale}/services/${service.id}`);
  };

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(service);
  }, [onAddToCart, service]);

  const handleBuy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) onBuyNow(service);
  }, [onBuyNow, service]);

  // --- 1. HORIZONTAL & BALANCED WIDE CARD LAYOUT FOR ADVANCED & STUDENT SERVICE CATEGORIES ---
  if (isWideCard) {
    return (
      <div
        id={`product-${service.id}`}
        onClick={handleCardClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick(e as any);
          }
        }}
        aria-label={isBn ? `${displayTitle} - বিস্তারিত বিবরণ দেখুন` : `View details for ${displayTitle}`}
        className={`group relative glass-panel glass-panel-hover rounded-3xl p-4 sm:p-5 md:p-5 flex flex-col md:flex-row items-stretch gap-4 sm:gap-5 md:gap-6 border transition-all duration-300 transform-gpu cursor-pointer font-sans overflow-hidden ${
          isHighlighted
            ? "border-rose-500 ring-2 ring-rose-500/40 shadow-2xl shadow-rose-500/20 bg-slate-900/95"
            : "border-cyan-500/30 hover:border-cyan-400/80 bg-gradient-to-r from-slate-900/90 via-slate-950/95 to-slate-900/90 hover:shadow-2xl hover:shadow-cyan-500/10"
        }`}
      >
        {/* Radial Hover Glow Accent */}
        <div className="hidden sm:block absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />

        {/* 1. LEFT VISUAL BANNER / IMAGE CONTAINER (Wide / Horizontal X-axis Layout) */}
        <div className="relative w-full md:w-56 lg:w-64 h-48 sm:h-52 md:h-auto md:min-h-[175px] shrink-0 rounded-2xl bg-slate-900 border border-cyan-500/30 group-hover:border-cyan-400/50 overflow-hidden shadow-md flex items-center justify-center">
          {((service?.id || (service as any)?._id || (service as any)?.productId) === "adv-yt-fb-growth-masterclass" ||
            service?.logoType === "growth" ||
            service?.logoType === "yt-fb-growth" ||
            ((service?.title || "").includes("ইউটিউব") && (service?.title || "").includes("ফেসবুক"))) ? (
            <div className="relative w-full h-full min-h-[175px] bg-gradient-to-br from-[#0c101d] via-[#070a14] to-[#03050a] flex flex-col items-center justify-center p-3 sm:p-4 overflow-hidden select-none">
              {/* Ambient colorful glow halos */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-28 h-28 bg-red-600/25 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/40 transition-all duration-500" />
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-28 h-28 bg-blue-600/25 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/40 transition-all duration-500" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0,transparent_70%)] pointer-events-none" />

              {/* Side-by-side Logos Container */}
              <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3.5 my-auto">
                {/* YouTube Official Logo Box */}
                <div className="flex flex-col items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-12 sm:w-20 sm:h-14 bg-gradient-to-b from-[#FF0000] to-[#D90000] rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30 border border-red-400/30">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current ml-0.5 drop-shadow" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-100 tracking-wide">YouTube</span>
                </div>

                {/* Elegant Ampersand Badge */}
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800/90 border border-cyan-500/40 shadow-md">
                  <span className="text-cyan-400 font-black text-xs">&amp;</span>
                </div>

                {/* Facebook Official Logo Box */}
                <div className="flex flex-col items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-12 sm:w-20 sm:h-14 bg-gradient-to-b from-[#1877F2] to-[#0d65d9] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/30">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current drop-shadow" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-100 tracking-wide">Facebook</span>
                </div>
              </div>

              {/* Bottom Growth Pill */}
              <div className="relative z-10 mt-1 px-3 py-0.5 rounded-full bg-slate-900/90 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">Growth Service</span>
              </div>
            </div>
          ) : (
            <>
              {/* Professional Themed Image */}
              <img
                src={getAdvancedServiceImage(service)}
                alt={service.title}
                loading="lazy"
                decoding="async"
                width={320}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80";
                }}
              />

              {/* Subtle Ambient Contrast Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </>
          )}
        </div>

        {/* 2. RIGHT / MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col justify-between space-y-2.5 min-w-0">
          <div>
            {/* Top Toolbar: Category, Service Badge, Duration, Rating, Status & Admin Controls */}
            <div className="flex items-center justify-between gap-2.5 flex-wrap mb-2">
              {/* Badges Cluster (Directly above service title) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm border ${
                  isStudent
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                }`}>
                  {categoryBadgeText}
                </span>
                {isPinned && (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 rounded-full shadow-sm flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400 stroke-[2]" />
                    <span>{isBn ? "পিন করা" : "PINNED"}</span>
                  </span>
                )}
                {cleanBadge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded-full shadow-sm flex items-center gap-1">
                    <span>⚡</span>
                    <span>{cleanBadge}</span>
                  </span>
                )}
                {(service.duration || service.validity) && (
                  <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 rounded-full flex items-center gap-1 shadow-sm">
                    <Clock className="w-2.5 h-2.5 stroke-[2.5] text-indigo-400" />
                    <span>{service.duration || service.validity}</span>
                  </span>
                )}
              </div>

              {/* Right Toolbar: Rating, Stock, Favorite & Admin Controls */}
              <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] flex-wrap ml-auto">
                <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800/80">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-extrabold text-white text-xs">{service.rating || 5.0}</span>
                  <span className="text-slate-400 text-[10px]">({service.reviews || 95})</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isBn ? "লাইভ সার্ভিস" : "Active Service"}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                  className="w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center border border-slate-800"
                  aria-label="Add to Favorites"
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>

                {/* Relocated Admin Controls (Pin, Edit & Delete Buttons) */}
                {isAdmin && (
                  <div className="flex items-center gap-1 pl-1.5 border-l border-slate-700/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTogglePin) onTogglePin(service);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-black rounded-lg shadow flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
                        isPinned
                          ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30"
                          : "bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border-slate-700 hover:border-cyan-500/50"
                      }`}
                      title={isPinned ? (isBn ? "পিন সরানো (Unpin)" : "Unpin Service") : (isBn ? "উপরে পিন করুন (Pin to Top)" : "Pin Service to Top")}
                    >
                      <Pin className={`w-3 h-3 stroke-[2.5] ${isPinned ? "fill-slate-950 text-slate-950" : "text-cyan-400"}`} />
                      <span>{isPinned ? (isBn ? "পিন্ড" : "Pinned") : (isBn ? "পিন" : "Pin")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) onEdit(service);
                      }}
                      className="px-2.5 py-1 text-[11px] font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 rounded-lg shadow flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/60"
                      title="Edit Card (Admin Only)"
                    >
                      <Pencil className="w-3 h-3 stroke-[2.5]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDelete) onDelete(service);
                      }}
                      className="px-2.5 py-1 text-[11px] font-black bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white rounded-lg shadow flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-400/60"
                      title="Delete Card (Admin Only)"
                    >
                      <Trash2 className="w-3 h-3 stroke-[2.5]" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Service Title */}
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-white group-hover:text-cyan-200 transition-colors leading-snug tracking-tight font-sans line-clamp-1 sm:line-clamp-2">
              {displayTitle}
            </h3>

            {/* Subtitle / Description */}
            {service.subtitle && (
              <p className="text-xs sm:text-sm text-slate-300/90 font-medium mt-1 leading-relaxed line-clamp-2">
                {service.subtitle}
              </p>
            )}

            {/* Feature List (3-4 concise items in compact 2-column grid) */}
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {featureList.slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 font-medium truncate">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 stroke-[2.5]" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. BOTTOM ACTION BUTTONS (NO PRICE, NO CART, NO BUY BUTTONS) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-800/80">
            {/* Direct Details Page Navigation CTA Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(e);
              }}
              className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-300 font-bold text-xs sm:text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm group/btn"
              title={isBn ? "সার্ভিসের বিস্তারিত তথ্য দেখুন" : "View comprehensive service details"}
            >
              <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            {/* Telegram Direct Support Button */}
            <a
              href="https://t.me/forid78687"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>{isBn ? "টেলিগ্রামে যোগাযোগ" : "Chat on Telegram"}</span>
            </a>

            {/* Support Page Navigation Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${locale}/support`);
              }}
              className="flex-1 min-w-[125px] flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/40 font-bold text-xs sm:text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
            >
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>{isBn ? "সাপোর্ট পেজ" : "Contact Support"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product-${service.id}`}
      onClick={handleCardClick}
      className={`group relative glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden border transition-all duration-300 transform-gpu cursor-pointer font-sans min-h-[460px] sm:min-h-[480px] ${
        isHighlighted
          ? "border-rose-500 ring-2 ring-rose-500/40 shadow-2xl shadow-rose-500/20 bg-slate-900/90"
          : "border-white/10 hover:border-cyan-500/40"
      }`}
    >
      {/* Radial Hover Glow Accent (Desktop Only to save mobile GPU) */}
      <div className="hidden sm:block absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />

      <div>
        {/* 1. TOP BANNER LOGO CONTAINER */}
        <div className="relative w-full h-32 sm:h-36 rounded-xl bg-slate-950/80 border border-white/10 p-2 mb-3.5 group-hover:border-cyan-500/30 transition-all flex items-center justify-center">
          <div className="w-full h-full rounded-lg bg-white/95 p-3 flex items-center justify-center shadow-inner relative overflow-hidden">
            {/* ADMIN CONTROLS (PIN, EDIT & DELETE BUTTONS) */}
            {isAdmin && (
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTogglePin) onTogglePin(service);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-black rounded-full shadow flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
                    isPinned
                      ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30"
                      : "bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-500/50"
                  }`}
                  title={isPinned ? (isBn ? "পিন সরানো (Unpin)" : "Unpin Service") : (isBn ? "উপরে পিন করুন (Pin to Top)" : "Pin Service to Top")}
                >
                  <Pin className={`w-3 h-3 stroke-[2.5] ${isPinned ? "fill-slate-950 text-slate-950" : "text-cyan-400"}`} />
                  <span>{isPinned ? (isBn ? "পিন্ড" : "Pinned") : (isBn ? "পিন" : "Pin")}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEdit) onEdit(service);
                  }}
                  className="px-2 py-0.5 text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 rounded-full shadow flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/60"
                  title="Edit Card (Admin Only)"
                >
                  <Pencil className="w-3 h-3 stroke-[2.5]" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete(service);
                  }}
                  className="px-2 py-0.5 text-[10px] font-black bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white rounded-full shadow flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-400/60"
                  title="Delete Card (Admin Only)"
                >
                  <Trash2 className="w-3 h-3 stroke-[2.5]" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            {hasExplicitCustomImage && !imgError ? (
              <img
                src={customImgUrl}
                alt={service.title}
                loading="lazy"
                decoding="async"
                width={96}
                height={96}
                className="max-h-20 max-w-[80%] sm:max-h-24 object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : hasSvgLogo ? (
              <BrandLogoSvg logoType={service.logoType} title={service.title} />
            ) : !logoError ? (
              <img
                src={displayLogo}
                alt={service.title}
                loading="lazy"
                decoding="async"
                width={96}
                height={96}
                className="max-h-20 max-w-[80%] sm:max-h-24 object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => {
                  if (!logoError) setLogoError(true);
                  else setImgError(true);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-cyan-400">
                <IconComponent className="w-8 h-8 stroke-[1.8]" />
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">{service.category}</span>
              </div>
            )}

            {/* Heart Favorite Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
              className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center backdrop-blur-md z-10 border border-slate-800"
              aria-label="Add to Favorites"
            >
              <Heart className={`w-3 h-3 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* FLOATING BADGE CHIP */}
            {!isSoldOut ? (
              <span className="absolute top-1.5 right-1.5 px-2 py-0.5 text-[10px] font-extrabold bg-[#0f172a]/95 text-cyan-400 border border-cyan-500/40 rounded-full backdrop-blur-md shadow flex items-center gap-1 z-10">
                ⚡ {cleanBadge}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 px-2.5 py-0.5 text-[10px] font-extrabold bg-rose-600 text-white rounded-full uppercase backdrop-blur-md shadow z-10 tracking-wider">
                STOCK OUT
              </span>
            )}
          </div>
        </div>

        {/* 2. CATEGORY ICON, CATEGORY BADGE & DURATION/VALIDITY BADGE */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <div className="w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-500/30 p-1 flex items-center justify-center text-cyan-400 shrink-0">
            <IconComponent className="w-3 h-3 stroke-[2.2]" />
          </div>
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-slate-900/90 text-slate-300 border border-slate-700/60 rounded">
            {categoryBadgeText}
          </span>
          {(service.duration || service.validity) && (
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1 shadow-sm">
              <Clock className="w-2.5 h-2.5 stroke-[2.5] text-cyan-400" />
              <span>{service.duration || service.validity}</span>
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 tracking-tight">
          {displayTitle}
        </h3>

        {service.subtitle && (
          <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">
            {service.subtitle}
          </p>
        )}

        {/* 3. RATING & STOCK STATUS ROW */}
        <div className="my-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-white text-xs">{service.rating || 4.9}</span>
            <span className="text-slate-400 text-[10px]">({service.reviews || 120})</span>
          </div>

          {!isSoldOut ? (
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isBn ? "স্টক আছে" : "In Stock"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-400 font-bold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              <span>{isBn ? "স্টক শেষ" : "Stock Out"}</span>
            </div>
          )}
        </div>

        {/* 4. CONCISE FEATURE CHIPS (Max 2 items) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1 my-2">
          {featureList.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium truncate">
              <Check className="w-3 h-3 text-cyan-400 shrink-0 stroke-[3]" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BOTTOM PRICING & ACTION BUTTONS */}
      {!isWideCard ? (
        <div className="pt-2.5 border-t border-slate-800/80 mt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight font-sans">
                ৳{Number(service.price).toFixed(2)}
              </span>
              {service.usdPrice ? (
                <span className="text-xs text-slate-400 font-medium font-sans">
                  ({service.usdPrice})
                </span>
              ) : calcOriginalPrice > service.price ? (
                <span className="text-[10px] sm:text-xs text-slate-500 line-through font-normal">
                  ৳{calcOriginalPrice}
                </span>
              ) : null}
            </div>

            {discountPercent > 0 && !service.usdPrice && (
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded uppercase">
                -{discountPercent}% {isBn ? "ছাড়" : "OFF"}
              </span>
            )}
          </div>

          {/* CTA BUTTONS */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-lg border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isBn ? "কার্ট" : "Cart"}</span>
            </button>

            {!isSoldOut ? (
              <button
                onClick={handleBuy}
                className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>{isBn ? "কিনুন" : "BUY"}</span>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-xs rounded-lg shadow-md shadow-rose-600/30 cursor-not-allowed uppercase"
              >
                <span>{isBn ? "স্টক শেষ" : "STOCK OUT"}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-800/80 mt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(e);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <a
            href="https://t.me/forid78687"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wide shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
            <span>{isBn ? "টেলিগ্রাম" : "Telegram"}</span>
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/${locale}/support`);
            }}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isBn ? "সাপোর্ট" : "Support"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(ServiceCard);



