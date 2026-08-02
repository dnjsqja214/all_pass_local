import { getCsrfToken } from "@/features/shared/api/csrf";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface FeaturePolicy {
  featureKey: string;
  requiredRole: string;
  description: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFeaturePolicy(value: unknown): value is FeaturePolicy {
  return isRecord(value) &&
    typeof value.featureKey === "string" &&
    typeof value.requiredRole === "string" &&
    (value.description === null || typeof value.description === "string");
}

function errorMessage(body: unknown, status: number): string {
  return isRecord(body) && typeof body.message === "string"
    ? body.message
    : `접근 정책 요청에 실패했습니다. (${status})`;
}

export const accessPolicyService = {
  async findAll(signal?: AbortSignal): Promise<FeaturePolicy[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/feature-policies`, {
      credentials: "include",
      cache: "no-store",
      signal,
    });
    const body = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !Array.isArray(body.data) || !body.data.every(isFeaturePolicy)) {
      throw new Error("접근 정책 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async updateRole(featureKey: string, requiredRole: string): Promise<void> {
    const csrf = await getCsrfToken();
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/feature-policies/${encodeURIComponent(featureKey)}`,
      {
        method: "PUT",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({ requiredRole }),
      },
    );
    const body = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
    if (!response.ok) throw new Error(errorMessage(body, response.status));
  },
};
