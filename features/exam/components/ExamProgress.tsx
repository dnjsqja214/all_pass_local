import React from "react";
import type { SaveStatus } from "../hooks/useExamData";
import styles from "./ExamProgress.module.css";

interface ExamProgressProps {
  markedCount: number;
  totalQuestions: number;
  saveStatus: SaveStatus;
}

const SAVE_LABELS: Record<SaveStatus, string> = {
  saved: "자동 저장됨",
  saving: "저장 중...",
  error: "저장 실패",
};

export function ExamProgress({ markedCount, totalQuestions, saveStatus }: ExamProgressProps) {
  return (
    <div className={styles.progress} data-status={saveStatus}>
      <span className={styles.count}>
        제출 {markedCount} / {totalQuestions}
      </span>
      <div className={styles.status}>
        <div className={styles.dot} />
        <span className={styles.label}>{SAVE_LABELS[saveStatus]}</span>
      </div>
    </div>
  );
}
