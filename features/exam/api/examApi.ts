import { baseApi } from "@/features/store/api/baseApi";
import { queryResult } from "@/features/store/api/queryError";
import { examService, type ExamSearchParams } from "../services/examService";
import type {
  AnswerMark,
  ExamDetail,
  ExamListItem,
  SavedExamSession,
  StartedExamSession,
  SubmittedExamSession,
} from "../types/exam";

interface TempSaveCommand {
  sessionId: string;
  answers: AnswerMark[];
  remainingSeconds: number;
}

interface SubmitCommand {
  sessionId: string;
  answers: AnswerMark[];
}

const examApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExams: build.query<ExamListItem[], ExamSearchParams>({
      queryFn: (params, api) =>
        queryResult(examService.findExams(params, api.signal)),
      providesTags: (result) => result
        ? [
            { type: "Exam", id: "LIST" },
            ...result.map((exam) => ({ type: "Exam" as const, id: exam.id })),
          ]
        : [{ type: "Exam", id: "LIST" }],
    }),
    getRegisteredExam: build.query<ExamDetail, string>({
      queryFn: (registrationId, api) =>
        queryResult(examService.getRegisteredExam(registrationId, api.signal)),
      providesTags: (_result, _error, registrationId) => [
        { type: "Registration", id: registrationId },
      ],
    }),
    startExamSession: build.mutation<StartedExamSession, string>({
      queryFn: (registrationId, api) =>
        queryResult(examService.startSession(registrationId, api.signal)),
    }),
    tempSaveExam: build.mutation<SavedExamSession, TempSaveCommand>({
      queryFn: ({ sessionId, answers, remainingSeconds }) =>
        queryResult(examService.tempSave(sessionId, answers, remainingSeconds)),
    }),
    submitExam: build.mutation<SubmittedExamSession, SubmitCommand>({
      queryFn: ({ sessionId, answers }) =>
        queryResult(examService.submit(sessionId, answers)),
      invalidatesTags: [
        { type: "Registration", id: "LIST" },
        { type: "Exam", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useLazyGetExamsQuery,
  useLazyGetRegisteredExamQuery,
  useStartExamSessionMutation,
  useTempSaveExamMutation,
  useSubmitExamMutation,
} = examApi;
