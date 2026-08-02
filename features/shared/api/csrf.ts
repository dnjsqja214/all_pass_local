const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface CsrfToken {
  headerName: string;
  token: string;
}

let cachedToken: CsrfToken | null = null;
let tokenRequest: Promise<CsrfToken> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function requestCsrfToken(signal?: AbortSignal): Promise<CsrfToken> {
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    credentials: "include",
    cache: "no-store",
    signal,
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`CSRF 토큰 요청에 실패했습니다. (${response.status})`);
  if (!isRecord(body) || typeof body.headerName !== "string" || typeof body.token !== "string") {
    throw new Error("CSRF 토큰 응답 형식이 올바르지 않습니다.");
  }
  return { headerName: body.headerName, token: body.token };
}

export async function getCsrfToken(signal?: AbortSignal): Promise<CsrfToken> {
  if (cachedToken) return cachedToken;

  tokenRequest ??= requestCsrfToken(signal)
    .then((token) => {
      cachedToken = token;
      return token;
    })
    .finally(() => {
      tokenRequest = null;
    });

  return tokenRequest;
}
