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

  // Advanced Service
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
  hosting: "hosting",
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
  hosting: "hosting",
  advanced: "advanced",
};

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

  // 1. Strict ID Prefix Isolation (100% reliable for reference catalog items)
  if (id.startsWith("vpn-")) return "vpn";
  if (id.startsWith("sub-")) return "subscriptions";
  if (id.startsWith("ip-")) return "ip";
  if (id.startsWith("smm-")) return "smm";
  if (id.startsWith("email-")) return "email";
  if (id.startsWith("telegram-")) return "telegram";
  if (id.startsWith("adv-") || id.startsWith("advanced-")) return "advanced";
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
  if (cleanCat.includes("email") || cleanCat.includes("mail") || cleanCat.includes("account") || cleanCat.includes("pva")) return "email";
  if (cleanCat.includes("proxy") || cleanCat.includes("proxies") || cleanCat.includes("socks") || /\bip\b/i.test(cleanCat)) return "ip";
  if (cleanCat.includes("social") || cleanCat.includes("smm") || cleanCat.includes("media")) return "smm";
  if (cleanCat.includes("vpn")) return "vpn";
  if (cleanCat.includes("telegram") || /\btg\b/i.test(cleanCat)) return "telegram";
  if (cleanCat.includes("advanced") || cleanCat.includes("rdp")) return "advanced";
  if (cleanCat.includes("hosting") || cleanCat.includes("server") || cleanCat.includes("cpanel")) return "hosting";
  if (/\bai\b/i.test(cleanCat) || cleanCat.includes("subscription") || cleanCat.includes("sub") || /\btool(s)?\b/i.test(cleanCat)) return "subscriptions";

  // 4. Title Keyword Isolation
  if (title.includes("gmail") || title.includes("mail") || title.includes("outlook") || title.includes("hotmail") || title.includes("pva email")) return "email";
  if (title.includes("proxy") || title.includes("proxies") || title.includes("socks") || /\bip\b/i.test(title)) return "ip";
  if (title.includes("instagram") || title.includes("tiktok") || title.includes("facebook") || title.includes("twitter") || title.includes("youtube subscriber") || title.includes("follower")) return "smm";
  if (title.includes("vpn") || title.includes("wireguard") || title.includes("openvpn")) return "vpn";
  if (title.includes("telegram")) return "telegram";
  if (title.includes("enterprise rdp") || title.includes("server rdp") || title.includes("advanced service")) return "advanced";
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
  return itemCanonical === activeCanonical;
}
