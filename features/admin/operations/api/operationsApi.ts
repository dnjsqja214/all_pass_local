import { baseApi } from "@/features/store/api/baseApi";
import { queryResult } from "@/features/store/api/queryError";
import { operationsService } from "../services/operationsService";

const operationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDailyOperations: build.query({
      queryFn: (date: string, api) => queryResult(operationsService.daily(date, api.signal)),
      providesTags: (_result, _error, date) => [{ type: "Operations", id: date }],
    }),
  }),
});

export const { useGetDailyOperationsQuery } = operationsApi;
