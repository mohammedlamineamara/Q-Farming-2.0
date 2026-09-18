import { describe, it, expect, beforeEach } from "vitest";
import { agricultureRepo } from "../agriculture/repository";
import { Crop } from "../agriculture/types";

describe("Phase 2 — Agricultural Knowledge Domain & Security Suite", () => {
  beforeEach(() => {
    agricultureRepo.resetToDefaults();
  });

  it("1. returns verified default Algerian crops (durum-wheat, barley, olive, date-palm, potato, tomato, citrus)", () => {
    const crops = agricultureRepo.getAllCrops();
    expect(crops.length).toBeGreaterThanOrEqual(7);
    const slugs = crops.map((c) => c.slug);
    expect(slugs).toContain("durum-wheat");
    expect(slugs).toContain("barley");
    expect(slugs).toContain("olive");
    expect(slugs).toContain("date-palm");
    expect(slugs).toContain("potato");
    expect(slugs).toContain("tomato");
    expect(slugs).toContain("citrus");
  });

  it("2. filters crops by category (e.g. cereal, fruit_tree, vegetable)", () => {
    const cereals = agricultureRepo.getAllCrops({ category: "cereal" });
    expect(cereals.length).toBeGreaterThanOrEqual(2);
    cereals.forEach((c) => expect(c.category).toBe("cereal"));

    const fruitTrees = agricultureRepo.getAllCrops({ category: "fruit_tree" });
    expect(fruitTrees.length).toBeGreaterThanOrEqual(3);
    fruitTrees.forEach((c) => expect(c.category).toBe("fruit_tree"));
  });

  it("3. searches crops multilingually across English, French, Arabic, and scientific names", () => {
    const frenchSearch = agricultureRepo.getAllCrops({ query: "blé" });
    expect(frenchSearch.length).toBeGreaterThanOrEqual(1);
    expect(frenchSearch[0].slug).toBe("durum-wheat");

    const arabicSearch = agricultureRepo.getAllCrops({ query: "الزيتون" });
    expect(arabicSearch.length).toBeGreaterThanOrEqual(1);
    expect(arabicSearch[0].slug).toBe("olive");

    const sciSearch = agricultureRepo.getAllCrops({ query: "Phoenix dactylifera" });
    expect(sciSearch.length).toBeGreaterThanOrEqual(1);
    expect(sciSearch[0].slug).toBe("date-palm");
  });

  it("4. fetches complete crop details including certified varieties and agronomic calendars", () => {
    const crop = agricultureRepo.getCropById("durum-wheat");
    expect(crop).not.toBeNull();
    expect(crop?.varieties.length).toBeGreaterThanOrEqual(2);
    expect(crop?.calendar.length).toBeGreaterThanOrEqual(4);
    expect(crop?.requirements.waterNeedsMm).toBe(450);
  });

  it("5. gracefully returns null for non-existent crops", () => {
    const crop = agricultureRepo.getCropById("non-existent-crop-xyz");
    expect(crop).toBeNull();
  });

  it("6. resolves afflictions (pests and diseases) specifically linked to crops", () => {
    const afflictions = agricultureRepo.getAfflictionsForCrop("durum-wheat");
    expect(afflictions.length).toBeGreaterThanOrEqual(2);
    const ids = afflictions.map((a) => a.id);
    expect(ids).toContain("septoria-tritici");
    expect(ids).toContain("yellow-rust");
  });

  it("7. maintains authentic agricultural knowledge sources with verified provenance (ITGC, INRAA, ITDAS, CNMA)", () => {
    const sources = agricultureRepo.getAllSources();
    const acronyms = sources.map((s) => s.acronym);
    expect(acronyms).toContain("ITGC");
    expect(acronyms).toContain("INRAA");
    expect(acronyms).toContain("ITDAS");
    expect(acronyms).toContain("CNMA");
    sources.forEach((s) => {
      expect(s.provenance).toBeDefined();
      expect(s.provenance.length).toBeGreaterThan(5);
    });
  });

  it("8. stores Algerian wilayas with their assigned agro-ecological zones", () => {
    const wilayas = agricultureRepo.getAllWilayas();
    expect(wilayas.length).toBeGreaterThanOrEqual(10);
    const biskra = agricultureRepo.getWilayaByCode("07");
    expect(biskra?.zone).toBe("saharan_oases");
    const setif = agricultureRepo.getWilayaByCode("19");
    expect(setif?.zone).toBe("high_plateaus");
  });

  it("9. security: blocks non-admin users (worker, viewer) from creating global agricultural knowledge", () => {
    const mockCrop: Crop = {
      id: "chickpea",
      slug: "chickpea",
      name: { en: "Chickpea", ar: "الحمص", fr: "Pois chiche" },
      scientificName: "Cicer arietinum",
      family: "Fabaceae",
      category: "legume",
      description: { en: "Legume", ar: "بقوليات", fr: "Légumineuse" },
      varieties: [],
      calendar: [],
      primaryWilayas: ["19", "29"],
      requirements: {
        optimalTempMin: 15,
        optimalTempMax: 28,
        waterNeedsMm: 350,
        soilTypes: { en: "Loam", ar: "طمي", fr: "Limon" },
        droughtTolerance: "moderate",
        salinityTolerance: "low",
      },
      afflictionIds: [],
      sources: ["itgc"],
    };

    expect(() => {
      agricultureRepo.adminAddCrop(mockCrop, "worker");
    }).toThrow(/Unauthorized/i);

    expect(() => {
      agricultureRepo.adminAddCrop(mockCrop, "viewer");
    }).toThrow(/Unauthorized/i);

    expect(agricultureRepo.getCropById("chickpea")).toBeNull();
  });

  it("10. security: blocks non-admin users from updating global agricultural knowledge", () => {
    expect(() => {
      agricultureRepo.adminUpdateCrop("durum-wheat", { scientificName: "Hacked Name" }, "worker");
    }).toThrow(/Unauthorized/i);

    const crop = agricultureRepo.getCropById("durum-wheat");
    expect(crop?.scientificName).toBe("Triticum durum Desf.");
  });

  it("11. allows authorized administrator to add global crop data", () => {
    const testCrop: Crop = {
      id: "fig-tree",
      slug: "fig-tree",
      name: { en: "Fig Tree", ar: "شجرة التين", fr: "Figuier" },
      scientificName: "Ficus carica",
      family: "Moraceae",
      category: "fruit_tree",
      description: { en: "Traditional Mediterranean fruit tree", ar: "شجرة تين متوسطية", fr: "Figuier méditerranéen" },
      varieties: [],
      calendar: [],
      primaryWilayas: ["09", "16"],
      requirements: {
        optimalTempMin: 15,
        optimalTempMax: 35,
        waterNeedsMm: 400,
        soilTypes: { en: "Rocky", ar: "صخري", fr: "Rocheux" },
        droughtTolerance: "high",
        salinityTolerance: "moderate",
      },
      afflictionIds: [],
      sources: ["inraa"],
    };

    const created = agricultureRepo.adminAddCrop(testCrop, "admin");
    expect(created.id).toBe("fig-tree");
    expect(agricultureRepo.getCropById("fig-tree")).not.toBeNull();
  });

  it("12. allows authorized administrator to update crop data", () => {
    const updated = agricultureRepo.adminUpdateCrop(
      "durum-wheat",
      {
        requirements: {
          optimalTempMin: 14,
          optimalTempMax: 27,
          waterNeedsMm: 460,
          soilTypes: {
            en: "Deep fertile clay",
            ar: "طين خصب عميق",
            fr: "Argile fertile profonde",
          },
          droughtTolerance: "moderate",
          salinityTolerance: "moderate",
        },
      },
      "admin"
    );

    expect(updated.requirements.waterNeedsMm).toBe(460);
    const retrieved = agricultureRepo.getCropById("durum-wheat");
    expect(retrieved?.requirements.waterNeedsMm).toBe(460);
  });

  it("13. cleanly restores initial seed data via resetToDefaults() without persistence leakage", () => {
    agricultureRepo.adminUpdateCrop(
      "durum-wheat",
      { scientificName: "Modified Name Temporarily" },
      "admin"
    );
    expect(agricultureRepo.getCropById("durum-wheat")?.scientificName).toBe(
      "Modified Name Temporarily"
    );

    agricultureRepo.resetToDefaults();
    expect(agricultureRepo.getCropById("durum-wheat")?.scientificName).toBe(
      "Triticum durum Desf."
    );
  });
});
