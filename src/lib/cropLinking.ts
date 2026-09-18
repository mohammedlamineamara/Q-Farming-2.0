/**
 * Deterministic crop linking layer.
 * Maps existing database strings from `fields.crop` to the Agricultural Knowledge Base
 * without modifying database schemas or requiring a `cropId` foreign key.
 */

export interface CropLinkMatch {
  slug: string;
  confidence: "exact" | "alias" | "normalized";
}

const CROP_MAPPINGS: Record<string, string[]> = {
  "durum-wheat": [
    "durum wheat",
    "durum-wheat",
    "wheat",
    "ble dur",
    "blé dur",
    "ble",
    "blé",
    "القمح الصلب",
    "قمح صلب",
    "القمح",
    "قمح",
    "hard wheat",
    "semolina wheat",
  ],
  barley: [
    "barley",
    "orge",
    "الشعير",
    "شعير",
    "forage barley",
    "orge fourragère",
  ],
  olive: [
    "olive",
    "olive tree",
    "olives",
    "olivier",
    "olives de table",
    "الزيتون",
    "زيتون",
    "شجرة الزيتون",
  ],
  "date-palm": [
    "date palm",
    "date-palm",
    "date",
    "dates",
    "palmier dattier",
    "palmier",
    "dattes",
    "deglet nour",
    "نخيل التمر",
    "نخيل",
    "تمر",
    "تمور",
    "دقلة نور",
  ],
  potato: [
    "potato",
    "potatoes",
    "pomme de terre",
    "pommes de terre",
    "patate",
    "البطاطا",
    "بطاطا",
    "بطاطس",
    "spunta",
  ],
  tomato: [
    "tomato",
    "tomatoes",
    "tomate",
    "tomates",
    "الطماطم",
    "طماطم",
    "rio grande",
  ],
  citrus: [
    "citrus",
    "orange",
    "oranges",
    "clementine",
    "clémentine",
    "agrumes",
    "الحمضيات",
    "حمضيات",
    "برتقال",
    "كليمونتين",
  ],
};

/**
 * Normalizes a text string for comparison (lowercased, accents removed, trimmed, extra spaces removed).
 */
export function normalizeCropString(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics / accents
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Resolves a field crop name to an agricultural knowledge slug.
 */
export function resolveCropSlug(cropName: string | null | undefined): string | null {
  if (!cropName || !cropName.trim()) {
    return null;
  }

  const raw = cropName.trim();
  const normalized = normalizeCropString(raw);

  // 1. Direct match with a slug
  if (CROP_MAPPINGS[normalized]) {
    return normalized;
  }

  // 2. Exact match in aliases
  for (const [slug, aliases] of Object.entries(CROP_MAPPINGS)) {
    for (const alias of aliases) {
      if (
        normalized === normalizeCropString(alias) ||
        raw.toLowerCase() === alias.toLowerCase()
      ) {
        return slug;
      }
    }
  }

  // 3. Substring / partial match
  for (const [slug, aliases] of Object.entries(CROP_MAPPINGS)) {
    for (const alias of aliases) {
      const normAlias = normalizeCropString(alias);
      if (normalized.includes(normAlias) || normAlias.includes(normalized)) {
        return slug;
      }
    }
  }

  return null;
}

/**
 * Returns the deep-link URL to the Agricultural Knowledge Base for a given crop string.
 */
export function getCropDetailUrl(cropName: string | null | undefined): string | null {
  const slug = resolveCropSlug(cropName);
  if (!slug) return null;
  return `/agriculture/crops/${slug}`;
}
