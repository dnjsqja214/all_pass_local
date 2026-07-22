"use client";

import { useState } from "react";

export type TabType = "today" | "exam" | "incorrect" | "profile" | "apply-exam";

export interface StudySessionInfo {
  title: string;
  timeRange: string;
  badgeText: string;
  linkText: string;
}

export interface TodoItem {
  id: string;
  title: string;
  subtitle: string;
  status: "wait" | "delayed" | "completed";
  statusText: string;
}

export interface WeeklyStat {
  value: string;
  label: string;
}

export interface RecentExam {
  id: string;
  title: string;
  score: number;
  date: string;
  isPassed: boolean;
}

export interface DailyStudyTime {
  day: string;
  hours: number;
}

export interface ScoreTrend {
  round: string;
  score: number;
}

export interface SubjectScore {
  name: string;
  score: number;
  date?: string;
  roundTitle?: string;
  attemptTitle?: string;
}

export interface ExamAttempt {
  id: string;
  roundTitle: string;
  attemptTitle: string;
  date: string;
  subjectScores: SubjectScore[];
  totalScore: number;
}

export interface WrongNote {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  frequency: number;
  cause: "unknown" | "confused" | "mistake";
  aiSummary: string;
  similarQuestionCount: number;
  createdAt: string;
}

export function useDashboardData(initialTab: TabType = "today") {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  // 학습관리용 점수 추이 Mock 데이터
  const scoreTrend: ScoreTrend[] = [
    { round: "1회", score: 142 },
    { round: "2회", score: 163 },
    { round: "3회", score: 188 },
  ];

  // 학습관리용 회차별 응시 이력 Mock 데이터
  const examAttempts: ExamAttempt[] = [
    {
      id: "attempt-1",
      roundTitle: "35회",
      attemptTitle: "1회",
      date: "07/22",
      subjectScores: [
        { name: "중개", score: 72.5, date: "2026-07-22", roundTitle: "35회", attemptTitle: "1회" },
        { name: "공법", score: 65, date: "2026-07-20", roundTitle: "34회", attemptTitle: "2회" },
        { name: "세법", score: 37.5, date: "2026-07-21", roundTitle: "35회", attemptTitle: "1회" },
      ],
      totalScore: 175,
    },
    {
      id: "attempt-2",
      roundTitle: "34회",
      attemptTitle: "2회",
      date: "07/18",
      subjectScores: [
        { name: "중개", score: 70, date: "2026-07-18", roundTitle: "34회", attemptTitle: "2회" },
        { name: "공법", score: 62.5, date: "2026-07-15", roundTitle: "33회", attemptTitle: "3회" },
        { name: "세법", score: 55, date: "2026-07-18", roundTitle: "34회", attemptTitle: "2회" },
      ],
      totalScore: 187.5,
    },
    {
      id: "attempt-3",
      roundTitle: "33회",
      attemptTitle: "3회",
      date: "07/15",
      subjectScores: [
        { name: "중개", score: 75, date: "2026-07-15", roundTitle: "33회", attemptTitle: "3회" },
        { name: "공법", score: 67.5, date: "2026-07-13", roundTitle: "33회", attemptTitle: "3회" },
        { name: "세법", score: 45, date: "2026-07-13", roundTitle: "33회", attemptTitle: "3회" },
      ],
      totalScore: 188,
    },
    {
      id: "attempt-4",
      roundTitle: "32회",
      attemptTitle: "4회",
      date: "07/10",
      subjectScores: [
        { name: "중개", score: 80, date: "2026-07-10", roundTitle: "32회", attemptTitle: "4회" },
        { name: "공법", score: 58, date: "2026-07-07", roundTitle: "31회", attemptTitle: "5회" },
      ],
      totalScore: 138,
    },
    {
      id: "attempt-5",
      roundTitle: "31회",
      attemptTitle: "5회",
      date: "07/06",
      subjectScores: [
        { name: "중개", score: 68, date: "2026-07-06", roundTitle: "31회", attemptTitle: "5회" },
      ],
      totalScore: 68,
    },
  ];

  // 오답노트 Mock 데이터
  const wrongNotes: WrongNote[] = [
    {
      id: "wrong-1",
      subject: "부동산세법",
      chapter: "취득세",
      topic: "취득세 과세표준",
      frequency: 3,
      cause: "mistake",
      aiSummary: "시가표준액 · 무상취득 · 과세시가 · 할인율 등\n2026년 예상 중요도 높음",
      similarQuestionCount: 3,
      createdAt: "07/06",
    },
    {
      id: "wrong-2",
      subject: "부동산공법",
      chapter: "국토의 계획 및 이용에 관한 법률",
      topic: "용도지역 및 용도지구 지정",
      frequency: 2,
      cause: "confused",
      aiSummary: "건폐율 및 용적률 기준선 · 특별시 조례 등\n자주 헷갈리는 공법 행위 제한 기준 정리",
      similarQuestionCount: 2,
      createdAt: "07/05",
    },
    {
      id: "wrong-3",
      subject: "중개·물권",
      chapter: "공인중개사법",
      topic: "개업공인중개사의 금지행위",
      frequency: 3,
      cause: "unknown",
      aiSummary: "법정 수수료 초과 수수 · 명의 대여 판례\n아예 개념 정리가 부족한 암기 영역",
      similarQuestionCount: 4,
      createdAt: "07/02",
    },
    {
      id: "wrong-4",
      subject: "부동산세법",
      chapter: "등록면허세",
      topic: "등록면허세 세율 및 비과세",
      frequency: 2,
      cause: "confused",
      aiSummary: "표준세율의 50% 가감범위 · 등록세 연동 항목\n세부 등록 목적별 세율 암기 필요",
      similarQuestionCount: 2,
      createdAt: "07/07",
    },
    {
      id: "wrong-5",
      subject: "부동산공법",
      chapter: "도시개발법",
      topic: "도시개발구역의 지정권자 및 해제",
      frequency: 3,
      cause: "unknown",
      aiSummary: "국토교통부장관 지정 사유 · 개발구역 지정 해제 의제일\n암기 법조문 반복 학습 권장",
      similarQuestionCount: 5,
      createdAt: "07/08",
    },
    {
      id: "wrong-6",
      subject: "부동산공법",
      chapter: "건축법",
      topic: "건축허가 및 건축신고 대상",
      frequency: 1,
      cause: "mistake",
      aiSummary: "신고 대상 건축물 면적 기준 · 건축허가 제한 기간\n유사 조문 간 헷갈리기 쉬운 함정 대비",
      similarQuestionCount: 3,
      createdAt: "07/09",
    },
    {
      id: "wrong-7",
      subject: "중개·물권",
      chapter: "부동산 거래신고 등에 관한 법률",
      topic: "부동산 거래신고 기한 및 위반 과태료",
      frequency: 2,
      cause: "mistake",
      aiSummary: "체결일로부터 30일 이내 신고 · 해제 등 신고 의무\n신고 기한 및 주체 명확히 구분",
      similarQuestionCount: 3,
      createdAt: "07/10",
    }
  ];

  // 시험 D-Day 일정 Mock 데이터 (DB에서 조회해온 원시 날짜 포맷)
  const examDDayInfo = {
    examRound: 37,
    examDate: "2026-10-31",
    registrationStart: "2026-08-03",
    registrationEnd: "2026-08-07",
    announcementDate: "2026-12-02",
  };

  // 실시간 D-Day 계산 헬퍼 (timezone-safe)
  const [year, month, day] = examDDayInfo.examDate.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const diffMs = targetDate.getTime() - todayMidnight.getTime();
  const examDDay = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return {
    activeTab,
    setActiveTab,
    scoreTrend,
    examAttempts,
    wrongNotes,
    examDDay,
    examDDayInfo,
  };
}
