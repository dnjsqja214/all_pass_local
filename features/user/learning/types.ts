export interface SubjectScore {
  name: string;
  score: number;
}

export interface ExamAttempt {
  id: string;
  roundTitle: string;
  attemptTitle: string;
  date: string;
  subjectScores: SubjectScore[];
  totalScore: number;
}

export interface ScoreTrendPoint {
  label: string;
  score: number;
}

export interface WeakTopic {
  topic: string;
  wrongCount: number;
}

export interface LearningDetail {
  memberId: string;
  totalStudyMinutes: number;
  examCount: number;
  averageScore: number;
  wrongAnswerCount: number;
  scoreTrend: ScoreTrendPoint[];
  subjectScores: {
    subject: string;
    score: number;
  }[];
  examHistory: {
    id: string;
    examTitle: string;
    attemptTitle: string;
    date: string;
    totalScore: number;
    isPassed: boolean;
    subjects: {
      name: string;
      score: number;
      isFailed: boolean;
    }[];
  }[];
  weakTopics: WeakTopic[];
}

export interface SubjectStudyTime {
  subjectName: string;
  studyMinutes: number;
}

export interface StudyExamInfo {
  examTitle: string;
  score: number;
  isPassed: boolean;
}

export interface StudyContributionItem {
  studyDate: string; // YYYY-MM-DD
  studyMinutes: number;
  questionCount: number;
  subjects: SubjectStudyTime[];
  exams?: StudyExamInfo[];
}

export interface StudyStats {
  totalMinutes: number;
  studiedDaysCount: number;
  currentStreak: number;
  maxStreak: number;
}

