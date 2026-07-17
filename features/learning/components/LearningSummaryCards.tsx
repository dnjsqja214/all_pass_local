import React from "react";
import { formatStudyTime } from "../utils";

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
      textColor: "text-[#111111]",
    },
    {
      label: "응시 시험 수",
      value: `${examCount}회`,
      textColor: "text-[#111111]",
    },
    {
      label: "평균 점수",
      value: `${averageScore.toFixed(1)}점`,
      textColor: averageScore >= 180 ? "text-[#3F7D4E]" : "text-[#111111]",
    },
    {
      label: "누적 오답 수",
      value: `${wrongAnswerCount}개`,
      textColor: "text-[#C93A35]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-4 border border-[#E4E0D9] shadow-sm flex flex-col justify-between"
        >
          <span className="text-[12px] font-bold text-[#817D76] tracking-tight uppercase">
            {card.label}
          </span>
          <span className={`text-[20px] font-black tracking-tight ${card.textColor} mt-2`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}
