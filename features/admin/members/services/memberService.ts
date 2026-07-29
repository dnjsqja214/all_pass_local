import {
  getCsrfToken,
  invalidateCsrfToken,
  withCsrfMutationLock,
  type CsrfToken,
} from "../../../shared/api/csrf";
import {
  MEMBER_ROLES,
  type Member,
  type MemberRole,
  type MemberStatus,
} from "../types/member";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const MEMBER_STATUSES: MemberStatus[] = ["ACTIVE", "INACTIVE", "DORMANT", "DELETED"];

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

function isMemberStatus(value: unknown): value is MemberStatus {
  return typeof value === "string" && MEMBER_STATUSES.includes(value as MemberStatus);
}

function isMemberRole(value: unknown): value is MemberRole {
  return typeof value === "string" && MEMBER_ROLES.some((role) => role === value);
}

function isMember(value: unknown): value is Member {
  return isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.authUuid === "string" &&
    typeof value.email === "string" &&
    typeof value.name === "string" &&
    isNullableString(value.phoneNumber) &&
    isMemberStatus(value.status) &&
    typeof value.createdAt === "string" &&
    isNullableString(value.provider) &&
    Array.isArray(value.roles) && value.roles.every(isMemberRole);
}

function errorMessage(body: unknown, status: number): string {
  return isRecord(body) && typeof body.message === "string"
    ? body.message
    : `회원 목록을 불러오지 못했습니다. (${status})`;
}

export const memberService = {
  async findAll(signal?: AbortSignal): Promise<Member[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
      credentials: "include",
      cache: "no-store",
      signal,
    });
    const body = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
    if (!response.ok) throw new Error(errorMessage(body, response.status));
    if (!isRecord(body) || body.success !== true || !Array.isArray(body.data) || !body.data.every(isMember)) {
      throw new Error("회원 목록 API 응답 형식이 올바르지 않습니다.");
    }
    return body.data;
  },

  async updateRoles(id: string, roles: MemberRole[]): Promise<Member> {
    return withCsrfMutationLock(async () => {
      const execute = (csrf: CsrfToken) => fetch(
        `${API_BASE_URL}/api/v1/admin/users/${encodeURIComponent(id)}/roles`,
        {
          method: "PUT",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            [csrf.headerName]: csrf.token,
          },
          body: JSON.stringify({ roles }),
        },
      );
      let csrf = await getCsrfToken();
      let response = await execute(csrf);
      if (response.status === 403) {
        invalidateCsrfToken(csrf);
        csrf = await getCsrfToken();
        response = await execute(csrf);
      }
      const body = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
      if (!response.ok) throw new Error(errorMessage(body, response.status));
      if (!isRecord(body) || !isMember(body.data)) {
        throw new Error("권한 변경 API 응답 형식이 올바르지 않습니다.");
      }
      return body.data;
    });
  },
};
