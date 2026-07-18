import { AuthCheckResponse, CurrentUser } from "../types/auth";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isAuthCheckResponse(value: unknown): value is AuthCheckResponse {
  if (typeof value !== "object" || value === null) return false;

  const response = value as Record<string, unknown>;
  return (
    typeof response.authenticated === "boolean" &&
    isNullableString(response.name) &&
    isNullableString(response.email) &&
    isNullableString(response.subject) &&
    Array.isArray(response.authorities) &&
    response.authorities.every((authority) => typeof authority === "string") &&
    typeof response.claims === "object" &&
    response.claims !== null &&
    !Array.isArray(response.claims)
  );
}

export const authService = {
  async getCurrentUser(signal?: AbortSignal): Promise<CurrentUser | null> {
    const response = await fetch(buildApiUrl("/auth/check"), {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      throw new Error(`인증 확인에 실패했습니다. (${response.status})`);
    }

    const body: unknown = await response.json();
    if (!isAuthCheckResponse(body)) {
      throw new Error("인증 서버 응답 형식이 올바르지 않습니다.");
    }

    if (!body.authenticated) return null;

    return {
      name: body.name,
      email: body.email,
      subject: body.subject,
      authorities: body.authorities,
      claims: body.claims,
    };
  },

  redirectToLogin(returnTo: string): void {
    const query = new URLSearchParams({ returnTo });
    window.location.assign(buildApiUrl(`/auth/login?${query.toString()}`));
  },

  redirectToLogout(returnTo: string): void {
    const query = new URLSearchParams({ returnTo });
    window.location.assign(buildApiUrl(`/auth/logout?${query.toString()}`));
  },
};
