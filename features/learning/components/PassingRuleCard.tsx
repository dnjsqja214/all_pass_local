import React from "react";
import styles from "./PassingRuleCard.module.css";

interface SubjectScoreItem {
  subject: string;
  score: number;
}

interface PassingRuleCardProps {
  totalScore: number;
  subjectScores: SubjectScoreItem[];
}

export function PassingRuleCard({ totalScore, subjectScores }: PassingRuleCardProps) {
  const hasFailSubject = subjectScores.some((sub) => sub.score < 40);
  const isPassed = totalScore >= 180 && !hasFailSubject;

  // 판정 상태 하나로 통일. 색은 CSS 가 data-state 로 고른다.
  const state = isPassed ? "passed" : hasFailSubject ? "warning" : "failed";

  let statusText = "불합격";
  let message = "총점이 합격 기준(180점)에 미달했습니다.";

  if (isPassed) {
    statusText = "합격";
    message = "축하합니다! 총점 및 과락 기준을 모두 충족하여 합격 상태입니다.";
  } else if (hasFailSubject) {
    statusText = "과락 위험";
    const failSubjects = subjectScores
      .filter((s) => s.score < 40)
      .map((s) => s.subject)
      .join(", ");
    message = `일부 과목(${failSubjects})에서 40점 미만 과락이 감지되었습니다.`;
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.headRow}>
          <div className={styles.headLeft}>
            <div className={styles.dot} data-state={state} />
            <h4 className={styles.headTitle}>이중 합격 조건 판정</h4>
          </div>
          <span className={styles.statusBadge} data-state={state}>
            {statusText}
          </span>
        </div>

        <div className={styles.summary}>
          총점 <strong className={styles.strongTotal}>180점 이상</strong>(평균 60점) &amp; 과목별{" "}
          <strong className={styles.strongSubject}>40점 이상</strong>(과락 방지)
        </div>
      </div>

      <div className={styles.message}>{message}</div>
    </div>
  );
}
