import React from "react";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: "normal" | "late" | "absent" | "pass" | "fail" | "unsubmitted";
  labelText?: string;
}

export function StatusBadge({ status, labelText }: StatusBadgeProps) {
  const themes = {
    normal: { style: styles.normal, label: "정상" },
    late: { style: styles.late, label: "지각" },
    absent: { style: styles.absent, label: "결석" },
    pass: { style: styles.pass, label: "합격권" },
    fail: { style: styles.fail, label: "과락" },
    unsubmitted: { style: styles.unsubmitted, label: "미제출" },
  };

  const current = themes[status] || themes.unsubmitted;
  const displayLabel = labelText || current.label;

  return (
    <span className={`${styles.badge} ${current.style}`}>
      {displayLabel}
    </span>
  );
}

