import { vpnProducts, additionalVpnProducts, existingVpnProducts, allVpnServices } from "./products";
import { simOfferProducts } from "./simOffers";

export { vpnProducts, additionalVpnProducts, existingVpnProducts, allVpnServices, simOfferProducts };

export const CATEGORIES = [
  { id: "all", label: "All Products", labelEn: "All Products", labelBn: "সকল প্রোডাক্টস", icon: "LayoutGrid", count: 437 },
  { id: "vpn", label: "VPN Services", labelEn: "VPN Services", labelBn: "ভিপিএন সার্ভিস", icon: "ShieldCheck", count: 38 },
  { id: "sim", label: "SIM Offers", labelEn: "SIM Offers", labelBn: "সিম অফার", icon: "Smartphone", count: 385 },
  { id: "subscriptions", label: "AI Tools", labelEn: "AI Tools", labelBn: "এআই ও সাবস্ক্রিপশন", icon: "Sparkles", count: 6 },
  { id: "ip", label: "IP & Proxies", labelEn: "IP & Proxies", labelBn: "আইপি ও প্রক্সি", icon: "Globe", count: 3 },
  { id: "smm", label: "SMM Growth", labelEn: "SMM Growth", labelBn: "এসএমএম গ্রোথ", icon: "TrendingUp", count: 3 },
  { id: "email", label: "Email / Accounts", labelEn: "Email / Accounts", labelBn: "ইমেইল ও অ্যাকাউন্টস", icon: "Mail", count: 2 },
];

