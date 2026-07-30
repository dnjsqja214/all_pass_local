"use client";

export interface AdminMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  isAlert: boolean;
}

export const liveSessionInfo = {
  title: "오늘 현황",
  sessionStatus: "오전반 실시간 세션 진행 중 · 10:05–10:55",
};

export const adminMetrics: AdminMetric[] = [
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
];
