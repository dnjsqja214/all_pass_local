import React, { useState } from "react";
import { Star } from "lucide-react";
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const choices = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center py-1.5 border-b border-[#F6F4F0] w-full gap-4">
      {/* 별 아이콘 + 문항 번호 그룹 (정렬 맞춤) */}
      <div className="flex items-center gap-1 shrink-0 min-w-[52px]">
        <button
          type="button"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="p-1 hover:bg-[#F6F4F0] rounded-full transition-colors cursor-pointer border-none outline-none bg-transparent inline-flex items-center justify-center"
        >
          <Star
            className={`w-[16px] h-[16px] transition-all ${
              isBookmarked ? "fill-[#D48A00] text-[#D48A00]" : "text-[#817D76]"
            }`}
          />
        </button>
        <span className="text-[14.5px] font-extrabold text-[#111111]">
          {questionNumber}
        </span>
      </div>

      {/* 마킹 선택지 */}
      <div className="flex gap-2">
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
