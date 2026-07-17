import React from "react";

interface ExamProgressProps {
  markedCount: number;
  totalQuestions: number;
  saveStatus: "saved" | "saving";
}

export function ExamProgress({ markedCount, totalQuestions, saveStatus }: ExamProgressProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E4E0D9] shadow-xs">
      <span className="text-[14px] font-extrabold text-[#111111]">
        제출 {markedCount} / {totalQuestions}
      </span>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${saveStatus === "saved" ? "bg-[#3F7D4E]" : "bg-gray-400 animate-pulse"}`} />
        <span
          className={`text-[12px] font-bold ${
            saveStatus === "saved" ? "text-[#3F7D4E]" : "text-gray-500"
          }`}
        >
          {saveStatus === "saved" ? "자동 저장됨" : "저장 중..."}
        </span>
      </div>
    </div>
  );
}
