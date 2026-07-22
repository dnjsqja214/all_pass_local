import { getCsrfToken } from "../../../shared/api/csrf";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface ExamSlot {
  id: string;
  examId: string;
  examTitle: string;
  year: number;
  round: number;
  subject: string;
  startsAt: string;
  entryClosesAt: string;
  durationMinutes: number;
  status: "open";
}

export interface ExamRegistration {
  id: string;
  slotId: string;
  examId: string;
  examTitle: string;
  year: number;
  round: number;
  subject: string;
  startsAt: string;
  entryClosesAt: string;
  durationMinutes: number;
  status: "applied" | "cancelled" | "completed";
  appliedAt: string;
  updatedAt?: string;
}

function buildApiUrl(path: string): string { return `${API_BASE_URL}${path}`; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function isSlot(value: unknown): value is ExamSlot {
  return isRecord(value) && typeof value.id === "string" && typeof value.examId === "string" &&
    typeof value.examTitle === "string" && typeof value.year === "number" && typeof value.round === "number" &&
    typeof value.subject === "string" && typeof value.startsAt === "string" &&
    typeof value.entryClosesAt === "string" && typeof value.durationMinutes === "number" && value.status === "open";
}
function isRegistration(value: unknown): value is ExamRegistration {
  return isRecord(value) && typeof value.id === "string" && typeof value.slotId === "string" &&
    typeof value.examId === "string" && typeof value.examTitle === "string" && typeof value.year === "number" &&
    typeof value.round === "number" && typeof value.subject === "string" && typeof value.startsAt === "string" &&
    typeof value.entryClosesAt === "string" && typeof value.durationMinutes === "number" &&
    (value.status === "applied" || value.status === "cancelled" || value.status === "completed") &&
    typeof value.appliedAt === "string" &&
    (value.updatedAt === undefined || typeof value.updatedAt === "string");
}
async function parseBody(response: Response): Promise<unknown> { return response.json().catch(() => null); }
function errorMessage(body: unknown, status: number): string {
  return isRecord(body) && typeof body.message === "string" ? body.message : `시험 신청 API 요청에 실패했습니다. (${status})`;
}

export const examRegistrationService = {
  async getOpenSlots(signal?: AbortSignal): Promise<ExamSlot[]> {
    const response = await fetch(buildApiUrl("/api/v1/exam-slots"), { credentials: "include", cache: "no-store", signal });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !Array.isArray(body.data) || !body.data.every(isSlot)) {
      throw new Error("시험 일정 API 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async getRegistrations(signal?: AbortSignal): Promise<ExamRegistration[]> {
    const response = await fetch(buildApiUrl("/api/v1/exam-registrations"), { credentials: "include", cache: "no-store", signal });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !Array.isArray(body.data) || !body.data.every(isRegistration)) {
      throw new Error("시험 신청 API 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async registerExam(slot: Pick<ExamSlot, "examId" | "startsAt">, signal?: AbortSignal): Promise<ExamRegistration> {
    const csrf = await getCsrfToken(signal);
    const response = await fetch(buildApiUrl("/api/v1/exam-registrations"), {
      method: "POST", credentials: "include", cache: "no-store",
      headers: { "Content-Type": "application/json", [csrf.headerName]: csrf.token },
      body: JSON.stringify({ examId: slot.examId, startsAt: slot.startsAt }), signal,
    });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !isRegistration(body.data)) throw new Error("시험 신청 응답 형식이 올바르지 않습니다.");
    return body.data;
  },

  async cancelRegistration(id: string, signal?: AbortSignal): Promise<void> {
    const csrf = await getCsrfToken(signal);
    const response = await fetch(buildApiUrl(`/api/v1/exam-registrations/${encodeURIComponent(id)}`), {
      method: "DELETE", credentials: "include", cache: "no-store", headers: { [csrf.headerName]: csrf.token }, signal,
    });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true) throw new Error("시험 신청 취소 응답 형식이 올바르지 않습니다.");
  },
};
