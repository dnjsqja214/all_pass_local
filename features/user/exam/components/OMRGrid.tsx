import React from "react";
import { OMRQuestionRow } from "./OMRQuestionRow";
import styles from "./OMRGrid.module.css";

interface OMRGridProps {
  totalQuestions: number;
  answers: Record<number, number>;
  onSelectAnswer: (questionNumber: number, choice: number) => void;
}

export function OMRGrid({ totalQuestions, answers, onSelectAnswer }: OMRGridProps) {
  // 데스크톱에서 OMR을 2열로 배치하기 위해 문항을 반으로 분할
  const half = Math.ceil(totalQuestions / 2);
  const col1Questions = Array.from({ length: half }, (_, i) => i + 1);
  const col2Questions = Array.from({ length: totalQuestions - half }, (_, i) => i + half + 1);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridSplit}>
        {/* 1열 (1 ~ 20번 문항) */}
        <div className={styles.column}>
          {col1Questions.map((qNum) => (
            <OMRQuestionRow
              key={qNum}
              questionNumber={qNum}
              selectedChoice={answers[qNum]}
              onSelectChoice={(choice) => onSelectAnswer(qNum, choice)}
            />
          ))}
        </div>

        {/* 2열 (21 ~ 40번 문항) */}
        <div className={styles.column}>
          {col2Questions.map((qNum) => (
            <OMRQuestionRow
              key={qNum}
              questionNumber={qNum}
              selectedChoice={answers[qNum]}
              onSelectChoice={(choice) => onSelectAnswer(qNum, choice)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
