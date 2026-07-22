import React from "react";

interface ExamTimerProps {
  title: string;
  remainingSeconds: number;
}

export function ExamTimer({ title, remainingSeconds }: ExamTimerProps) {
  // MM:SS 포맷 헬퍼
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isWarning = remainingSeconds <= 600; // 10분 이하 여부

  return (
    <div className="bg-[#151515] text-white rounded-2xl p-5 border border-[#2C2A27] flex justify-between items-center shadow-md">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-gray-400 font-medium">실시간 문제풀이</span>
        <h3 className="text-[18px] font-black text-white tracking-tight">{title}</h3>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="text-[11px] text-gray-400 font-semibold mb-0.5">남은 시간</span>
        <span
          className={`text-[28px] font-black leading-none tracking-tighter ${
            isWarning ? "text-[#D93D35]" : "text-white"
          }`}
        >
          {formatTime(remainingSeconds)}
        </span>
      </div>
    </div>
  );
}
