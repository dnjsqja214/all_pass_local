import React from "react";

interface StatusBadgeProps {
  status: "normal" | "late" | "absent" | "pass" | "fail" | "unsubmitted";
  labelText?: string;
}

export function StatusBadge({ status, labelText }: StatusBadgeProps) {
  const themes = {
    normal: { bg: "bg-[#E6F4EA] border-[#C2E7CD]", text: "text-[#137333]", label: "정상" },
    late: { bg: "bg-[#FEF7E0] border-[#FADF91]", text: "text-[#B06000]", label: "지각" },
    absent: { bg: "bg-[#FDF1F0] border-[#FCDDDB]", text: "text-[#B83A38]", label: "결석" },
    pass: { bg: "bg-[#E6F4EA] border-[#C2E7CD]", text: "text-[#137333]", label: "합격권" },
    fail: { bg: "bg-[#FDF1F0] border-[#FCDDDB]", text: "text-[#B83A38]", label: "과락" },
    unsubmitted: { bg: "bg-[#F1F0EC] border-[#E4E0D9]", text: "text-[#817D76]", label: "미제출" },
  };

  const current = themes[status] || themes.unsubmitted;
  const displayLabel = labelText || current.label;

  return (
    <span
      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${current.bg} ${current.text} inline-flex items-center justify-center`}
    >
      {displayLabel}
    </span>
  );
}
