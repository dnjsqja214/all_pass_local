import React from "react";

interface SubjectScoreItem {
  subject: string;
  score: number;
}

interface SubjectScoreListProps {
  subjectScores: SubjectScoreItem[];
}

export function SubjectScoreList({ subjectScores }: SubjectScoreListProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col gap-4 h-full">
      <h4 className="text-[15px] font-bold text-[#111111] border-b border-[#F6F4F0] pb-2">
        과목별 최근 점수
      </h4>
      <div className="flex flex-col gap-3.5">
        {subjectScores.map((item, idx) => {
          const isFailed = item.score < 40;
          return (
            <div key={idx} className="flex justify-between items-center text-[13px] border-b border-[#F6F4F0] pb-2.5 last:border-0 last:pb-0">
              <span className="text-[#817D76] font-medium">{item.subject}</span>
              <span className={`font-extrabold text-[15px] ${isFailed ? "text-[#D93D35]" : "text-[#111111]"}`}>
                {item.score.toFixed(1)}점
                {isFailed && <span className="ml-1.5 text-[10px] font-bold bg-[#FDF1F0] text-[#B83A38] px-1.5 py-0.5 rounded">과락</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
