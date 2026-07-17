import React from "react";

interface ChoiceButtonProps {
  questionNumber: number;
  choiceNumber: number;
  isSelected: boolean;
  onClick: () => void;
}

export function ChoiceButton({
  questionNumber,
  choiceNumber,
  isSelected,
  onClick,
}: ChoiceButtonProps) {
  // ① ② ③ ④ ⑤ 유니코드 번호 포맷팅
  const circleNumbers = ["①", "②", "③", "④", "⑤"];
  const circleLabel = circleNumbers[choiceNumber - 1] || choiceNumber.toString();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${questionNumber}번 문항 ${choiceNumber}번 선택`}
      aria-pressed={isSelected}
      className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[16px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#C93A35] cursor-pointer ${
        isSelected
          ? "bg-[#111111] text-white border-2 border-[#111111]"
          : "bg-white border border-[#E4E0D9] text-[#817D76] hover:bg-[#F6F4F0]/30"
      }`}
    >
      {circleLabel}
    </button>
  );
}
