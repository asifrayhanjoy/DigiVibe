import { CategoryId } from "@/types";

/**
 * Strict Category Alias Dictionary
 * Maps all user-facing URL query parameter aliases, slugs, and label variations to canonical database category identifiers.
 */
export const CATEGORY_ALIASES: Record<string, CategoryId> = {
  // All Products
  all: "all",
  "all-products": "all",
  "all products": "all",

  // AI Tools & Subscriptions
  ai: "subscriptions",
  "ai-tools": "subscriptions",
  "ai tools": "subscriptions",
  subscriptions: "subscriptions",
  subscription: "subscriptions",
  sub: "subscriptions",
  subs: "subscriptions",
  tools: "subscriptions",
  tool: "subscriptions",

  // Social Media Service (SMM)
  social: "smm",
  "social-media": "smm",
  "social media": "smm",
  "social-media-service": "smm",
  "social media service": "smm",
  smm: "smm",
  media: "smm",

  // IP & Proxies
  proxies: "ip",
  proxy: "ip",
  ip: "ip",
  "ip-proxies": "ip",
  "ip proxies": "ip",
  "ip & proxies": "ip",
  "ip and proxies": "ip",

  // Email / Accounts
  email: "email",
  emails: "email",
  "email-accounts": "email",
  "email accounts": "email",
  "email / accounts": "email",
  "email and accounts": "email",
  "email & accounts": "email",
  account: "email",
  accounts: "email",
  mail: "email",
  mails: "email",
  gmail: "email",
  pva: "email",

  // VPN Services
  vpn: "vpn",
  vpns: "vpn",
  "vpn-services": "vpn",
  "vpn services": "vpn",
  "vpn service": "vpn",

  // Telegram
  telegram: "telegram",
  tg: "telegram",
  "telegram-services": "telegram",
  "telegram service": "telegram",

  // Hosting
  hosting: "hosting",
  host: "hosting",
  server: "hosting",
  servers: "hosting",
  "web-hosting": "hosting",
  "web hosting": "hosting",

  // Student Service
  student: "student",
  students: "student",
  "student-service": "student",
  "student service": "student",
  academic: "student",
  education: "student",

  // Advanced Tech
  tech: "tech",
  "advanced-tech": "tech",
  "advanced tech": "tech",
  advanced_tech: "tech",

  // AI & Voice Automation
  "ai-voice": "ai-voice",
  "ai voice": "ai-voice",
  ai_voice: "ai-voice",
  "voice-automation": "ai-voice",
  "voice automation": "ai-voice",

  // Digital Security
  security: "security",
  "digital-security": "security",
  "digital security": "security",
  digital_security: "security",

  // Media & Marketing
  "media-marketing": "media-marketing",
  "media marketing": "media-marketing",
  media_marketing: "media-marketing",
  mediamarketing: "media-marketing",
  "marketing-design": "media-marketing",

  // Smart Utilities
  utilities: "utilities",
  utility: "utilities",
  "smart-utilities": "utilities",
  "smart utilities": "utilities",
  smart_utilities: "utilities",

  // Advanced Service (Legacy)
  advanced: "advanced",
  "advanced-service": "advanced",
  "advanced service": "advanced",
  advanced_service: "advanced",
  rdp: "advanced",
};

/**
 * Canonical to official public URL slug mapping.
 */
export const CANONICAL_TO_SLUG: Record<CategoryId, string> = {
  all: "all",
  vpn: "vpn",
  subscriptions: "ai",
  ip: "proxies",
  smm: "social",
  email: "email",
  telegram: "telegram",
  student: "student",
  hosting: "hosting",
  tech: "tech",
  "ai-voice": "ai-voice",
  security: "security",
  "media-marketing": "media-marketing",
  utilities: "utilities",
  advanced: "advanced",
  "advanced-service": "advanced",
};

/**
 * Official public URL slug to canonical CategoryId mapping.
 */
