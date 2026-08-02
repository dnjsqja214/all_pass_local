import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AccessGateState {
  /** 서버가 권한 없음(MEMBERSHIP_REQUIRED)을 돌려줘 안내 모달을 띄워야 하는 상태. */
  blocked: boolean;
  /** 서버가 준 안내 문구. 없으면 모달의 기본 문구를 쓴다. */
  message: string | null;
}

const initialState: AccessGateState = { blocked: false, message: null };

const accessGateSlice = createSlice({
  name: "accessGate",
  initialState,
  reducers: {
    accessBlocked(state, action: PayloadAction<string | null>) {
      state.blocked = true;
      state.message = action.payload;
    },
    accessGateDismissed(state) {
      state.blocked = false;
      state.message = null;
    },
  },
});

export const { accessBlocked, accessGateDismissed } = accessGateSlice.actions;
export const accessGateReducer = accessGateSlice.reducer;
