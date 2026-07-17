import React from "react";
import { ExamStatus } from "../types/exam";

interface ExamStatusBadgeProps {
  status: ExamStatus;
}

export function ExamStatusBadge({ status }: ExamStatusBadgeProps) {
  let bgClass = "";
  let textClass = "";
  let label = "";

  switch (status) {
    case "available":
      bgClass = "bg-[#3F7D4E]/10 border-[#3F7D4E]/20";
      textClass = "text-[#3F7D4E]";
      label = "미응시";
      break;
    case "completed":
      bgClass = "bg-[#817D76]/10 border-[#817D76]/20";
      textClass = "text-[#817D76]";
      label = "응시 완료";
      break;
    case "scheduled":
      bgClass = "bg-[#D93D35]/10 border-[#D93D35]/20";
      textClass = "text-[#D93D35]";
      label = "응시 예정";
      break;
  }

  return (
    <span
      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border tracking-wider ${bgClass} ${textClass}`}
    >
      {label}
    </span>
  );
}
