import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { accessBlocked } from "./accessGateSlice";

/**
 * 어느 엔드포인트든 서버가 MEMBERSHIP_REQUIRED 를 돌려주면 한 곳에서 안내 모달을 켠다.
 *
 * RTK Query 는 queryFn 이 {error} 를 반환하면 그 액션을 rejectWithValue 로 거절하고,
 * error 객체(= QueryError)를 payload 에 싣는다. 여기서 errorCode 만 보고 판단하므로
 * 버튼마다 개별로 막을 필요가 없다.
 */
export const accessGateMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { errorCode?: string; message?: string } | undefined;
    if (payload?.errorCode === "MEMBERSHIP_REQUIRED") {
      store.dispatch(accessBlocked(payload.message ?? null));
    }
  }
  return next(action);
};
