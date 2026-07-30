"use client";

import React from "react";
import {
  adminMetrics,
  liveSessionInfo,
} from "../../features/admin/hooks/adminData";
import { MetricCard } from "../../features/admin/components/MetricCard";
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

      {/* 2. 일반 운영 지표 */}
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
    </div>
  );
}
