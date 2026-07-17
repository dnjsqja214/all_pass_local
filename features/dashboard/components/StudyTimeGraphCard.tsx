import React from "react";
import { DailyStudyTime } from "../hooks/useDashboardData";
import cardStyles from "./DashboardCard.module.css";
import styles from "./StudyTimeGraphCard.module.css";

interface StudyTimeGraphCardProps {
  studyTimes: DailyStudyTime[];
}

export function StudyTimeGraphCard({ studyTimes }: StudyTimeGraphCardProps) {
  // 전체 공부 시간 합산
  const totalHours = studyTimes.reduce((acc, curr) => acc + curr.hours, 0);
  
  // 그래프 최대 높이 기준값 (가장 많이 공부한 시간 찾기, 최소값 5시간으로 고정하여 안정적인 높이 보장)
  const maxHours = Math.max(...studyTimes.map((t) => t.hours), 5);

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.header}>
        <div className="flex flex-col gap-0.5">
          <h4 className={cardStyles.title}>
            일별 공부 시간
          </h4>
          <p className={cardStyles.subtitle}>
            요일별 학습 몰입도 비교
          </p>
        </div>
        <div className="text-right">
          <span className={styles.totalText}>
            총 {totalHours.toFixed(1)}h
          </span>
        </div>
      </div>

      {/* 바 그래프 영역 */}
      <div className={styles.chart}>
        {studyTimes.map((item, index) => {
          const heightPercent = (item.hours / maxHours) * 100;
          return (
            <div key={index} className={styles.barCol}>
              {/* 시간 텍스트 (바 위에 노출) */}
              <span className={styles.barVal}>
                {item.hours > 0 ? `${item.hours.toFixed(1)}` : "-"}
              </span>
              
              {/* 그래프 바 */}
              <div className={styles.barContainer}>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={styles.barFill}
                />
              </div>

              {/* 요일 */}
              <span className={styles.dayLabel}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

