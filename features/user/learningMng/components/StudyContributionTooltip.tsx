import React from "react";
import { formatMinutesToHoursAndMinutes } from "../services/studyService";
import styles from "./StudyContributionTooltip.module.css";

interface StudyContributionTooltipProps {
  studyDate: string;
  studyMinutes: number;
  questionCount: number;
  position: { x: number; y: number } | null;
  visible: boolean;
}

export function StudyContributionTooltip({
  studyDate,
  studyMinutes,
  questionCount,
  position,
  visible,
}: StudyContributionTooltipProps) {
  if (!visible || !position) return null;

  const formatDateString = (dateStr: string): string => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return `${year}년 ${month}월 ${day}일`;
  };

  const formattedDate = formatDateString(studyDate);
  const hasStudy = studyMinutes > 0;

  return (
    <div
      className={styles.tooltip}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className={styles.date}>{formattedDate}</div>
      {hasStudy ? (
        <div className={styles.content}>
          <div>공부 시간: {formatMinutesToHoursAndMinutes(studyMinutes)}</div>
          <div>문제 풀이: {questionCount}문제</div>
        </div>
      ) : (
        <div className={styles.noRecord}>공부 기록 없음</div>
      )}
      <div className={styles.arrow} />
    </div>
  );
}
