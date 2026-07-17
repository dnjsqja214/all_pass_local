import React from "react";
import { MemberStatus } from "../types/member";

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  let label = "정상";
  let classes = "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]";

  if (status === "inactive") {
    label = "비활성";
    classes = "bg-[#F1F3F4] text-[#5F6368] border-[#DADCE0]";
  } else if (status === "risk") {
    label = "위험군";
    classes = "bg-[#FDF1F0] text-[#B83A38] border-[#FCDDDB]";
  }

  return (
    <span className={`inline-flex items-center text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${classes}`}>
      {label}
    </span>
  );
}