export const SERVICES = [
  // --- ALL 38 VPN SERVICES (PREVIOUS + NEW 20 WITH +10 BDT PRICING) ---
  ...allVpnServices.map((vpn) => ({
    id: vpn.id,
    title: vpn.title,
    category: "vpn",
    badge: vpn.badge || vpn.subtitle || "100% Full Fresh VPN ✅",
    rating: vpn.rating || 4.8,
    reviews: vpn.reviews || 120,
    price: vpn.price,
    originalPrice: vpn.originalPrice || (vpn.price + 20),
    validity: vpn.duration || "7 Days",
    delivery: "Instant Auto-Delivery",
    stock: vpn.inStock === false ? "Stock Out" : (vpn.stock || "In Stock"),
    icon: "ShieldCheck",
    logo: vpn.logo,
    features: vpn.features || ["Full Warranty Support", "High Speed Connection", "Instant Auto Delivery"],
    popular: !!vpn.popular
  })),

  // --- ALL 18 SIM OFFERS (EXACT SCREENSHOT OFFERS +10 BDT) ---
  ...simOfferProducts.map((sim) => ({
    id: sim.id,
    title: sim.title,
    subtitle: sim.subtitle,
    category: "sim",
    operator: sim.operator,
    badge: sim.badge || sim.subtitle,
    rating: 4.8,
    reviews: 150,
    price: sim.price,
    originalPrice: sim.originalPrice || (sim.price + 20),
    validity: sim.validity || "30 Days",
    delivery: "Drive Recharge / Instant",
    stock: sim.stock || "In Stock",
    icon: "Smartphone",
    logo: sim.logo || sim.image,
    image: sim.image,
    features: ["100% Guaranteed Activation", "Direct Mobile Recharge", "24/7 Support"],
    popular: false
  })),

  // --- PREMIUM SUBSCRIPTIONS ---
  {
    id: "sub-chatgpt-plus",
    title: "ChatGPT Plus (GPT-4o & Sora) 1M",
    category: "subscriptions",
    badge: "Trending AI ✨",
    rating: 5.0,
    reviews: 840,
    price: 480,
    originalPrice: 2400,
    validity: "1 Month",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock (38 available)",
    icon: "Sparkles",
    features: [
      "Access to GPT-4o, GPT-4 Turbo & DALL-E 3",
      "Custom GPTs & Sora Video Creator Access",
      "5x Faster Response Speed",
      "Private Email Login / Shared VIP Slot",
      "30 Days Replacement Guarantee"
    ],
    popular: true
  },
  {
    id: "sub-youtube-premium-6m",
    title: "YouTube Premium 6-Month Family Invite",
    category: "subscriptions",
    badge: "No Ads 🎵",
    rating: 4.9,
    reviews: 620,
    price: 320,
    originalPrice: 1200,
    validity: "6 Months",
    delivery: "Email Invitation within 5 Mins",
    stock: "In Stock (50 available)",
    icon: "PlayCircle",
    features: [
      "100% Ad-Free Video Playback",
      "Background Play & Offline Downloads",
      "YouTube Music Premium Included",
      "Upgrade on YOUR OWN Personal Gmail",
      "Full 6-Month Warranty"
    ],
    popular: true
  },
  {
    id: "sub-netflix-4k",
    title: "Netflix 4K Ultra HD Shared Profile",
    category: "subscriptions",
    badge: "4K UHD 🍿",
    rating: 4.8,
    reviews: 730,
    price: 390,
    originalPrice: 1400,
    validity: "1 Month",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock (14 available)",
    icon: "Tv",
    features: [
      "4K Ultra HD + HDR Quality",
      "Private PIN Locked Screen Profile",
      "Works on Smart TV, PC, Mobile & Console",
      "100% Non-Hold Guaranteed Account"
    ],
    popular: true
  },
  {
    id: "sub-capcut-pro",
    title: "CapCut Pro 1-Year PC & Mobile Pass",
    category: "subscriptions",
    badge: "Editor Essential 🎬",
    rating: 4.9,
    reviews: 310,
    price: 550,
    originalPrice: 2800,
    validity: "1 Year",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock (29 available)",
    icon: "Video",
    features: [
      "Unlock All Pro Transitions & Effects",
      "AI Smart Cutout & Auto Captions",
      "4K 60FPS Pro Export",
      "Works on PC, Mac & Mobile",
      "1-Year Full Replacement Warranty"
    ],
    popular: false
  },
  {
    id: "sub-telegram-premium-3m",
    title: "Telegram Premium 3-Month Gift Pass",
    category: "subscriptions",
    badge: "Fast Uploads ✈️",
    rating: 4.9,
    reviews: 240,
    price: 690,
    originalPrice: 1600,
    validity: "3 Months",
    delivery: "Direct Telegram Gift Link",
    stock: "In Stock (19 available)",
    icon: "Send",
    features: [
      "4GB File Upload Limit (Double Speed)",
      "Voice-to-Text Audio Message Conversion",
      "Exclusive Animated Stickers & Badges",
      "Direct Gift Activation via Username"
    ],
    popular: false
  },
  {
    id: "sub-google-one-2tb",
    title: "Gemini Advanced + Google One 2TB 1Y",
    category: "subscriptions",
    badge: "AI & Storage ☁️",
    rating: 5.0,
    reviews: 190,
    price: 890,
    originalPrice: 4500,
    validity: "1 Year",
    delivery: "Family Group Invite",
    stock: "In Stock (8 available)",
    icon: "Cloud",
    features: [
      "Gemini 1.5 Pro AI Model Access",
      "2,000 GB (2TB) Drive & Photos Storage",
      "Google Workspace Premium Features",
      "Upgrade directly on your Personal Gmail"
    ],
    popular: false
  },

  // --- IP & PROXY ---
  {
    id: "ip-residential-5gb",
    title: "Residential Rotating Proxy 5GB Bandwidth",
    category: "ip",
    badge: "100M+ IPs 🌐",
    rating: 4.9,
    reviews: 165,
    price: 750,
    originalPrice: 1800,
    validity: "30 Days",
    delivery: "Instant API Credentials",
    stock: "In Stock",
    icon: "Globe",
    features: [
      "Ethically Sourced Residential IPs",
      "HTTP/HTTPS/SOCKS5 Protocols",
      "Geo-Targeting (US, UK, DE, SG, BD)",
      "Sticky Session (Up to 30 Mins)"
    ],
    popular: false
  },
  {
    id: "ip-datacenter-ipv4",
    title: "Dedicated Datacenter IPv4 Proxy 10 Pack",
    category: "ip",
    badge: "1Gbps Speed 🚀",
    rating: 4.8,
    reviews: 110,
    price: 650,
    originalPrice: 1400,
    validity: "1 Month",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock",
    icon: "Server",
    features: [
      "10 Static Dedicated IPv4 Addresses",
      "1 Gbps Unlimited Bandwidth",
      "High Anonymity & Zero Logging",
      "Subnet Diversity Guaranteed"
    ],
    popular: false
  },
  {
    id: "ip-mobile-4g",
    title: "4G Mobile Proxy Bangladesh / USA 1-Day",
    category: "ip",
    badge: "Clean Carrier IP 📱",
    rating: 4.9,
    reviews: 84,
    price: 420,
    originalPrice: 900,
    validity: "24 Hours",
    delivery: "Instant Portal Control",
    stock: "In Stock",
    icon: "Radio",
    features: [
      "Real SIM Carrier IP Address",
      "Auto & Manual IP Rotation via API",
      "Zero Fraud Score for Accounts",
      "24h Unlimited Traffic"
    ],
    popular: false
  },

  // --- SOCIAL MEDIA MARKETING (SMM) ---
  {
    id: "smm-fb-followers",
    title: "Facebook Page Followers / Likes 1000 Pack",
    category: "smm",
    badge: "High Retention 👍",
    rating: 4.8,
    reviews: 440,
    price: 180,
    originalPrice: 500,
    validity: "Non-Drop 30D Refill",
    delivery: "Starts in 10-30 Mins",
    stock: "Auto Engine Ready",
    icon: "ThumbsUp",
    features: [
      "1000 High Quality Page Followers",
      "Safe for Monetized Pages",
      "Auto Refill Guarantee 30 Days",
      "Only Page Link Required (No Password)"
    ],
    popular: false
  },
  {
    id: "smm-tiktok-followers",
    title: "TikTok Real Active Followers 2000 Pack",
    category: "smm",
    badge: "Viral Boost 🎵",
    rating: 4.9,
    reviews: 310,
    price: 320,
    originalPrice: 800,
    validity: "Permanent",
    delivery: "Gradual Safe Speed",
    stock: "Auto Engine Ready",
    icon: "TrendingUp",
    features: [
      "2000 Real TikTok Followers",
      "Helps Unlock Live Streaming",
      "Non-Drop High Retention",
      "100% Safe Account Delivery"
    ],
    popular: false
  },
  {
    id: "smm-yt-watchtime",
    title: "YouTube 4000 Hours WatchTime Pack",
    category: "smm",
    badge: "Monetization Ready 💰",
    rating: 5.0,
    reviews: 260,
    price: 2400,
    originalPrice: 5500,
    validity: "Monetization Guarantee",
    delivery: "Delivered in 3-7 Days",
    stock: "Slot Open",
    icon: "Play",
    features: [
      "4000 Public Watch Hours",
      "Passed YPP Monetization Audit",
      "Real Organic Audience Views",
      "Full Replacement / Money Back Warranty"
    ],
    popular: true
  },

  // --- VERIFIED EMAIL ACCOUNTS ---
  {
    id: "email-gmail-10pack",
    title: "Fresh Verified Gmail Accounts 10 Pack",
    category: "email",
    badge: "Phone Verified 📧",
    rating: 4.9,
    reviews: 580,
    price: 290,
    originalPrice: 700,
    validity: "Lifetime Login",
    delivery: "Instant File Download (txt/csv)",
    stock: "In Stock (120 packs)",
    icon: "Mail",
    features: [
      "10 Fresh Gmail Accounts with Recovery Email",
      "100% Phone Number Verified (PVA)",
      "Unique Residential IP Created",
      "Format: email | password | recovery"
    ],
    popular: false
  },
  {
    id: "email-edu-student",
    title: "Verified .EDU Student Email Account",
    category: "email",
    badge: "Perks & Discounts 🎓",
    rating: 5.0,
    reviews: 420,
    price: 350,
    originalPrice: 1200,
    validity: "Lifetime Access",
    delivery: "Instant Auto-Delivery",
    stock: "In Stock (25 available)",
    icon: "GraduationCap",
    features: [
      "Official US .EDU University Email Address",
      "Unlocks GitHub Student Developer Pack",
      "Canva Pro, Notion & JetBrains Free Pass",
      "Amazon Prime 6-Month Free Trial Support"
    ],
    popular: true
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    role: "Freelance Video Editor",
    location: "Dhaka, Bangladesh",
    comment: "DigiVibe থেকে ChatGPT Plus আর CapCut Pro নিয়েছিলাম। পেমেন্ট করার সাথে সাথেই ইনস্ট্যান্ট অটো-ডেলিভারি পেয়ে গেছি! সার্ভিস কোয়ালিটি সেরা।",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    serviceBought: "ChatGPT Plus & CapCut Pro"
  },
  {
    id: 2,
    name: "Rahim Chowdhury",
    role: "Digital Marketer",
    location: "Chittagong, Bangladesh",
    comment: "NordVPN এবং GP 50GB ডাইভ প্যাক কিনেছি। বিকাশ দিয়ে পেমেন্ট করা খুব সহজ ছিল। সাপোর্ট টিম ২৪/৭ টেলিগ্রামে একটিভ থাকে।",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    serviceBought: "NordVPN 1-Year & GP Drive Pack"
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "UI/UX Designer",
    location: "Sylhet, Bangladesh",
    comment: "YouTube Premium এবং .EDU Student Email নিয়াছি। ইনস্ট্যান্টলি নিজের প্রাইভেট জিমেইলে এক্টিভ হয়ে গেছে। ধন্যবাদ ডিগিভাইব!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    serviceBought: "YouTube Premium & EDU Mail"
  }
];

