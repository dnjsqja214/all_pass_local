import React from "react";
import styles from "./ExamTimer.module.css";

interface ExamTimerProps {
  title: string;
  remainingSeconds: number;
}

export function ExamTimer({ title, remainingSeconds }: ExamTimerProps) {
  // MM:SS 포맷 헬퍼
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isWarning = remainingSeconds <= 600; // 10분 이하 여부

  return (
    <div className={styles.timer} data-warning={isWarning}>
      <div className={styles.info}>
        <span className={styles.caption}>실시간 문제풀이</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.remaining}>
        <span className={styles.remainingLabel}>남은 시간</span>
        <span className={styles.clock}>{formatTime(remainingSeconds)}</span>
      </div>
    </div>
  );
}
