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
  completedAt?: string | null;
  score?: number | null;
  description?: string;
}

export interface AnswerMark {
  questionNumber: number;
  selectedChoice: number;
}

export interface ExamDetail {
  id: string;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  description: string;
  hasActiveSession: boolean;
  activeSessionId: string | null;
  savedAnswers: AnswerMark[];
}

export interface StartedExamSession {
  sessionId: string;
  examId: string;
  startedAt: string;
  durationSeconds: number;
  remainingSeconds: number;
}

export interface SavedExamSession {
  sessionId: string;
  updatedAt: string;
  markedCount: number;
}

export interface SubmittedExamSession {
  sessionId: string;
  examId: string;
  score: number | null;
  correctCount: number | null;
  wrongCount: number | null;
  totalQuestions: number;
  submittedAt: string;
  status: "completed";
  gradingStatus: "graded" | "pending";
}