export const SLUG_TO_CANONICAL: Record<string, CategoryId> = {
  all: "all",
  vpn: "vpn",
  ai: "subscriptions",
  proxies: "ip",
  social: "smm",
  email: "email",
  telegram: "telegram",
  student: "student",
  hosting: "hosting",
  tech: "tech",
  "advanced-tech": "tech",
  "ai-voice": "ai-voice",
  security: "security",
  "digital-security": "security",
  "media-marketing": "media-marketing",
  utilities: "utilities",
  "smart-utilities": "utilities",
  advanced: "advanced",
};

export const TECH_SERVICE_IDS = new Set([
  "adv-web-development",
  "adv-custom-software-app-development",
  "adv-fullstack-saas-development",
  "adv-thirdparty-api-integration",
  "adv-bug-fixing-coding-support",
  "adv-web-performance-optimization",
  "adv-payment-gateway-integration",
  "adv-devops-cloud-automation",
  "adv-domain-hosting-consultancy",
]);

export const AI_VOICE_SERVICE_IDS = new Set([
  "adv-full-device-ai-control",
  "adv-voice-note-summary",
  "adv-smart-email-drafting",
  "adv-smart-clipboard-manager",
  "adv-live-language-translation",
  "adv-smart-reminder-scheduling",
  "adv-meeting-minutes-generator",
  "adv-smart-task-assigner",
  "adv-auto-contact-finder",
]);

export const SECURITY_SERVICE_IDS = new Set([
  "adv-cyber-security-audit",
  "adv-voice-password-biometric-lock",
  "adv-password-security-reminder",
  "adv-web-app-location-tracking",
  "adv-phone-location-tracing",
  "adv-realtime-device-location-tracking",
  "adv-remote-phone-control",
  "adv-device-monitoring-setup",
]);

export const MEDIA_MARKETING_SERVICE_IDS = new Set([
  "adv-video-editor-service",
  "adv-video-editing-color-grading",
  "adv-yt-fb-growth-masterclass",
  "adv-social-comment-moderator",
  "adv-graphic-design-service",
  "adv-ui-ux-design-service",
  "adv-voiceover-audio-editing",
  "adv-cv-portfolio-linkedin-optimization",
  "adv-job-apply-cv-optimizer",
]);

export const UTILITIES_SERVICE_IDS = new Set([
  "adv-rent-utility-bill-payer",
  "adv-travel-route-planner",
  "adv-birthday-event-reminder",
  "adv-smart-alarm-weather",
  "adv-mobile-pc-remote-control",
  "adv-custom-browser-extension",
  "adv-restaurant-qr-menu",
  "adv-local-pos-software",
]);

/**
 * Resolves any category parameter, alias, or product item to its canonical CategoryId.
 * Guarantees zero substring collisions (e.g. 'email' will NEVER match 'ai', 'subscriptions' will NEVER match 'ip').
 */
