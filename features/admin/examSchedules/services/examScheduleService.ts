import { getCsrfToken } from "../../../shared/api/csrf";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface ExamSchedulePolicy {
  id: string;
  name: string;
  examIds: string[];
  weekdays: number[];
  startTimes: string[];
  validFrom: string;
  validUntil: string;
  durationMinutes: number;
  entryWindowMinutes: number;
  timezone: string;
  excludedDates: string[];
  active: boolean;
  slotCount: number;
  createdAt: string;
}

export interface CreateExamSchedulePolicy {
  name: string;
  examIds: string[];
  weekdays: number[];
  startTimes: string[];
  validFrom: string;
  validUntil: string;
  durationMinutes: number;
  entryWindowMinutes: number;
  excludedDates: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPolicy(value: unknown): value is ExamSchedulePolicy {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string" &&
    Array.isArray(value.examIds) && value.examIds.every((item) => typeof item === "string") &&
    Array.isArray(value.weekdays) && value.weekdays.every((item) => typeof item === "number") &&
    Array.isArray(value.startTimes) && value.startTimes.every((item) => typeof item === "string") &&
    typeof value.validFrom === "string" && typeof value.validUntil === "string" &&
    typeof value.durationMinutes === "number" && typeof value.entryWindowMinutes === "number" &&
    typeof value.timezone === "string" && Array.isArray(value.excludedDates) &&
    value.excludedDates.every((item) => typeof item === "string") && typeof value.active === "boolean" &&
    typeof value.slotCount === "number" && typeof value.createdAt === "string";
}

async function parse(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function errorMessage(body: unknown, status: number): string {
  return isRecord(body) && typeof body.message === "string"
    ? body.message
    : `시험 일정 API 요청에 실패했습니다. (${status})`;
}

export const examScheduleService = {
  async findAll(signal?: AbortSignal): Promise<ExamSchedulePolicy[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/exam-schedules`, {
      credentials: "include", cache: "no-store", signal,
    });
    const body = await parse(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !Array.isArray(body.data) || !body.data.every(isPolicy)) {
      throw new Error("시험 일정 API 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async create(command: CreateExamSchedulePolicy): Promise<ExamSchedulePolicy> {
    const csrf = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/exam-schedules`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", [csrf.headerName]: csrf.token },
      body: JSON.stringify(command),
    });
    const body = await parse(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !isPolicy(body.data)) {
      throw new Error("시험 일정 생성 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async update(id: string, command: CreateExamSchedulePolicy): Promise<ExamSchedulePolicy> {
    const csrf = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/exam-schedules/${encodeURIComponent(id)}`, {
      method: "PUT",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", [csrf.headerName]: csrf.token },
      body: JSON.stringify(command),
    });
    const body = await parse(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !isPolicy(body.data)) {
      throw new Error("시험 일정 수정 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async activate(id: string): Promise<ExamSchedulePolicy> {
    const csrf = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/exam-schedules/${encodeURIComponent(id)}/activate`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { [csrf.headerName]: csrf.token },
    });
    const body = await parse(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !isPolicy(body.data)) {
      throw new Error("시험 일정 활성화 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async deactivate(id: string): Promise<void> {
    const csrf = await getCsrfToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/exam-schedules/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
      headers: { [csrf.headerName]: csrf.token },
    });
    const body = await parse(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true) throw new Error("시험 일정 비활성화 응답이 올바르지 않습니다.");
  },
};
