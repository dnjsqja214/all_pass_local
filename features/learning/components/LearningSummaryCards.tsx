import React from "react";
import { formatStudyTime } from "../utils";
import styles from "./LearningSummaryCards.module.css";

interface LearningSummaryCardsProps {
  studyMinutes: number;
  examCount: number;
  averageScore: number;
  wrongAnswerCount: number;
}

export function LearningSummaryCards({
  studyMinutes,
  examCount,
  averageScore,
  wrongAnswerCount,
}: LearningSummaryCardsProps) {
  const cards = [
    {
      label: "누적 공부 시간",
      value: formatStudyTime(studyMinutes),
      tone: "default",
    },
    {
      label: "응시 시험 수",
      value: `${examCount}회`,
      tone: "default",
    },
    {
      label: "평균 점수",
      value: `${averageScore.toFixed(1)}점`,
      tone: averageScore >= 180 ? "success" : "default",
    },
    {
      label: "누적 오답 수",
      value: `${wrongAnswerCount}개`,
      tone: "danger",
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, idx) => (
        <div key={idx} className={styles.card}>
          <span className={styles.label}>{card.label}</span>
          <span className={styles.value} data-tone={card.tone}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}
