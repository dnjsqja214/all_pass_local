export type ExamStatus = "available" | "completed" | "scheduled";

export interface ExamListItem {
  id: string;
  title: string;
  year: number;
  round: number;
  subject: string;
  totalQuestions: number;
  durationMinutes: number;
  status: ExamStatus;
  completedAt?: string;
  score?: number;
  description?: string;
}
