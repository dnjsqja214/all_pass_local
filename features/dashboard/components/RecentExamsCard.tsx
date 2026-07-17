import React from "react";
import { RecentExam } from "../hooks/useDashboardData";
import cardStyles from "./DashboardCard.module.css";
import styles from "./RecentExamsCard.module.css";

interface RecentExamsCardProps {
  exams: RecentExam[];
}

export function RecentExamsCard({ exams }: RecentExamsCardProps) {
  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.header}>
        <h4 className={cardStyles.title}>
          최근 시험 결과
        </h4>
        <span className={cardStyles.subtitle}>
          최근 3회 기준
        </span>
      </div>

      <div className={styles.listWrapper}>
        {exams.map((exam) => (
          <div
            key={exam.id}
            className={styles.itemRow}
          >
            <div className={styles.infoArea}>
              <span className={styles.examTitle}>
                {exam.title}
              </span>
              <span className={styles.date}>
                풀이일: {exam.date}
              </span>
            </div>
            
            <div className={styles.valueArea}>
              <span className={styles.score}>
                {exam.score}점
              </span>
              <span
                className={`${styles.badge} ${
                  exam.isPassed ? styles.badgePass : styles.badgeFail
                }`}
              >
                {exam.isPassed ? "합격" : "불합격"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

