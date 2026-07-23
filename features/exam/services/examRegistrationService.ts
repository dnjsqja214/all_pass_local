import { getCsrfToken } from "../../shared/api/csrf";

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

  /**
   * 신청 목록과 함께 서버 시각을 돌려준다.
   *
   * <p>카운트다운은 브라우저 시계를 믿으면 안 된다 — 사용자 PC 가 몇 분씩 틀어져 있으면
   * 혼자만 일찍 시작하거나 늦게 시작한다. 모든 HTTP 응답에는 `Date` 헤더가 있으므로
   * 이 조회 하나로 시각까지 같이 받는다(서버 시각 전용 엔드포인트가 따로 필요 없다).</p>
   */
  async getRegistrationsWithServerTime(
    signal?: AbortSignal,
  ): Promise<{ registrations: ExamRegistration[]; serverNow: number; roundTripMillis: number }> {
    const sentAt = Date.now();
    const response = await fetch(buildApiUrl("/api/v1/exam-registrations"), { credentials: "include", cache: "no-store", signal });
    const roundTripMillis = Date.now() - sentAt;
    const dateHeader = response.headers.get("Date");
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !Array.isArray(body.data) || !body.data.every(isRegistration)) {
      throw new Error("시험 신청 API 응답 형식이 올바르지 않습니다.");
    }
    // Date 헤더는 응답을 만든 시점이므로 편도 지연(왕복의 절반)만큼 보정한다.
    const parsed = dateHeader ? Date.parse(dateHeader) : Number.NaN;
    const serverNow = Number.isNaN(parsed) ? Date.now() : parsed + roundTripMillis / 2;
    return { registrations: body.data, serverNow, roundTripMillis };
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