export const FAQS = [
  {
    question: "পেমেন্ট করার পর সার্ভিস কত দ্রুত পাবো? (How fast is delivery?)",
    answer: "ডিগিভাইব সিস্টেমে অটোমেটেড ইনস্ট্যান্ট ডেলিভারি মেকানিজম যুক্ত করা আছে। বিকাশ, নগদ, রকেট বা ক্রিপ্টো পেমেন্ট সম্পূর্ণ হওয়ার ২-৫ মিনিটের মধ্যে আপনার স্ক্রিনে এবং দেওয়া WhatsApp/Email এ সার্ভিসের বিস্তারিত চলে যাবে।"
  },
  {
    question: "কোন গ্যারান্টি বা ওয়ারেন্টি আছে কি? (Is there any Warranty?)",
    answer: "হ্যাঁ! প্রতিটি সার্ভিসের জন্য আমরা মেয়াদের পূর্ণ মেয়াদী ওয়ারেন্টি সাপোর্ট প্রদান করি। কোন টেকনিক্যাল সমস্যা হলে ২৪ ঘণ্টার মধ্যে রিপ্লেসমেন্ট অথবা ১০০% মানি-ব্যাক গ্যারান্টি দেওয়া হয়।"
  },
  {
    question: "আমি কিভাবে পেমেন্ট সম্পন্ন করবো? (How to Pay?)",
    answer: "আপনি বাংলাদেশের জনপ্রিয় যেকোনো ডিজিটাল ওয়ালেট যেমন bKash (বিকাশ Send Money / Merchant), CellFin (সেলফিন), Rocket (রকেট) এবং আন্তর্জাতিক ক্রিপ্টো (USDT / Binance Pay) দিয়ে অনায়াসে পেমেন্ট করতে পারবেন।"
  },
  {
    question: "আমার নিজের পার্সোনাল ইমেইলে সাবস্ক্রিপশন নেওয়া সম্ভব? (Own Email Upgrade?)",
    answer: "হ্যাঁ! YouTube Premium, Gemini Advanced, Google One এর মত প্রোডাক্টসমূহ আপনার নিজের পার্সোনাল জিমেইলে ইনভাইট লিংকের মাধ্যমে এক্টিভেট করে দেওয়া হয়।"
  }
];
