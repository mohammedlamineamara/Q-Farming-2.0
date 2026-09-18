import type { Crop, Affliction, KnowledgeSource, AlgerianWilaya } from "./types";
import { CROPS, AFFLICTIONS, KNOWLEDGE_SOURCES, ALGERIAN_WILAYAS } from "./seed";

export class AgricultureRepository {
  private crops: Map<string, Crop> = new Map();
  private afflictions: Map<string, Affliction> = new Map();
  private sources: Map<string, KnowledgeSource> = new Map();
  private wilayas: Map<string, AlgerianWilaya> = new Map();

  constructor() {
    this.resetToDefaults();
  }

  public resetToDefaults(): void {
    this.crops.clear();
    this.afflictions.clear();
    this.sources.clear();
    this.wilayas.clear();

    for (const crop of CROPS) {
      this.crops.set(crop.id, { ...crop });
    }
    for (const aff of AFFLICTIONS) {
      this.afflictions.set(aff.id, { ...aff });
    }
    for (const src of KNOWLEDGE_SOURCES) {
      this.sources.set(src.id, { ...src });
    }
    for (const wil of ALGERIAN_WILAYAS) {
      this.wilayas.set(wil.code, { ...wil });
    }
  }

  public getAllCrops(filter?: { category?: string; query?: string }): Crop[] {
    let result = Array.from(this.crops.values());

    if (filter?.category && filter.category !== "all") {
      result = result.filter((c) => c.category === filter.category);
    }

    if (filter?.query && filter.query.trim()) {
      const q = filter.query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.en.toLowerCase().includes(q) ||
          c.name.fr.toLowerCase().includes(q) ||
          c.name.ar.includes(q) ||
          c.scientificName.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getCropById(idOrSlug: string): Crop | null {
    if (this.crops.has(idOrSlug)) {
      return this.crops.get(idOrSlug) || null;
    }
    for (const crop of this.crops.values()) {
      if (crop.slug === idOrSlug) {
        return crop;
      }
    }
    return null;
  }

  public getAllAfflictions(): Affliction[] {
    return Array.from(this.afflictions.values());
  }

  public getAfflictionById(id: string): Affliction | null {
    return this.afflictions.get(id) || null;
  }

  public getAfflictionsForCrop(cropId: string): Affliction[] {
    return Array.from(this.afflictions.values()).filter((a) =>
      a.affectedCropIds.includes(cropId)
    );
  }

  public getAllSources(): KnowledgeSource[] {
    return Array.from(this.sources.values());
  }

  public getSourceById(id: string): KnowledgeSource | null {
    return this.sources.get(id) || null;
  }

  public getAllWilayas(): AlgerianWilaya[] {
    return Array.from(this.wilayas.values());
  }

  public getWilayaByCode(code: string): AlgerianWilaya | null {
    return this.wilayas.get(code) || null;
  }

  /**
   * Admin-only write operation for global agricultural knowledge.
   */
  public adminAddCrop(crop: Crop, userRole: string): Crop {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only administrators can modify global agricultural knowledge.");
    }
    if (!crop.id || !crop.name?.en) {
      throw new Error("Invalid crop data: id and name are required.");
    }
    this.crops.set(crop.id, { ...crop });
    return crop;
  }

  /**
   * Admin-only write operation.
   */
  public adminUpdateCrop(id: string, updates: Partial<Crop>, userRole: string): Crop {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only administrators can modify global agricultural knowledge.");
    }
    const existing = this.crops.get(id);
    if (!existing) {
      throw new Error(`Crop with id ${id} not found.`);
    }
    const updated = { ...existing, ...updates };
    this.crops.set(id, updated);
    return updated;
  }
}

export const agricultureRepo = new AgricultureRepository();
