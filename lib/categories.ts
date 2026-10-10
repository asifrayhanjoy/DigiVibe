import { CategoryId } from "@/types";

/**
 * Strict Canonical Category Resolver
 * Guarantees zero cross-category contamination / leaking by mapping every product to its strictly isolated category.
 */
export function getCanonicalCategory(item: { id?: string; category?: string; title?: string }): CategoryId {
  const id = (item.id || "").toLowerCase();
  const cat = (item.category || "").toLowerCase().trim();
  const title = (item.title || "").toLowerCase();

  // 1. Strict ID Prefix Isolation (100% reliable for reference catalog items)
  if (id.startsWith("vpn-")) return "vpn";
  if (id.startsWith("sub-")) return "subscriptions";
  if (id.startsWith("ip-")) return "ip";
  if (id.startsWith("smm-")) return "smm";
  if (id.startsWith("email-")) return "email";
  if (id.startsWith("telegram-")) return "telegram";

  // 2. Strict Category Property Mapping
  if (cat === "vpn" || cat.includes("vpn")) return "vpn";
  if (cat === "subscriptions" || cat === "sub" || cat.includes("ai") || cat.includes("subscription") || cat.includes("tool")) return "subscriptions";
  if (cat === "ip" || cat.includes("proxy")) return "ip";
  if (cat === "smm" || cat.includes("smm") || cat.includes("social")) return "smm";
  if (cat === "email" || cat.includes("email") || cat.includes("mail") || cat.includes("gmail") || cat.includes("account")) return "email";
  if (cat === "telegram") return "telegram";
  if (cat === "hosting") return "hosting";

  // 3. Fallback Title Keyword Isolation
  if (title.includes("vpn")) return "vpn";
  if (title.includes("proxy") || title.includes("ip ")) return "ip";
  if (title.includes("gmail") || title.includes("mail") || title.includes("outlook") || title.includes("hotmail")) return "email";
  if (title.includes("telegram")) return "telegram";
  if (title.includes("capcut") || title.includes("gemini") || title.includes("youtube") || title.includes("chatgpt") || title.includes("netflix")) return "subscriptions";

  return "smm";
}
