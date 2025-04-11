export type PlantInfo = {
  affected_crops: string[];
  common_name: string;
  companion_planting: string[];
  environment_conditions: string[];
  life_cycle: string[];
  post_harvest_handling: string[];
  preventive_measures: string[];
  problem_type: string;
  treatment: string[];
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
interface NPK {
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
}
interface soil_data {
  Moisture: number;
  pH: number;
  NPK: NPK;
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
  soil_data?: soil_data;
}

export interface InventoryTransaction {
  _id: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
  farmId: string;
  transactionType: TransactionType;
  description?: string;
  __v?: number;
}
export type TransactionType = "income" | "expense";
