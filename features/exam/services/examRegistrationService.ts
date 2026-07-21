const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface ExamRegistration {
  id: string;
  examId: string;
  examTitle: string;
  year: number;
  round: number;
  subject: string;
  registrationDate: string;
  status: "applied" | "cancelled" | "completed";
  appliedAt: string;
}

interface CsrfToken {
  headerName: string;
  token: string;
}

let csrfTokenPromise: Promise<CsrfToken> | null = null;

function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isExamRegistration(value: unknown): value is ExamRegistration {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" &&
    typeof value.examId === "string" &&
    typeof value.examTitle === "string" &&
    typeof value.year === "number" &&
    typeof value.round === "number" &&
    typeof value.subject === "string" &&
    typeof value.registrationDate === "string" &&
    (value.status === "applied" || value.status === "cancelled" || value.status === "completed") &&
    typeof value.appliedAt === "string";
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
  return `시험 신청 API 요청에 실패했습니다. (${status})`;
}

async function getCsrfToken(signal?: AbortSignal): Promise<CsrfToken> {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch(buildApiUrl("/auth/csrf"), {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    }).then(async (response) => {
      const body = await parseBody(response);
      if (!response.ok) throw new Error(errorMessage(body, response.status));
      if (!isRecord(body) || typeof body.headerName !== "string" || typeof body.token !== "string") {
        throw new Error("CSRF 토큰 응답 형식이 올바르지 않습니다.");
      }
      return { headerName: body.headerName, token: body.token };
    }).catch((reason: unknown) => {
      csrfTokenPromise = null;
      throw reason;
    });
  }
  return csrfTokenPromise;
}

export const examRegistrationService = {
  async getRegistrations(signal?: AbortSignal): Promise<ExamRegistration[]> {
    const response = await fetch(buildApiUrl("/api/v1/exam-registrations"), {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true ||
      !Array.isArray(body.data) || !body.data.every(isExamRegistration)) {
      throw new Error("시험 신청 API 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async registerExam(
    examId: string,
    registrationDate: string,
    signal?: AbortSignal,
  ): Promise<ExamRegistration> {
    const csrf = await getCsrfToken(signal);
    const response = await fetch(buildApiUrl("/api/v1/exam-registrations"), {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify({ examId, registrationDate }),
      signal,
    });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !isExamRegistration(body.data)) {
      throw new Error("시험 신청 API 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async cancelRegistration(id: string, signal?: AbortSignal): Promise<void> {
    const csrf = await getCsrfToken(signal);
    const response = await fetch(buildApiUrl(`/api/v1/exam-registrations/${encodeURIComponent(id)}`), {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
      headers: { [csrf.headerName]: csrf.token },
      signal,
    });
    const body = await parseBody(response);
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true) {
      throw new Error("시험 신청 취소 API 응답 형식이 올바르지 않습니다.");
    }
  },
};
