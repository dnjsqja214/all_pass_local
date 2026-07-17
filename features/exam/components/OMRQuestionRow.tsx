import React from "react";
import { ChoiceButton } from "./ChoiceButton";

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
  const choices = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F6F4F0] w-full">
      <span className="text-[15px] font-extrabold text-[#111111] w-8 text-center">
        {questionNumber}
      </span>
      <div className="flex gap-2.5">
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
