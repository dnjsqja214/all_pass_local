"use client";

export interface AdminMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  isAlert: boolean;
}

export type SeatStatusType = "normal" | "late" | "absent";

export interface SeatStatus {
  seatNumber: number;
  status: SeatStatusType;
}

export interface RiskMember {
  id: string;
  type: string; // "과락 위험" | "미제출" | "반복 오답"
  name: string;
  reason: string;
  actionText: string;
}

export interface SubjectScoreDetail {
  name: string;
  score: number | "미제출";
}

export interface MemberScore {
  id: string;
  name: string;
  avatarText: string;
  recentRound: string;
  subjectScores: SubjectScoreDetail[];
  totalScore: number | "-";
  trend: "up" | "down" | "flat";
}

// 1. KPI 지표 카드 Mock 데이터
export const adminMetrics: AdminMetric[] = [
  {
    id: "metric-1",
    title: "출석(오프라인)",
    value: "14/16",
    subtitle: "지각 1 · 결석 1",
    isAlert: false,
  },
  {
    id: "metric-2",
    title: "온라인 참여",
    value: "8",
    subtitle: "전원 카메라 ON",
    isAlert: false,
  },
  {
    id: "metric-3",
    title: "정답지 제출률",
    value: "82%",
    subtitle: "18 / 22명",
    isAlert: false,
  },
  {
    id: "metric-4",
    title: "위험군",
    value: "3",
    subtitle: "즉시 확인 필요",
    isAlert: true,
  },
];

// 2. 실시간 출결 좌석 1~16번 배지 상태 Mock 데이터
export const seatingStatusList: SeatStatus[] = [
  { seatNumber: 1, status: "normal" },
  { seatNumber: 2, status: "normal" },
  { seatNumber: 3, status: "normal" },
  { seatNumber: 4, status: "normal" },
  { seatNumber: 5, status: "normal" },
  { seatNumber: 6, status: "normal" },
  { seatNumber: 7, status: "normal" },
  { seatNumber: 8, status: "normal" },
  { seatNumber: 9, status: "normal" },
  { seatNumber: 10, status: "normal" },
  { seatNumber: 11, status: "normal" },
  { seatNumber: 12, status: "normal" },
  { seatNumber: 13, status: "normal" },
  { seatNumber: 14, status: "late" },     // 14번 지각
  { seatNumber: 15, status: "absent" },   // 15번 결석
  { seatNumber: 16, status: "normal" },
];

// 3. 위험군 회원 목록 Mock 데이터
export const riskMemberList: RiskMember[] = [
  {
    id: "risk-1",
    type: "과락 위험",
    name: "김서연",
    reason: "공시·세법 37.5 — 3세션 연속 40점 미만",
    actionText: "코멘트",
  },
  {
    id: "risk-2",
    type: "미제출",
    name: "박준호",
    reason: "최근 2세션 정답지 미제출",
    actionText: "연락",
  },
  {
    id: "risk-3",
    type: "반복 오답",
    name: "이하늘",
    reason: "도시개발법 단원 5회 연속 오답",
    actionText: "확인",
  },
];

// 4. 회원별 최근 점수 테이블 Mock 데이터
export const memberScoreList: MemberScore[] = [
  {
    id: "score-1",
    name: "김지우",
    avatarText: "지우",
    recentRound: "35회 1회",
    subjectScores: [
      { name: "중개", score: 72.5 },
      { name: "공법", score: 65 },
      { name: "세법", score: 37.5 }, // 과락
    ],
    totalScore: 175,
    trend: "up",
  },
  {
    id: "score-2",
    name: "이민준",
    avatarText: "민준",
    recentRound: "34회 2회",
    subjectScores: [
      { name: "중개", score: 70 },
      { name: "공법", score: 62.5 },
      { name: "세법", score: 55 },
    ],
    totalScore: 187.5, // 합격
    trend: "up",
  },
  {
    id: "score-3",
    name: "박하은",
    avatarText: "하은",
    recentRound: "33회 3회",
    subjectScores: [
      { name: "중개", score: 75 },
      { name: "공법", score: 67.5 },
      { name: "세법", score: 45 },
    ],
    totalScore: 188, // 합격
    trend: "flat",
  },
  {
    id: "score-4",
    name: "최진우",
    avatarText: "진우",
    recentRound: "35회 1회",
    subjectScores: [
      { name: "중개", score: 45 },
      { name: "공법", score: 35 },  // 과락
      { name: "세법", score: 32.5 }, // 과락
    ],
    totalScore: 112.5,
    trend: "down",
  },
  {
    id: "score-5",
    name: "정예지",
    avatarText: "예지",
    recentRound: "35회 1회",
    subjectScores: [
      { name: "중개", score: "미제출" },
      { name: "공법", score: "미제출" },
      { name: "세법", score: "미제출" },
    ],
    totalScore: "-",
    trend: "flat",
  },
];
