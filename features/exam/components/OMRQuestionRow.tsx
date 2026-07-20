import React, { useState } from "react";
import { Star } from "lucide-react";
import { ChoiceButton } from "./ChoiceButton";
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
      {/* 별 아이콘 + 문항 번호 그룹 (정렬 맞춤) */}
      <div className={styles.numberGroup}>
        <button
          type="button"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={styles.starBtn}
        >
          <Star
            className={`w-[16px] h-[16px] transition-all ${
              isBookmarked ? "fill-[#D48A00] text-[#D48A00]" : "text-[#817D76]"
            }`}
          />
        </button>
        <span className={styles.numberText}>
          {questionNumber}
        </span>
      </div>

      {/* 마킹 선택지 */}
      <div className={styles.choicesGroup}>
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
