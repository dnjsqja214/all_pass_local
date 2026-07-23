import React from "react";
import { ExamStatus } from "../types/exam";
import styles from "./ExamStatusBadge.module.css";

interface ExamStatusBadgeProps {
  status: ExamStatus;
}

const STATUS_LABELS: Record<ExamStatus, string> = {
  available: "미응시",
  completed: "응시 완료",
  scheduled: "응시 예정",
};

export function ExamStatusBadge({ status }: ExamStatusBadgeProps) {
  return (
    <span className={styles.badge} data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  );
}
