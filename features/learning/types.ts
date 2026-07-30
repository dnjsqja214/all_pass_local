export type PassingAssessmentStatus = "NO_DATA" | "PENDING" | "PASSED" | "FAILED";
export type WeakTopicBasis = "CHAPTER" | "SUBJECT";

export interface SubjectScore {
  subject: string;
  score: number;
}

export interface LearningSummary {
  elapsedExamMinutes: number;
  completedAttemptCount: number;
  averageScore: number;
  wrongAnswerCount: number;
}

export interface PassingAssessment {
  status: PassingAssessmentStatus;
  year: number | null;
  round: number | null;
  totalScore: number;
  averageScore: number;
  subjectScores: SubjectScore[];
  missingSubjects: string[];
}

export interface ScoreTrendPoint {
  attemptId: string;
  label: string;
  score: number;
  submittedAt: string;
}

export interface ExamHistoryItem {
  id: string;
  registrationId: string | null;
  examTitle: string;
  attemptTitle: string;
  submittedAt: string;
  score: number;
  subjectScores: SubjectScore[];
}

export interface WeakTopic {
  topic: string;
  wrongCount: number;
  basis: WeakTopicBasis;
}

export interface LearningDashboard {
  summary: LearningSummary;
  assessment: PassingAssessment;
  scoreTrend: ScoreTrendPoint[];
  examHistory: ExamHistoryItem[];
  weakTopics: WeakTopic[];
}
