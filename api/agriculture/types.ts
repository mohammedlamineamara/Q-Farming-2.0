export type AgroEcologicalZone =
  | "coastal_tell"
  | "high_plateaus"
  | "saharan_oases"
  | "semi_arid_steppes";

export interface LocalizedString {
  en: string;
  ar: string;
  fr: string;
}

export interface CropVariety {
  id: string;
  name: string;
  code?: string;
  recommendedZones: AgroEcologicalZone[];
  cycleDays: number;
  description: LocalizedString;
  maturity: "early" | "medium" | "late";
}

export interface CropCalendarPhase {
  phase: "sowing" | "vegetative" | "flowering" | "maturation" | "harvesting";
  name: LocalizedString;
  startMonth: number; // 1 to 12
  endMonth: number; // 1 to 12
  notes?: LocalizedString;
}

export interface Affliction {
  id: string;
  type: "disease" | "pest" | "physiological";
  name: LocalizedString;
  scientificName: string;
  severity: "low" | "medium" | "high" | "critical";
  symptoms: LocalizedString;
  treatment: LocalizedString;
  affectedCropIds: string[];
}

export interface KnowledgeSource {
  id: string;
  acronym: string;
  fullName: LocalizedString;
  institutionType: "research_institute" | "technical_institute" | "ministry" | "insurance";
  url?: string;
  provenance: string;
}

export interface AlgerianWilaya {
  code: string; // e.g. "07" for Biskra
  name: LocalizedString;
  zone: AgroEcologicalZone;
  primaryCrops: string[];
}

export interface AgronomicRequirements {
  optimalTempMin: number;
  optimalTempMax: number;
  waterNeedsMm: number;
  soilTypes: LocalizedString;
  droughtTolerance: "low" | "moderate" | "high";
  salinityTolerance: "low" | "moderate" | "high";
}

export interface Crop {
  id: string;
  slug: string;
  name: LocalizedString;
  scientificName: string;
  family: string;
  category: "cereal" | "legume" | "fruit_tree" | "vegetable" | "forage" | "industrial";
  description: LocalizedString;
  varieties: CropVariety[];
  calendar: CropCalendarPhase[];
  primaryWilayas: string[]; // Wilaya codes
  requirements: AgronomicRequirements;
  afflictionIds: string[];
  sources: string[]; // Source IDs
}
