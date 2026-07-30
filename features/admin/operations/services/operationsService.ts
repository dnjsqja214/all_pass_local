const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export type AccessStatus = "ONLINE" | "RECENT" | "LOGOUT" | "SESSION_TIMEOUT";

export interface UserAccessStatus {
  userId: string;
  name: string;
  email: string;
  loggedInAt: string | null;
  lastAuthenticatedAt: string | null;
  endedAt: string | null;
  status: AccessStatus;
}

export interface ExamOperationsStatus {
  examId: string;
  examTitle: string;
  year: number;
  round: number;
  subject: string;
  startsAt: string;
  registeredCount: number;
  startedCount: number;
  submittedCount: number;
  unsubmittedCount: number;
  submissionRate: number;
}

export interface DailyOperationsStatus {
  date: string;
  generatedAt: string;
  currentOnlineCount: number;
  users: UserAccessStatus[];
  exams: ExamOperationsStatus[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isUser(value: unknown): value is UserAccessStatus {
  return isRecord(value) && typeof value.userId === "string" &&
    typeof value.name === "string" && typeof value.email === "string" &&
    isNullableString(value.loggedInAt) && isNullableString(value.lastAuthenticatedAt) &&
    isNullableString(value.endedAt) &&
    ["ONLINE", "RECENT", "LOGOUT", "SESSION_TIMEOUT"].includes(String(value.status));
}

function isExam(value: unknown): value is ExamOperationsStatus {
  return isRecord(value) && typeof value.examId === "string" &&
    typeof value.examTitle === "string" && typeof value.year === "number" &&
    typeof value.round === "number" && typeof value.subject === "string" &&
    typeof value.startsAt === "string" && typeof value.registeredCount === "number" &&
    typeof value.startedCount === "number" && typeof value.submittedCount === "number" &&
    typeof value.unsubmittedCount === "number" && typeof value.submissionRate === "number";
}

function isDailyStatus(value: unknown): value is DailyOperationsStatus {
  return isRecord(value) && typeof value.date === "string" &&
    typeof value.generatedAt === "string" && typeof value.currentOnlineCount === "number" &&
    Array.isArray(value.users) && value.users.every(isUser) &&
    Array.isArray(value.exams) && value.exams.every(isExam);
}

export const operationsService = {
  async daily(date: string, signal?: AbortSignal): Promise<DailyOperationsStatus> {
    const query = new URLSearchParams({ date });
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/operations/daily?${query}`, {
      credentials: "include",
      cache: "no-store",
      signal,
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message = isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : `운영 현황을 불러오지 못했습니다. (${response.status})`;
      throw new Error(message);
    }
    if (!isRecord(payload) || payload.success !== true || !isDailyStatus(payload.data)) {
      throw new Error("운영 현황 API 응답 형식이 올바르지 않습니다.");
    }
    return (payload as unknown as ApiResponse<DailyOperationsStatus>).data;
  },
};
