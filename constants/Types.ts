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
