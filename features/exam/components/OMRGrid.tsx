import React from "react";
import { OMRQuestionRow } from "./OMRQuestionRow";

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
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-xs w-full">
      {/* 
        모바일에서는 1열 스택,
        태블릿/데스크톱(lg 이상)에서는 좌우 2열 배치로 정보 밀도를 높임
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 xl:gap-x-12">
        {/* 1열 (1 ~ 20번 문항) */}
        <div className="flex flex-col">
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
        <div className="flex flex-col">
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
