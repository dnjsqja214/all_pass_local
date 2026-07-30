import React from "react";
import type { PassingAssessment } from "../types";
import styles from "./PassingRuleCard.module.css";

interface PassingRuleCardProps {
  assessment: PassingAssessment;
}

export function PassingRuleCard({ assessment }: PassingRuleCardProps) {
  const failedSubjects = assessment.subjectScores.filter((subject) => subject.score < 40);
  const state = assessment.status === "PASSED"
    ? "passed"
    : assessment.status === "PENDING" || assessment.status === "NO_DATA"
      ? "warning"
      : "failed";

  const statusText = assessment.status === "PASSED"
    ? "합격"
    : assessment.status === "FAILED"
      ? failedSubjects.length > 0 ? "과락 포함" : "불합격"
      : assessment.status === "PENDING" ? "판정 대기" : "응시 기록 없음";

  let message = "제출 완료된 시험이 없어 합격 여부를 판정할 수 없습니다.";
  if (assessment.status === "PASSED") {
    message = `${assessment.round}회 시험의 평균 ${assessment.averageScore.toFixed(1)}점으로 합격 기준을 충족했습니다.`;
  } else if (assessment.status === "PENDING") {
    message = `아직 응시하지 않은 과목: ${assessment.missingSubjects.join(", ")}`;
  } else if (assessment.status === "FAILED" && failedSubjects.length > 0) {
    message = `40점 미만 과목: ${failedSubjects.map((subject) => subject.subject).join(", ")}`;
  } else if (assessment.status === "FAILED") {
    message = `과목 평균이 ${assessment.averageScore.toFixed(1)}점으로 합격 기준에 미달했습니다.`;
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.headRow}>
          <div className={styles.headLeft}>
            <div className={styles.dot} data-state={state} />
            <h4 className={styles.headTitle}>합격 조건 판정</h4>
          </div>
          <span className={styles.statusBadge} data-state={state}>{statusText}</span>
        </div>

        <div className={styles.summary}>
          전 과목 평균 <strong className={styles.strongTotal}>60점 이상</strong> &amp; 과목별{" "}
          <strong className={styles.strongSubject}>40점 이상</strong>
        </div>
      </div>

      <div className={styles.message}>{message}</div>
    </div>
  );
}
