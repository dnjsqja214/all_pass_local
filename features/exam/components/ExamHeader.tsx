import React from "react";

interface ExamHeaderProps {
  examDDay: number;
}

export function ExamHeader({ examDDay }: ExamHeaderProps) {
  return (
    <div className="flex justify-between items-center xl:hidden w-full">
      <h1 className="text-[24px] font-extrabold text-[#111111] tracking-tight">
        실시간 문제풀이
      </h1>
      <span className="bg-[#C93A35] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-full tracking-wide">
        시험까지 D-{examDDay}
      </span>
    </div>
  );
}
