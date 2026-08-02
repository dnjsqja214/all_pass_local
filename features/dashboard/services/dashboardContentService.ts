import { getCsrfToken } from "../../shared/api/csrf";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export type DashboardContentType = "EXAM" | "NOTICE";

export interface DashboardContent {
  id: string;
  type: DashboardContentType;
  eyebrow: string | null;
  title: string;
  body: string | null;
  examRound: number | null;
  examDate: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  announcementDate: string | null;
  subjectSummary: string | null;
  visibleFrom: string;
  visibleUntil: string | null;
  active: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardContentCommand {
  type: DashboardContentType;
  eyebrow: string | null;
  title: string;
  body: string | null;
  examRound: number | null;
  examDate: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  announcementDate: string | null;
  subjectSummary: string | null;
  visibleFrom: string;
  visibleUntil: string | null;
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

function isContent(value: unknown): value is DashboardContent {
  return isRecord(value) &&
    typeof value.id === "string" &&
    (value.type === "EXAM" || value.type === "NOTICE") &&
    isNullableString(value.eyebrow) &&
    typeof value.title === "string" &&
    isNullableString(value.body) &&
    (value.examRound === null || typeof value.examRound === "number") &&
    isNullableString(value.examDate) &&
    isNullableString(value.registrationStart) &&
    isNullableString(value.registrationEnd) &&
    isNullableString(value.announcementDate) &&
    isNullableString(value.subjectSummary) &&
    typeof value.visibleFrom === "string" &&
    isNullableString(value.visibleUntil) &&
    typeof value.active === "boolean" &&
    isNullableString(value.createdBy) &&
    isNullableString(value.updatedBy) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string";
}

async function parse(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function message(body: unknown, status: number): string {
  return isRecord(body) && typeof body.message === "string"
    ? body.message
    : `대시보드 API 요청에 실패했습니다. (${status})`;
}

async function mutate<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body: DashboardContentCommand | undefined,
  validate: (value: unknown) => value is T,
): Promise<T> {
  const csrf = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      [csrf.headerName]: csrf.token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await parse(response);
  if (!response.ok) throw new Error(message(payload, response.status));
  if (!isRecord(payload) || payload.success !== true || !validate(payload.data)) {
    throw new Error("대시보드 API 응답 형식이 올바르지 않습니다.");
  }
  return payload.data;
}

export const dashboardContentService = {
  async current(signal?: AbortSignal): Promise<DashboardContent[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard`, {
      credentials: "include", cache: "no-store", signal,
    });
    const payload = await parse(response) as ApiResponse<unknown> | null;
    if (!response.ok) throw new Error(message(payload, response.status));
    if (!isRecord(payload) || payload.success !== true ||
        !Array.isArray(payload.data) || !payload.data.every(isContent)) {
      throw new Error("대시보드 API 응답 형식이 올바르지 않습니다.");
    }
    return payload.data;
  },

  async findAll(signal?: AbortSignal): Promise<DashboardContent[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/contents`, {
      credentials: "include", cache: "no-store", signal,
    });
    const payload = await parse(response);
    if (!response.ok) throw new Error(message(payload, response.status));
    if (!isRecord(payload) || payload.success !== true ||
        !Array.isArray(payload.data) || !payload.data.every(isContent)) {
      throw new Error("대시보드 콘텐츠 목록 응답 형식이 올바르지 않습니다.");
    }
    return payload.data;
  },

  create: (command: DashboardContentCommand) =>
    mutate("/api/v1/admin/dashboard/contents", "POST", command, isContent),
  update: (id: string, command: DashboardContentCommand) =>
    mutate(`/api/v1/admin/dashboard/contents/${encodeURIComponent(id)}`, "PUT", command, isContent),
  activate: (id: string) =>
    mutate(`/api/v1/admin/dashboard/contents/${encodeURIComponent(id)}/activate`, "POST", undefined, isContent),
  deactivate: (id: string) =>
    mutate(`/api/v1/admin/dashboard/contents/${encodeURIComponent(id)}`, "DELETE", undefined,
      (value): value is null => value === null),
};
