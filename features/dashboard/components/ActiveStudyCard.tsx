import React from "react";
import { StudySessionInfo } from "../hooks/useDashboardData";
import styles from "./ActiveStudyCard.module.css";

interface ActiveStudyCardProps {
  session: StudySessionInfo;
}

export function ActiveStudyCard({ session }: ActiveStudyCardProps) {
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
        <span className={styles.badge}>
          {session.badgeText}
        </span>
      </div>

      <button className={styles.button}>
        {/* 비디오 카메라 아이콘 (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <span>{session.linkText}</span>
      </button>
    </div>
  );
}

