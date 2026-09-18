import { describe, it, expect } from "vitest";
import {
  normalizeCropString,
  resolveCropSlug,
  getCropDetailUrl,
} from "./cropLinking";

describe("Phase 3 — Crop Linking & Deterministic Normalization Suite", () => {
  it("1. normalizes accents, casing, and whitespace", () => {
    expect(normalizeCropString("  Blé   Dur ")).toBe("ble dur");
    expect(normalizeCropString("POMME DE TERRE")).toBe("pomme de terre");
  });

  it("2. resolves English standard crop names", () => {
    expect(resolveCropSlug("Durum Wheat")).toBe("durum-wheat");
    expect(resolveCropSlug("Wheat")).toBe("durum-wheat");
    expect(resolveCropSlug("Barley")).toBe("barley");
    expect(resolveCropSlug("Olive")).toBe("olive");
    expect(resolveCropSlug("Date Palm")).toBe("date-palm");
    expect(resolveCropSlug("Potato")).toBe("potato");
    expect(resolveCropSlug("Tomato")).toBe("tomato");
    expect(resolveCropSlug("Citrus")).toBe("citrus");
  });

  it("3. resolves French crop names and variants", () => {
    expect(resolveCropSlug("Blé Dur")).toBe("durum-wheat");
    expect(resolveCropSlug("Orge")).toBe("barley");
    expect(resolveCropSlug("Olivier")).toBe("olive");
    expect(resolveCropSlug("Palmier Dattier")).toBe("date-palm");
    expect(resolveCropSlug("Pomme de Terre")).toBe("potato");
    expect(resolveCropSlug("Tomates")).toBe("tomato");
    expect(resolveCropSlug("Agrumes")).toBe("citrus");
  });

  it("4. resolves Arabic crop names and variants", () => {
    expect(resolveCropSlug("القمح الصلب")).toBe("durum-wheat");
    expect(resolveCropSlug("الشعير")).toBe("barley");
    expect(resolveCropSlug("الزيتون")).toBe("olive");
    expect(resolveCropSlug("نخيل التمر")).toBe("date-palm");
    expect(resolveCropSlug("البطاطا")).toBe("potato");
    expect(resolveCropSlug("الطماطم")).toBe("tomato");
    expect(resolveCropSlug("الحمضيات")).toBe("citrus");
  });

  it("5. resolves Algerian cultivar and colloquial names (e.g. Deglet Nour, Spunta)", () => {
    expect(resolveCropSlug("Deglet Nour")).toBe("date-palm");
    expect(resolveCropSlug("Spunta")).toBe("potato");
    expect(resolveCropSlug("Rio Grande")).toBe("tomato");
  });

  it("6. gracefully returns null for undefined, empty, or whitespace strings", () => {
    expect(resolveCropSlug("")).toBeNull();
    expect(resolveCropSlug("   ")).toBeNull();
    expect(resolveCropSlug(null)).toBeNull();
    expect(resolveCropSlug(undefined)).toBeNull();
  });

  it("7. gracefully returns null for unknown crop types without throwing errors", () => {
    expect(resolveCropSlug("Dragon Fruit Exotic")).toBeNull();
    expect(resolveCropSlug("Rubber Tree")).toBeNull();
    expect(resolveCropSlug("Unknown Crop 123")).toBeNull();
  });

  it("8. generates accurate crop detail URLs for valid crops", () => {
    expect(getCropDetailUrl("Wheat")).toBe("/agriculture/crops/durum-wheat");
    expect(getCropDetailUrl("الزيتون")).toBe("/agriculture/crops/olive");
    expect(getCropDetailUrl("Pomme de terre")).toBe("/agriculture/crops/potato");
  });

  it("9. returns null URL for invalid or unknown crops", () => {
    expect(getCropDetailUrl("Unknown")).toBeNull();
    expect(getCropDetailUrl("")).toBeNull();
    expect(getCropDetailUrl(null)).toBeNull();
  });

  it("10. resolves indefinite Arabic crop names without definite article al-", () => {
    expect(resolveCropSlug("قمح")).toBe("durum-wheat");
    expect(resolveCropSlug("شعير")).toBe("barley");
    expect(resolveCropSlug("زيتون")).toBe("olive");
    expect(resolveCropSlug("تمر")).toBe("date-palm");
    expect(resolveCropSlug("بطاطا")).toBe("potato");
    expect(resolveCropSlug("طماطم")).toBe("tomato");
  });

  it("11. resolves multi-word crop varieties with compound prefixes or suffixes", () => {
    expect(resolveCropSlug("Ble Dur Simeto")).toBe("durum-wheat");
    expect(resolveCropSlug("Semolina Wheat")).toBe("durum-wheat");
    expect(resolveCropSlug("Deglet Nour Dates")).toBe("date-palm");
  });
});
