export interface ObjectiveLog {
  id?: number; // Optional because it won't exist until saved to the DB
  child_id: number;
  objective_id: number;
  date_chosen: string; // ISO string format is best: '2026-04-01T10:00:00Z'
  date_achieved: string | null;
  is_succeeded: number; // Use number here, not boolean
  notes: string;
  objective_key?: string;
}