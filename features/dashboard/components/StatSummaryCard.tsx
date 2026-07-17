import React from "react";
import { WeeklyStat } from "../hooks/useDashboardData";

interface StatSummaryCardProps {
  stats: WeeklyStat[];
}

export function StatSummaryCard({ stats }: StatSummaryCardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-[#EDEDED] rounded-[20px] py-4 px-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
        >
          <span className="text-[22px] font-extrabold text-[#1A1A1A] tracking-tight leading-none">
            {stat.value}
          </span>
          <span className="text-[12px] text-[#8E8E8E] font-bold tracking-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
