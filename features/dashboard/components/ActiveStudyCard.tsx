import React from "react";
import { StudySessionInfo } from "../hooks/useDashboardData";
import styles from "./ActiveStudyCard.module.css";

interface ActiveStudyCardProps {
  session: StudySessionInfo;
  onSelectExamClick?: () => void;
  onSolveClick?: () => void;
}

export function ActiveStudyCard({
  session,
  onSelectExamClick,
  onSolveClick,
}: ActiveStudyCardProps) {
  return (
    <div className={styles.card}>
      <div className="flex justify-between items-start">
        <div className={styles.textGroup}>
          <span className={styles.title}>
            {session.title}
          </span>
          <h2 className={styles.time}>
            {session.timeRange}
          </h2>
        </div>
        <button
          onClick={onSelectExamClick}
          className={`${styles.badge} hover:bg-[#FFFFFF55] active:bg-[#FFFFFF77] transition-all cursor-pointer font-semibold border-none outline-none bg-transparent`}
        >
          시험 선택
        </button>
      </div>

      <button onClick={onSolveClick} className={styles.button}>
        <span>{session.linkText}</span>
      </button>
    </div>
  );
}
