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

  // 실시간 스터디 세션 Mock 데이터
  const activeSession: StudySessionInfo = {
    title: "오전반 실시간 스터디",
    timeRange: "10:00 - 11:00",
    badgeText: "시작 10분 전",
    linkText: "문제풀이",
  };

  // 오늘 할 일 Mock 데이터
  const todoList: TodoItem[] = [
    {
      id: "todo-1",
      title: "35회 부동산공법 풀이",
      subtitle: "실시간 세션 • 40문항",
      status: "wait",
      statusText: "대기",
    },
    {
      id: "todo-2",
      title: "오답 복습 5문항",
      subtitle: "지난 세션 취약 개념",
      status: "delayed",
      statusText: "밀림",
    },
  ];

  // 이번 주 학습 통계 데이터
  const weeklyStats: WeeklyStat[] = [
    { value: "14.5h", label: "공부 시간" },
    { value: "6", label: "푼 회차" },
    { value: "68%", label: "평균 정답률" },
  ];

  // 최근 시험 Mock 데이터
  const recentExams: RecentExam[] = [
    { id: "exam-1", title: "34회 부동산학개론", score: 85, date: "07.10", isPassed: true },
    { id: "exam-2", title: "34회 민법 및 민사특별법", score: 72, date: "07.08", isPassed: true },
    { id: "exam-3", title: "35회 부동산공법 (연습)", score: 58, date: "07.05", isPassed: false },
  ];

  // 공부 시간 그래프 데이터 (단위: 시간)
  const dailyStudyTime: DailyStudyTime[] = [
    { day: "월", hours: 2.0 },
    { day: "화", hours: 3.5 },
    { day: "수", hours: 1.5 },
    { day: "목", hours: 4.0 },
    { day: "금", hours: 2.5 },
    { day: "토", hours: 5.0 },
    { day: "일", hours: 1.0 },
  ];

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
      date: "07/06",
      subjectScores: [
        { name: "중개", score: 72.5 },
        { name: "공법", score: 65 },
        { name: "세법", score: 37.5 },
      ],
      totalScore: 175,
    },
    {
      id: "attempt-2",
      roundTitle: "34회",
      attemptTitle: "2회",
      date: "07/04",
      subjectScores: [
        { name: "중개", score: 70 },
        { name: "공법", score: 62.5 },
        { name: "세법", score: 55 },
      ],
      totalScore: 187.5,
    },
    {
      id: "attempt-3",
      roundTitle: "33회",
      attemptTitle: "3회",
      date: "07/02",
      subjectScores: [
        { name: "중개", score: 75 },
        { name: "공법", score: 67.5 },
        { name: "세법", score: 45 },
      ],
      totalScore: 188,
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
  ];

  const examDDay = 117; // D-117

  return {
    activeTab,
    setActiveTab,
    activeSession,
    todoList,
    weeklyStats,
    recentExams,
    dailyStudyTime,
    scoreTrend,
    examAttempts,
    wrongNotes,
    examDDay,
  };
}
