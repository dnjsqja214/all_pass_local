import { baseApi } from "@/features/store/api/baseApi";
import { queryResult } from "@/features/store/api/queryError";
import {
  examScheduleService,
  type CreateExamSchedulePolicy,
  type ExamSchedulePolicy,
} from "../services/examScheduleService";

interface UpdateExamScheduleCommand {
  id: string;
  command: CreateExamSchedulePolicy;
}

const examScheduleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExamSchedules: build.query<ExamSchedulePolicy[], void>({
      queryFn: (_argument, api) =>
        queryResult(examScheduleService.findAll(api.signal)),
      providesTags: (result) => result
        ? [
            { type: "ExamSchedule", id: "LIST" },
            ...result.map((policy) => ({
              type: "ExamSchedule" as const,
              id: policy.id,
            })),
          ]
        : [{ type: "ExamSchedule", id: "LIST" }],
    }),
    createExamSchedule: build.mutation<ExamSchedulePolicy, CreateExamSchedulePolicy>({
      queryFn: (command) => queryResult(examScheduleService.create(command)),
      invalidatesTags: [
        { type: "ExamSchedule", id: "LIST" },
        { type: "ExamSlot", id: "LIST" },
      ],
    }),
    updateExamSchedule: build.mutation<ExamSchedulePolicy, UpdateExamScheduleCommand>({
      queryFn: ({ id, command }) =>
        queryResult(examScheduleService.update(id, command)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ExamSchedule", id },
        { type: "ExamSchedule", id: "LIST" },
        { type: "ExamSlot", id: "LIST" },
      ],
    }),
    activateExamSchedule: build.mutation<ExamSchedulePolicy, string>({
      queryFn: (id) => queryResult(examScheduleService.activate(id)),
      invalidatesTags: (_result, _error, id) => [
        { type: "ExamSchedule", id },
        { type: "ExamSchedule", id: "LIST" },
        { type: "ExamSlot", id: "LIST" },
      ],
    }),
    deactivateExamSchedule: build.mutation<void, string>({
      queryFn: (id) => queryResult(examScheduleService.deactivate(id)),
      invalidatesTags: (_result, _error, id) => [
        { type: "ExamSchedule", id },
        { type: "ExamSchedule", id: "LIST" },
        { type: "ExamSlot", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetExamSchedulesQuery,
  useCreateExamScheduleMutation,
  useUpdateExamScheduleMutation,
  useActivateExamScheduleMutation,
  useDeactivateExamScheduleMutation,
} = examScheduleApi;
