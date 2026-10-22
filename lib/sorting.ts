/**
 * Strict Universal Alphabetical Comparator (A to Z)
 * 
 * Hierarchy Rules:
 * 1. Strips leading emojis, icons, and non-alphanumeric symbols so titles like
 *    "🧪 Nord VPN" sort under 'N', "🍋 Avg VPN" under 'A', "🍽️ Bitdefender" under 'B', etc.
 * 2. Numbers and numeric prefixes (e.g. "18 Month Gemini", "9 Proxy") group cleanly first.
 * 3. Letters sort strictly sequentially: A -> B -> C -> ... -> Z.
 * 4. Natural case-insensitive comparison with numeric sensitivity.
 */

export function cleanTitleForAlphabeticalSort(title?: string): string {
  if (!title) return "";
  // Strip leading emojis, symbols, and punctuation marks while preserving letters (\p{L}) and digits (\p{N})
  const stripped = title.replace(/^[^\p{L}\p{N}]+/gu, "").trim();
  return stripped || title.trim();
}

export function compareAlphabetical<T extends { title?: string }>(a: T, b: T): number {
  const titleA = a?.title || "";
  const titleB = b?.title || "";

  const keyA = cleanTitleForAlphabeticalSort(titleA);
  const keyB = cleanTitleForAlphabeticalSort(titleB);

  const cmp = keyA.localeCompare(keyB, undefined, { sensitivity: "base", numeric: true });
  if (cmp !== 0) return cmp;

  return titleA.localeCompare(titleB, undefined, { numeric: true });
}

/**
 * Strict Universal Product/Service Deduplication Utility
 * 
 * Prevents duplicate rendering of service cards across all categories,
 * searching, filtering, and initial loads.
 * 
 * Deduplication rules:
 * 1. Primary: Unique Product ID / Document ID.
 * 2. Secondary: Canonical product identity (category + normalized title + duration + price)
 *    to eliminate accidental double documents created in database or static seeds.
 */
export function deduplicateServices<T extends { id?: string; productId?: string; _id?: any; title?: string }>(
  items: T[]
): T[] {
  if (!Array.isArray(items)) return [];

  const seenIds = new Set<string>();
  const seenCanonicalKeys = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    if (!item) continue;

    const rawId = (item.id || item.productId || (item._id ? item._id.toString() : "") || "").toString().trim();
    const rawDocId = (item._id ? item._id.toString() : "").trim();
    const productId = (item.productId || "").toString().trim();

    // 1. Direct ID duplicate check
    if (rawId && seenIds.has(rawId)) {
      continue;
    }
    if (rawDocId && seenIds.has(rawDocId)) {
      continue;
    }
    if (productId && seenIds.has(productId)) {
      continue;
    }

    // 2. Canonical content duplicate check:
    // Strips emojis and punctuation to detect identical product names in the same category & package
    const rawTitle = (item.title || "").trim();
    const cleanTitle = rawTitle
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/[^\w\s\u0980-\u09FF]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const duration = ((item as any).duration || (item as any).validity || "").toString().trim().toLowerCase();
    const category = ((item as any).category || "").toString().trim().toLowerCase();
    const price = (item as any).price !== undefined ? Number((item as any).price) : "";

    const canonicalKey = `${category}:::${cleanTitle}:::${duration}:::${price}`;

    if (cleanTitle && seenCanonicalKeys.has(canonicalKey)) {
      continue;
    }

    if (rawId) seenIds.add(rawId);
    if (rawDocId) seenIds.add(rawDocId);
    if (productId) seenIds.add(productId);
    if (cleanTitle) seenCanonicalKeys.add(canonicalKey);

    result.push(item);
  }

  return result;
}

export function sortAlphabetically<T extends { id?: string; productId?: string; _id?: any; title?: string }>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  const deduped = deduplicateServices(items);
  return [...deduped].sort(compareAlphabetical);
}

