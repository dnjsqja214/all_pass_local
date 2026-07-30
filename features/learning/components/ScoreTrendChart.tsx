import React from "react";
import styles from "./ScoreTrendChart.module.css";

interface ScoreTrendPoint {
  label: string;
  score: number;
}

interface ScoreTrendChartProps {
  trendData: ScoreTrendPoint[];
  title?: string;
  subtitle?: string;
}

export function ScoreTrendChart({
  trendData,
  title = "반복 응시 - 점수 추이",
  subtitle = "최근 8회 응시 점수 변동 내역",
}: ScoreTrendChartProps) {
  // 실제 저장 점수 범위 [0, 100]을 차트 높이 [150, 0]으로 변환한다.
  const getY = (score: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    return 150 - clamped * 1.5;
  };

  // X 좌표 구하는 함수
  const getX = (index: number, total: number) => {
    if (total <= 1) return 210; // 단일 포인트일 경우 중앙
    const startX = 60;
    const endX = 360;
    const spacing = (endX - startX) / (total - 1);
    return startX + index * spacing;
  };

  const pointsCount = trendData.length;

  // 차트 꺾은선 경로 생성
  const pathD = trendData
    .map((pt, idx) => {
      const prefix = idx === 0 ? "M" : "L";
      return `${prefix} ${getX(idx, pointsCount)} ${getY(pt.score)}`;
    })
    .join(" ");

  // 최신 점수 격려 멘트 생성
  const getEncouragementText = () => {
    if (pointsCount === 0) return "응시 이력이 없습니다.";
    const latest = trendData[pointsCount - 1];
    const passed = latest.score >= 60;
    return (
      <span className={styles.summary}>
        최근 회차 결과 —{" "}
        <strong className={styles.highlight} data-passed={passed}>
          {latest.label} {latest.score}점
        </strong>
        ,{" "}
        <strong className={styles.verdict} data-passed={passed}>
          {passed ? "평균 기준 이상" : "평균 기준 미달"}
        </strong>
      </span>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* SVG 선형 차트 영역 */}
      <div className={styles.chartBox}>
        {pointsCount > 0 ? (
          <svg viewBox="0 0 400 180" className={styles.chart}>
            {/* 가로 그리드선 및 점수 라벨 */}
            <line x1="40" y1="150" x2="380" y2="150" stroke="#E4E0D9" strokeDasharray="3 3" />
            <text x="30" y="154" fill="#817D76" fontSize="10" textAnchor="end">0</text>
            
            <line x1="40" y1="75" x2="380" y2="75" stroke="#E4E0D9" strokeDasharray="3 3" />
            <text x="30" y="79" fill="#817D76" fontSize="10" textAnchor="end">50</text>
            
            <line x1="40" y1="0" x2="380" y2="0" stroke="#E4E0D9" strokeDasharray="3 3" />
            <text x="30" y="4" fill="#817D76" fontSize="10" textAnchor="end">100</text>

            {/* 과목 평균 기준 (60점: y=60) */}
            <line x1="40" y1="60" x2="380" y2="60" stroke="#3F7D4E" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="385" y="64" fill="#3F7D4E" fontSize="9" fontWeight="bold" textAnchor="start">평균 기준 (60점)</text>

            {/* 차트 꺾은선 */}
            {pointsCount > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke="#C93A35"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 포인트 닷 및 텍스트 렌더링 */}
            {trendData.map((pt, idx) => {
              const cx = getX(idx, pointsCount);
              const cy = getY(pt.score);
              const isPass = pt.score >= 60;
              return (
                <g key={idx}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill={isPass ? "#3F7D4E" : "#C93A35"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy - 13}
                    fill={isPass ? "#3F7D4E" : "#111111"}
                    fontSize="11"
                    fontWeight="extrabold"
                    textAnchor="middle"
                  >
                    {pt.score}점
                  </text>
                  <text
                    x={cx}
                    y="172"
                    fill="#817D76"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className={styles.empty}>점수 기록이 없습니다.</div>
        )}
      </div>

      {/* 하단 격려 및 정보 문구 */}
      <div className={styles.footer}>{getEncouragementText()}</div>
    </div>
  );
}
