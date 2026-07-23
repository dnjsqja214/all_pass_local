import React from "react";
import styles from "./ChoiceButton.module.css";

interface ChoiceButtonProps {
  questionNumber: number;
  choiceNumber: number;
  isSelected: boolean;
  onClick: () => void;
}

const CIRCLE_NUMBERS = ["①", "②", "③", "④", "⑤"];

export function ChoiceButton({
  questionNumber,
  choiceNumber,
  isSelected,
  onClick,
}: ChoiceButtonProps) {
  const label = CIRCLE_NUMBERS[choiceNumber - 1] ?? choiceNumber.toString();

  return (
    <button
      type="button"
      className={styles.button}
      data-selected={isSelected}
      aria-label={`${questionNumber}번 문항 ${choiceNumber}번 선택`}
      aria-pressed={isSelected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
