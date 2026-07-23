import React from "react";
import { OMRQuestionRow } from "../OMRQuestionRow";
import styles from "./OMRGrid.module.css";

interface OMRGridProps {
  totalQuestions: number;
  answers: Record<number, number>;
  onSelectAnswer: (questionNumber: number, choice: number) => void;
}

export function OMRGrid({ totalQuestions, answers, onSelectAnswer }: OMRGridProps) {
  const half = Math.ceil(totalQuestions / 2);
  const firstColumn = Array.from({ length: half }, (_, index) => index + 1);
  const secondColumn = Array.from(
    { length: totalQuestions - half },
    (_, index) => index + half + 1,
  );

  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div className={styles.column}>
          {firstColumn.map((questionNumber) => (
            <OMRQuestionRow
              key={questionNumber}
              questionNumber={questionNumber}
              selectedChoice={answers[questionNumber]}
              onSelectChoice={(choice) => onSelectAnswer(questionNumber, choice)}
            />
          ))}
        </div>

        <div className={styles.column}>
          {secondColumn.map((questionNumber) => (
            <OMRQuestionRow
              key={questionNumber}
              questionNumber={questionNumber}
              selectedChoice={answers[questionNumber]}
              onSelectChoice={(choice) => onSelectAnswer(questionNumber, choice)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
