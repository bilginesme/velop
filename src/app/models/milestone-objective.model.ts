export interface MilestoneObjective {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  objective_key: string;
  objective_order: number;
}