import React from "react";
import styles from "./SubjectScoreList.module.css";

interface SubjectScoreItem {
  subject: string;
  score: number;
}

interface SubjectScoreListProps {
  subjectScores: SubjectScoreItem[];
}

export function SubjectScoreList({ subjectScores }: SubjectScoreListProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>과목별 최근 점수</h4>
      <div className={styles.list}>
        {subjectScores.map((item, idx) => {
          const isFailed = item.score < 40;
          return (
            <div key={idx} className={styles.row}>
              <span className={styles.subject}>{item.subject}</span>
              <span className={styles.score} data-failed={isFailed}>
                {item.score.toFixed(1)}점
                {isFailed && <span className={styles.failBadge}>과락</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
