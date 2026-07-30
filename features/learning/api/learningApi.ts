import { baseApi } from "@/features/store/api/baseApi";
import { queryResult } from "@/features/store/api/queryError";
import { learningManagementService } from "../services/learningManagementService";

const learningApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLearningManagement: build.query({
      queryFn: (_argument: void, api) => queryResult(learningManagementService.get(api.signal)),
      providesTags: [{ type: "Learning", id: "DASHBOARD" }],
    }),
  }),
});

export const { useGetLearningManagementQuery } = learningApi;
