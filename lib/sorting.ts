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

export function sortAlphabetically<T extends { title?: string }>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return [...items].sort(compareAlphabetical);
}