export function resolveCanonicalCategory(
  input?: string | { id?: string; category?: string; title?: string } | null
): CategoryId {
  if (!input) return "all";

  // If input is a raw category string or alias
  if (typeof input === "string") {
    const rawNormalized = input.toLowerCase().trim();
    if (!rawNormalized || rawNormalized === "all") return "all";

    // 1. Direct dictionary match
    if (CATEGORY_ALIASES[rawNormalized]) {
      return CATEGORY_ALIASES[rawNormalized];
    }

    // Normalized spacing without punctuation
    const cleanNormalized = rawNormalized.replace(/[/\\_-]+/g, " ").trim();
    if (CATEGORY_ALIASES[cleanNormalized]) {
      return CATEGORY_ALIASES[cleanNormalized];
    }

    // 2. Strict keyword matching in safe priority order
    // Email / Accounts FIRST so words like 'email' or 'gmail' are never caught by 'ai'
    if (
      cleanNormalized.includes("email") ||
      cleanNormalized.includes("mail") ||
      cleanNormalized.includes("gmail") ||
      cleanNormalized.includes("account") ||
      cleanNormalized.includes("pva")
    ) {
      return "email";
    }

    // IP & Proxies (check with word boundaries for 'ip')
    if (
      cleanNormalized.includes("proxy") ||
      cleanNormalized.includes("proxies") ||
      cleanNormalized.includes("socks") ||
      /\bip\b/i.test(cleanNormalized)
    ) {
      return "ip";
    }

    // Social Media / SMM
    if (
      cleanNormalized.includes("social") ||
      cleanNormalized.includes("smm") ||
      cleanNormalized.includes("media")
    ) {
      return "smm";
    }

    // VPN Services
    if (cleanNormalized.includes("vpn")) {
      return "vpn";
    }

    // Telegram
    if (cleanNormalized.includes("telegram") || /\btg\b/i.test(cleanNormalized)) {
      return "telegram";
    }

    // Hosting
    if (
      cleanNormalized.includes("hosting") ||
      cleanNormalized.includes("cpanel") ||
      cleanNormalized.includes("server")
    ) {
      return "hosting";
    }

    // Student Service
    if (
      cleanNormalized.includes("student") ||
      cleanNormalized.includes("academic") ||
      cleanNormalized.includes("thesis") ||
      cleanNormalized.includes("assignment")
    ) {
      return "student";
    }

    // 5 Split Advanced Categories
    if (cleanNormalized.includes("marketing")) {
      return "media-marketing";
    }
    if (cleanNormalized.includes("security")) {
      return "security";
    }
    if (cleanNormalized.includes("utilit")) {
      return "utilities";
    }
    if (cleanNormalized.includes("voice")) {
      return "ai-voice";
    }
    if (cleanNormalized.includes("tech")) {
      return "tech";
    }

    // Advanced Service
    if (cleanNormalized.includes("advanced") || cleanNormalized.includes("rdp")) {
      return "advanced";
    }

    // AI Tools & Subscriptions (MUST use word boundary for 'ai' and check last)
    if (
      /\bai\b/i.test(cleanNormalized) ||
      cleanNormalized.includes("subscription") ||
      cleanNormalized.includes("sub") ||
      /\btool(s)?\b/i.test(cleanNormalized)
    ) {
      return "subscriptions";
    }

    return "all";
  }

  // If input is a product item object
  const id = (input.id || (input as any).productId || (input as any)._id || "").toString().toLowerCase().trim();
  const cat = (input.category || "").toString().toLowerCase().trim();
  const title = (input.title || "").toString().toLowerCase().trim();

  // 0. Handle 'all' explicitly
  if (cat === "all" || id === "all") return "all";

  // 1. Strict Student Items Identification
  if (
    cat === "student" ||
    cat === "students" ||
    cat === "student-service" ||
    id.startsWith("student-") ||
    id === "adv-assignment-thesis-typing" ||
    id === "adv-student-project-presentation" ||
    id === "adv-cv-resume-writing" ||
    id === "adv-school-coaching-management"
  ) {
    return "student";
  }

  // 1b. Strict ID Prefix & Explicit ID Isolation (100% reliable for reference catalog items)
  if (TECH_SERVICE_IDS.has(id)) return "tech";
  if (AI_VOICE_SERVICE_IDS.has(id)) return "ai-voice";
  if (SECURITY_SERVICE_IDS.has(id)) return "security";
  if (MEDIA_MARKETING_SERVICE_IDS.has(id)) return "media-marketing";
  if (UTILITIES_SERVICE_IDS.has(id)) return "utilities";

  if (id.startsWith("vpn-")) return "vpn";
  if (id.startsWith("sub-")) return "subscriptions";
  if (id.startsWith("ip-")) return "ip";
  if (id.startsWith("smm-")) return "smm";
  if (id.startsWith("email-")) return "email";
  if (id.startsWith("telegram-")) return "telegram";
  if (id.startsWith("adv-") || id.startsWith("advanced-")) return "tech";
  if (id.startsWith("hosting-")) return "hosting";

  // 2. Direct Alias Dictionary Mapping on Category property
  if (cat && CATEGORY_ALIASES[cat]) {
    return CATEGORY_ALIASES[cat];
  }
  const cleanCat = cat.replace(/[/\\_-]+/g, " ").trim();
  if (cleanCat && CATEGORY_ALIASES[cleanCat]) {
    return CATEGORY_ALIASES[cleanCat];
  }

  // 3. Strict Category Property Keyword Matching (Ordered safely)
  if (cleanCat.includes("student") || cleanCat.includes("academic") || cleanCat.includes("thesis") || cleanCat.includes("assignment")) return "student";
  if (cleanCat.includes("email") || cleanCat.includes("mail") || cleanCat.includes("account") || cleanCat.includes("pva")) return "email";
  if (cleanCat.includes("proxy") || cleanCat.includes("proxies") || cleanCat.includes("socks") || /\bip\b/i.test(cleanCat)) return "ip";
  if (cleanCat.includes("social") || cleanCat.includes("smm") || cleanCat.includes("media")) return "smm";
  if (cleanCat.includes("vpn")) return "vpn";
  if (cleanCat.includes("telegram") || /\btg\b/i.test(cleanCat)) return "telegram";
  if (cleanCat.includes("advanced") || cleanCat.includes("rdp")) return "advanced";
  if (cleanCat.includes("hosting") || cleanCat.includes("server") || cleanCat.includes("cpanel")) return "hosting";
  if (/\bai\b/i.test(cleanCat) || cleanCat.includes("subscription") || cleanCat.includes("sub") || /\btool(s)?\b/i.test(cleanCat)) return "subscriptions";

  // 4. Title Keyword Isolation
  if (
    title.includes("অ্যাসাইনমেন্ট") ||
    title.includes("থিসিস") ||
    title.includes("টাইপিং") ||
    title.includes("thesis typing") ||
    title.includes("assignment typing") ||
    title.includes("প্রেজেন্টেশন") ||
    title.includes("presentation") ||
    title.includes("পাওয়ারপয়েন্ট") ||
    title.includes("powerpoint") ||
    title.includes("স্টুডেন্ট প্রজেক্ট") ||
    title.includes("student project") ||
    title.includes("স্টুডেন্ট") ||
    title.includes("student") ||
    title.includes("কোচিং") ||
    title.includes("স্কুল ম্যানেজমেন্ট") ||
    title.includes("school management") ||
    title.includes("coaching") ||
    title.includes("সিভি রাইটিং") ||
    title.includes("resume writing") ||
    title.includes("বায়োডাটা তৈরি")
  ) {
    return "student";
  }
  if (title.includes("gmail") || title.includes("mail") || title.includes("outlook") || title.includes("hotmail") || title.includes("pva email")) return "email";
  if (title.includes("proxy") || title.includes("proxies") || title.includes("socks") || /\bip\b/i.test(title)) return "ip";
  if (title.includes("instagram") || title.includes("tiktok") || title.includes("facebook") || title.includes("twitter") || title.includes("youtube subscriber") || title.includes("follower")) return "smm";
  if (title.includes("vpn") || title.includes("wireguard") || title.includes("openvpn")) return "vpn";
  if (title.includes("telegram")) return "telegram";
  if (title.includes("enterprise rdp") || title.includes("server rdp") || title.includes("advanced service") || title.includes("ওয়েব ডেভেলপমেন্ট") || title.includes("লোকেশন ট্রেসিং") || title.includes("web development") || title.includes("ভিডিও এডিটর") || title.includes("video editor") || title.includes("গ্রোথ") || title.includes("মাস্টারক্লাস") || title.includes("এক্সটেনশন") || title.includes("extension") || title.includes("রিমোট") || title.includes("remote") || title.includes("সিভি") || title.includes("cv") || title.includes("পোর্টফোলিও") || title.includes("portfolio") || title.includes("লিঙ্কডইন") || title.includes("সফটওয়্যার") || title.includes("software") || title.includes("অ্যাপ") || title.includes("app development") || title.includes("সাইবার সিকিউরিটি") || title.includes("cyber security") || title.includes("হোস্টিং কনসালটেন্সি") || title.includes("hosting consultancy") || title.includes("ভিডিও এডিটিং") || title.includes("কালার গ্রেডিং") || title.includes("color grading") || title.includes("বাগ ফিক্সিং") || title.includes("bug fixing") || title.includes("কোডিং সাপোর্ট") || title.includes("coding support") || title.includes("পেমেন্ট গেটওয়ে") || title.includes("payment gateway") || title.includes("গ্রাফিক ডিজাইন") || title.includes("graphic design") || title.includes("ভয়েসওভার") || title.includes("ভয়েসওভার") || title.includes("voiceover") || title.includes("অডিও এডিটিং") || title.includes("audio editing") || title.includes("ইউআই/ইউএক্স") || title.includes("ui/ux") || title.includes("ui ux") || title.includes("প্রোটোটাইপ") || title.includes("prototype") || title.includes("ফুল-স্ট্যাক") || title.includes("full-stack") || title.includes("fullstack") || title.includes("এসএএএস") || title.includes("saas") || title.includes("এপিআই") || title.includes("api development") || title.includes("api integration") || title.includes("পারফরম্যান্স") || title.includes("performance") || title.includes("web vitals") || title.includes("ভাইটালস") || title.includes("ডেভপস") || title.includes("devops") || title.includes("ডেপ্লয়মেন্ট") || title.includes("cloud automation") || title.includes("কিউআর মেনু") || title.includes("qr menu") || title.includes("রেস্টুরেন্ট মেনু") || title.includes("restaurant menu") || title.includes("পিওএস") || title.includes("pos") || title.includes("point of sales")) return "advanced";
  if (title.includes("hosting") || title.includes("cpanel") || title.includes("vps")) return "hosting";
  if (title.includes("capcut") || title.includes("gemini") || title.includes("chatgpt") || title.includes("netflix") || title.includes("canva") || title.includes("youtube premium") || title.includes("prime video") || title.includes("linkedin")) return "subscriptions";

  return "all";
}

