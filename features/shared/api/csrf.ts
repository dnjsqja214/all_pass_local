const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface CsrfToken {
  headerName: string;
  token: string;
}

let cachedToken: CsrfToken | null = null;
let tokenRequest: Promise<CsrfToken> | null = null;
let mutationQueue: Promise<void> = Promise.resolve();

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

/** 쿠키가 다른 탭이나 요청에서 갱신된 경우 캐시를 폐기한다. */
export function invalidateCsrfToken(token?: CsrfToken): void {
  if (!token || cachedToken?.token === token.token) {
    cachedToken = null;
  }
}

/**
 * CSRF 쿠키는 브라우저에 하나만 존재하므로 토큰을 사용하는 변경 요청도 순서대로
 * 실행해야 한다. 병렬 요청 중 하나가 토큰을 다시 발급받으면 다른 요청의 헤더와
 * 쿠키가 달라져 403이 발생할 수 있다.
 */
export function withCsrfMutationLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
