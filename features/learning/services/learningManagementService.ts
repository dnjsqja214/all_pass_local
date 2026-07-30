import type {
  ExamHistoryItem,
  LearningDashboard,
  LearningSummary,
  PassingAssessment,
  ScoreTrendPoint,
  SubjectScore,
  WeakTopic,
} from "../types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === "number";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isSubjectScore(value: unknown): value is SubjectScore {
  return isRecord(value) && typeof value.subject === "string" && typeof value.score === "number";
}

function isSummary(value: unknown): value is LearningSummary {
  return isRecord(value) && typeof value.elapsedExamMinutes === "number" &&
    typeof value.completedAttemptCount === "number" && typeof value.averageScore === "number" &&
    typeof value.wrongAnswerCount === "number";
}

function isAssessment(value: unknown): value is PassingAssessment {
  return isRecord(value) && ["NO_DATA", "PENDING", "PASSED", "FAILED"].includes(String(value.status)) &&
    isNullableNumber(value.year) && isNullableNumber(value.round) && typeof value.totalScore === "number" &&
    typeof value.averageScore === "number" && Array.isArray(value.subjectScores) &&
    value.subjectScores.every(isSubjectScore) && Array.isArray(value.missingSubjects) &&
    value.missingSubjects.every((subject) => typeof subject === "string");
}

function isTrend(value: unknown): value is ScoreTrendPoint {
  return isRecord(value) && typeof value.attemptId === "string" && typeof value.label === "string" &&
    typeof value.score === "number" && typeof value.submittedAt === "string";
}

function isHistory(value: unknown): value is ExamHistoryItem {
  return isRecord(value) && typeof value.id === "string" && isNullableString(value.registrationId) &&
    typeof value.examTitle === "string" && typeof value.attemptTitle === "string" &&
    typeof value.submittedAt === "string" && typeof value.score === "number" &&
    Array.isArray(value.subjectScores) && value.subjectScores.every(isSubjectScore);
}

function isWeakTopic(value: unknown): value is WeakTopic {
  return isRecord(value) && typeof value.topic === "string" && typeof value.wrongCount === "number" &&
    (value.basis === "CHAPTER" || value.basis === "SUBJECT");
}

function isDashboard(value: unknown): value is LearningDashboard {
  return isRecord(value) && isSummary(value.summary) && isAssessment(value.assessment) &&
    Array.isArray(value.scoreTrend) && value.scoreTrend.every(isTrend) &&
    Array.isArray(value.examHistory) && value.examHistory.every(isHistory) &&
    Array.isArray(value.weakTopics) && value.weakTopics.every(isWeakTopic);
}

export const learningManagementService = {
  async get(signal?: AbortSignal): Promise<LearningDashboard> {
    const response = await fetch(`${API_BASE_URL}/api/v1/learning-management`, {
      credentials: "include",
      cache: "no-store",
      signal,
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message = isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : `학습관리 정보를 불러오지 못했습니다. (${response.status})`;
      throw new Error(message);
    }
    if (!isRecord(payload) || payload.success !== true || !isDashboard(payload.data)) {
      throw new Error("학습관리 API 응답 형식이 올바르지 않습니다.");
    }
    return payload.data;
  },
};
