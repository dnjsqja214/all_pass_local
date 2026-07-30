import { baseApi } from "@/features/store/api/baseApi";
import { queryResult } from "@/features/store/api/queryError";
import {
  examRegistrationService,
  type ExamRegistration,
  type ExamSlot,
} from "../services/examRegistrationService";

export interface RegistrationSnapshot {
  registrations: ExamRegistration[];
  serverNow: number;
  roundTripMillis: number;
}

export const examRegistrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRegistrations: build.query<RegistrationSnapshot, void>({
      queryFn: (_argument, api) =>
        queryResult(examRegistrationService.getRegistrationsWithServerTime(api.signal)),
      providesTags: (result) => result
        ? [
            { type: "Registration", id: "LIST" },
            ...result.registrations.map((registration) => ({
              type: "Registration" as const,
              id: registration.id,
            })),
          ]
        : [{ type: "Registration", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getOpenExamSlots: build.query<ExamSlot[], void>({
      queryFn: (_argument, api) =>
        queryResult(examRegistrationService.getOpenSlots(api.signal)),
      providesTags: [{ type: "ExamSlot", id: "LIST" }],
    }),
    registerExam: build.mutation<ExamRegistration, Pick<ExamSlot, "examId" | "startsAt">>({
      queryFn: (slot, api) =>
        queryResult(examRegistrationService.registerExam(slot, api.signal)),
      invalidatesTags: [
        { type: "Registration", id: "LIST" },
        { type: "ExamSlot", id: "LIST" },
      ],
    }),
    cancelRegistration: build.mutation<void, string>({
      queryFn: (id, api) =>
        queryResult(examRegistrationService.cancelRegistration(id, api.signal)),
      invalidatesTags: (_result, _error, id) => [
        { type: "Registration", id },
        { type: "Registration", id: "LIST" },
        { type: "ExamSlot", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRegistrationsQuery,
  useGetOpenExamSlotsQuery,
  useLazyGetOpenExamSlotsQuery,
  useRegisterExamMutation,
  useCancelRegistrationMutation,
} = examRegistrationApi;
