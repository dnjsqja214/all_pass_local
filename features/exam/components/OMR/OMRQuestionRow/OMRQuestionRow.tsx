import React, { useState } from "react";
import { Star } from "lucide-react";
import { ChoiceButton } from "../ChoiceButton";
import styles from "./OMRQuestionRow.module.css";

interface OMRQuestionRowProps {
  questionNumber: number;
  selectedChoice?: number;
  onSelectChoice: (choice: number) => void;
}

export function OMRQuestionRow({
  questionNumber,
  selectedChoice,
  onSelectChoice,
}: OMRQuestionRowProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const choices = [1, 2, 3, 4, 5];

  return (
    <div className={styles.row}>
      <div className={styles.question}>
        <button
          type="button"
          className={styles.bookmarkButton}
          data-bookmarked={isBookmarked}
          aria-label={`${questionNumber}번 문항 ${isBookmarked ? "북마크 해제" : "북마크"}`}
          aria-pressed={isBookmarked}
          onClick={() => setIsBookmarked((bookmarked) => !bookmarked)}
        >
          <Star className={styles.bookmarkIcon} aria-hidden="true" />
        </button>
        <span className={styles.questionNumber}>{questionNumber}</span>
      </div>

      <div className={styles.choices}>
        {choices.map((choice) => (
          <ChoiceButton
            key={choice}
            questionNumber={questionNumber}
            choiceNumber={choice}
            isSelected={selectedChoice === choice}
            onClick={() => onSelectChoice(choice)}
          />
        ))}
      </div>
    </div>
  );
}
