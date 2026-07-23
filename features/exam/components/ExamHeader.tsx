import React from "react";
import styles from "./ExamHeader.module.css";

interface ExamHeaderProps {
  examDDay: number;
}

export function ExamHeader({ examDDay }: ExamHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>실시간 문제풀이</h1>
      <span className={styles.dDay}>시험까지 D-{examDDay}</span>
    </div>
  );
}
