import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { QueryError } from "./queryError";

/**
 * ALLPASS REST 서버 상태의 단일 캐시.
 *
 * 도메인별 API 파일은 이 객체에 endpoint를 주입한다. 하나의 API slice를 사용해야
 * 시험 신청 변경이 대시보드·카운트다운·신청 페이지 캐시를 함께 무효화할 수 있다.
 */
export const baseApi = createApi({
  reducerPath: "allpassApi",
  baseQuery: fakeBaseQuery<QueryError>(),
  tagTypes: [
    "Auth",
    "Exam",
    "Registration",
    "ExamSlot",
    "ExamSchedule",
    "DashboardContent",
    "ChatRoom",
    "ChatMessage",
    "ChatParticipant",
    "ChatUser",
  ],
  endpoints: () => ({}),
});
