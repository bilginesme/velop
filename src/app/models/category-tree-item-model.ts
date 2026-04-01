import { MilestoneCategory } from "./milestone-category.model";
import { MilestoneObjective } from "./milestone-objective.model";
import { MilestoneSubcategory } from "./milestone-subcategory.model";

export interface CategoryTreeItem {
  category: MilestoneCategory;
  subcategories: {
    subcategory: MilestoneSubcategory;
    objectives: MilestoneObjective[]; // Objectives WITH a subcategory
  }[];
  orphanObjectives: MilestoneObjective[]; // Objectives WITHOUT a subcategory
}