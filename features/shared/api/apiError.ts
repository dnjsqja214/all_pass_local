/**
 * 서버가 내려준 에러 코드를 담아 나르는 예외.
 *
 * 기존 서비스들은 실패 시 `new Error(message)` 만 던져 서버의 errorCode 를 버렸다.
 * 그러면 프론트가 "권한 없음(MEMBERSHIP_REQUIRED)" 같은 특정 상황을 구분하지 못한다.
 * 이 클래스로 던지면 errorCode 가 queryResult → RTK 미들웨어까지 전달된다.
 */
export class ApiError extends Error {
  readonly errorCode?: string;
  readonly status?: number;

  constructor(message: string, options?: { errorCode?: string; status?: number }) {
    super(message);
    this.name = "ApiError";
    this.errorCode = options?.errorCode;
    this.status = options?.status;
  }
}

/** 서버 에러 본문 {success,errorCode,message} 에서 errorCode 만 안전하게 꺼낸다. */
export function errorCodeOf(body: unknown): string | undefined {
  if (typeof body === "object" && body !== null) {
    const code = (body as Record<string, unknown>).errorCode;
    if (typeof code === "string") return code;
  }
  return undefined;
}
