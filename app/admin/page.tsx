"use client";

import React from "react";
import {
  adminMetrics,
  seatingStatusList,
  riskMemberList,
  memberScoreList,
  liveSessionInfo,
} from "../../features/admin/hooks/adminData";
import { MetricCard } from "../../features/admin/components/MetricCard";
import { AttendanceSeatGrid } from "../../features/admin/components/AttendanceSeatGrid";
import { RiskMemberList } from "../../features/admin/components/RiskMemberList";
import { RecentScoreTable } from "../../features/admin/components/RecentScoreTable";
import styles from "./page.module.css";

export default function AdminDashboard() {
  return (
    <div className={styles.page}>
      {/* 1. 오늘 현황 헤더 영역 */}
      <div className={styles.header}>
        <h3 className={styles.title}>{liveSessionInfo.title}</h3>

        {/* 실시간 세션 진행 상태 배지 */}
        <div className={styles.sessionStatus}>
          <div className={styles.liveDot} />
          <span>{liveSessionInfo.sessionStatus}</span>
        </div>
      </div>

      {/* 2. 주요 KPI 지표 카드 (데스크톱 4열, 태블릿 2열, 모바일 1열) */}
      <div className={styles.metricGrid}>
        {adminMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            isAlert={metric.isAlert}
          />
        ))}
      </div>

      {/* 3. 상세 대시보드 그리드 영역 (데스크톱 좌우 2단 배치 / 모바일&태블릿 세로 스택) */}
      <div className={styles.detailGrid}>

        {/* 좌측단 (5열): 출결 현황 + 위험군 리스트 */}
        <div className={styles.leftColumn}>
          {/* 실시간 지정 좌석 출결 배치도 */}
          <AttendanceSeatGrid seats={seatingStatusList} />

          {/* 금일 관리 대상 위험군 목록 */}
          <RiskMemberList members={riskMemberList} />
        </div>

        {/* 우측단 (7열): 학생 최근 성적 요약표 */}
        <div className={styles.rightColumn}>
          <RecentScoreTable scores={memberScoreList} />
        </div>

      </div>
    </div>
  );
}
