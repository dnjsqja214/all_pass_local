"use client";

import React from "react";
import {
  adminMetrics,
  riskMemberList,
  memberScoreList,
} from "../../features/admin/hooks/adminData";
import { MetricCard } from "../../features/admin/components/MetricCard";
import { RiskMemberList } from "../../features/admin/components/RiskMemberList";
import { RecentScoreTable } from "../../features/admin/components/RecentScoreTable";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 2. 주요 KPI 지표 카드 (데스크톱 4열, 태블릿 2열, 모바일 1열) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* 좌측단 (5열): 출결 현황 + 위험군 리스트 */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* 금일 관리 대상 위험군 목록 */}
          <RiskMemberList members={riskMemberList} />
        </div>

        {/* 우측단 (7열): 학생 최근 성적 요약표 */}
        <div className="lg:col-span-7">
          <RecentScoreTable scores={memberScoreList} />
        </div>

      </div>
    </div>
  );
}
