export interface ObjectiveLog {
  id?: number; // Optional because it won't exist until saved to the DB
  child_id: number;
  objective_id: number;
  date_chosen: string; // ISO string format is best: '2026-04-01T10:00:00Z'
  is_succeeded: boolean; // We will map the DB 0/1 to true/false in the service
  notes: string;
  objective_key?: string;
}