/**
 * Canonical Category Resolver (Backwards-compatible wrapper)
 */
export function getCanonicalCategory(
  item?: { id?: string; category?: string; title?: string } | string | null
): CategoryId {
  return resolveCanonicalCategory(item);
}

/**
 * Maps a canonical category or alias to its preferred active URL query parameter slug.
 * E.g. 'subscriptions' -> 'ai', 'smm' -> 'social', 'ip' -> 'proxies', 'email' -> 'email', 'vpn' -> 'vpn', 'telegram' -> 'telegram', 'hosting' -> 'hosting', 'advanced' -> 'advanced'.
 */
export function getCategoryQueryParam(categoryOrAlias?: string, fallbackCanonical?: CategoryId): string {
  if (!categoryOrAlias || categoryOrAlias === "all") return "";
  const normalized = categoryOrAlias.toLowerCase().trim();

  // If already one of the official slugs, return it directly
  if (SLUG_TO_CANONICAL[normalized]) {
    return normalized;
  }

  const canonical = fallbackCanonical || resolveCanonicalCategory(categoryOrAlias);
  if (canonical === "all") return "";

  return CANONICAL_TO_SLUG[canonical] || canonical;
}

/**
 * Checks if an item's category matches the target active category, resolving aliases symmetrically.
 */
export function isCategoryMatch(
  itemCategory?: string | { id?: string; category?: string; title?: string } | null,
  activeCategory?: string | null
): boolean {
  if (!activeCategory || activeCategory === "all") return true;
  const activeCanonical = resolveCanonicalCategory(activeCategory);
  if (activeCanonical === "all") return true;

  const itemCanonical = resolveCanonicalCategory(itemCategory);
  if (itemCanonical === activeCanonical) return true;
  if (activeCanonical === "advanced") {
    return ["tech", "ai-voice", "security", "media-marketing", "utilities", "advanced"].includes(itemCanonical);
  }
  return false;
}
