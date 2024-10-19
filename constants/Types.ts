export type CropInfo = {
  crop: string;
  disease: string;
  other_crops_infested: string[];
  cause: string[];
  life_cycle: string[];
  remedy: string[];
  preventive_measures: string[];
  environment_conditions: string[];
  nutrient_deficiency: string[];
  companion_planting: string[];
  post_harvest_handling: string[];
  image_url: string[];
};
export type PestInfo = {
  pest_name: string;
  affected_crops: string[];
  life_cycle: string[];
  treatment: string[];
  preventive_measures: string[];
  environment_conditions: string[];
  companion_planting: string[];
  nutrient_deficiencies: string[];
  post_harvest_handling: string[];
  image_url: string;
};
export type Image = {
  assetId: string | null;
  base64: string | null;
  duration: number | null;
  exif: Record<string, unknown> | null;
  fileName: string;
  fileSize: number;
  height: number;
  mimeType: string;
  rotation: number | null;
  type: "image";
  uri: string;
  width: number;
};

export type ImagePickerResult = {
  assets: Image[];
  canceled: boolean;
};

// Type for Fertilizer Map
interface Fertilizer {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
}

// Type for Recommendations Map
interface Recommendations {
  fertilizer: Fertilizer;
  irrigation: string;
  pH_adjustment: string;
}

// Type for Crop Map
export interface Crop {
  crop_name: string;
  expected_yield_per_hectare: string;
  recommendations: Recommendations;
  suitability_score: number;
}

// Type for Crops for 3 Months (Array of Crops)
export interface CropsFor3Months extends Array<Crop> {}

// Type for Crops for 6 Months (Array of Crops)
export interface CropsFor6Months extends Array<Crop> {}

// Main Farm Data Structure
export interface FarmData {
  crops_for_3_months: CropsFor3Months;
  crops_for_6_months: CropsFor6Months;
  farm_id: number;
  user_id: number;
}

