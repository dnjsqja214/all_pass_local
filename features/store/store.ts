import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { socketReducer } from "@/features/socket/store/socketSlice";
import { themeReducer } from "@/features/theme/store/themeSlice";
import { accessGateReducer } from "@/features/auth/store/accessGateSlice";
import { accessGateMiddleware } from "@/features/auth/store/accessGateMiddleware";
import { baseApi } from "./api/baseApi";

export function makeStore() {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      socket: socketReducer,
      theme: themeReducer,
      accessGate: accessGateReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, accessGateMiddleware),
  });

  setupListeners(store.dispatch);
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
