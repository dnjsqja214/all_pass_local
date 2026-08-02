import { ApiError } from "@/features/shared/api/apiError";

export interface QueryError {
  message: string;
  /** 서버가 준 에러 코드(예: MEMBERSHIP_REQUIRED). 전역 처리에서 상황을 구분하는 데 쓴다. */
  errorCode?: string;
}

export async function queryResult<T>(
  request: Promise<T>,
): Promise<{ data: T } | { error: QueryError }> {
  try {
    // void 요청은 undefined 로 resolve 되는데, RTK Query 는 data: undefined 를
    // "결과 없음"으로 보아 경고한다. 실을 본문이 없다는 뜻이므로 null 로 표현한다.
    const data = await request;
    return { data: (data === undefined ? null : data) as T };
  } catch (reason: unknown) {
    return {
      error: {
        message: reason instanceof Error
          ? reason.message
          : "요청을 처리하지 못했습니다.",
        errorCode: reason instanceof ApiError ? reason.errorCode : undefined,
      },
    };
  }
}

export function queryErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}
