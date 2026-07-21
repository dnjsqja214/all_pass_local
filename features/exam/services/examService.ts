import {
  AnswerMark,
  ExamDetail,
  ExamListItem,
  ExamStatus,
  SavedExamSession,
  StartedExamSession,
  SubmittedExamSession,
} from "../types/exam";
import { getCsrfToken } from "../../shared/api/csrf";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ExamSearchParams {
  type: string;
  subject: string;
  round: string;
}

function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isExamStatus(value: unknown): value is ExamStatus {
  return value === "available" || value === "completed" || value === "scheduled";
}

function isAnswerMark(value: unknown): value is AnswerMark {
  return isRecord(value) &&
    typeof value.questionNumber === "number" &&
    typeof value.selectedChoice === "number";
}

function isExamListItem(value: unknown): value is ExamListItem {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.year === "number" &&
    typeof value.round === "number" &&
    typeof value.subject === "string" &&
    typeof value.totalQuestions === "number" &&
    typeof value.durationMinutes === "number" &&
    isExamStatus(value.status) &&
    (value.completedAt === undefined || value.completedAt === null || typeof value.completedAt === "string") &&
    (value.score === undefined || value.score === null || typeof value.score === "number") &&
    (value.description === undefined || typeof value.description === "string");
}

function isExamDetail(value: unknown): value is ExamDetail {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.totalQuestions === "number" &&
    typeof value.durationMinutes === "number" &&
    typeof value.description === "string" &&
    typeof value.hasActiveSession === "boolean" &&
    (value.activeSessionId === null || typeof value.activeSessionId === "string") &&
    Array.isArray(value.savedAnswers) && value.savedAnswers.every(isAnswerMark);
}

function isStartedSession(value: unknown): value is StartedExamSession {
  return isRecord(value) &&
    typeof value.sessionId === "string" &&
    typeof value.examId === "string" &&
    typeof value.startedAt === "string" &&
    typeof value.durationSeconds === "number" &&
    typeof value.remainingSeconds === "number";
}

function isSavedSession(value: unknown): value is SavedExamSession {
  return isRecord(value) &&
    typeof value.sessionId === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.markedCount === "number";
}

function isSubmittedSession(value: unknown): value is SubmittedExamSession {
  return isRecord(value) &&
    typeof value.sessionId === "string" &&
    typeof value.examId === "string" &&
    (value.score === null || typeof value.score === "number") &&
    (value.correctCount === null || typeof value.correctCount === "number") &&
    (value.wrongCount === null || typeof value.wrongCount === "number") &&
    typeof value.totalQuestions === "number" &&
    typeof value.submittedAt === "string" &&
    value.status === "completed" &&
    (value.gradingStatus === "graded" || value.gradingStatus === "pending");
}

async function parseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function errorMessage(body: unknown, status: number): string {
  if (isRecord(body) && typeof body.message === "string") return body.message;
  return `시험 API 요청에 실패했습니다. (${status})`;
}

async function request<T>(
  path: string,
  validator: (value: unknown) => value is T,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const body = await parseBody(response);
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  if (!isRecord(body) || body.success !== true || !validator(body.data)) {
    throw new Error("시험 API 응답 형식이 올바르지 않습니다.");
  }
  return (body as unknown as ApiResponse<T>).data;
}

async function mutation<T>(
  path: string,
  method: "POST" | "PUT",
  body: unknown,
  validator: (value: unknown) => value is T,
  signal?: AbortSignal,
): Promise<T> {
  const csrf = await getCsrfToken(signal);
  return request(path, validator, {
    method,
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
}

export const examService = {
  findExams(params: ExamSearchParams, signal?: AbortSignal): Promise<ExamListItem[]> {
    const query = new URLSearchParams({
      type: params.type,
      subject: params.subject,
      round: params.round,
    });
    return request(`/api/v1/exams?${query.toString()}`,
      (value): value is ExamListItem[] => Array.isArray(value) && value.every(isExamListItem), { signal });
  },

  getRegisteredExam(registrationId: string, signal?: AbortSignal): Promise<ExamDetail> {
    return request(`/api/v1/exam-registrations/${encodeURIComponent(registrationId)}/exam`, isExamDetail, { signal });
  },

  startSession(registrationId: string, signal?: AbortSignal): Promise<StartedExamSession> {
    return mutation(`/api/v1/exam-registrations/${encodeURIComponent(registrationId)}/session`, "POST", undefined,
      isStartedSession, signal);
  },

  tempSave(sessionId: string, answers: AnswerMark[], remainingSeconds: number): Promise<SavedExamSession> {
    return mutation(`/api/v1/exams/sessions/${encodeURIComponent(sessionId)}/temp-save`, "PUT",
      { answers, remainingSeconds }, isSavedSession);
  },

  submit(sessionId: string, answers: AnswerMark[]): Promise<SubmittedExamSession> {
    return mutation(`/api/v1/exams/sessions/${encodeURIComponent(sessionId)}/submit`, "POST",
      { answers }, isSubmittedSession);
  },
};
