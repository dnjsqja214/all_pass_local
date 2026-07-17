import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  isAlert?: boolean;
}

export function MetricCard({ title, value, subtitle, isAlert = false }: MetricCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col gap-1.5 transition-all ${
        isAlert
          ? "border-[#FCDDDB] hover:border-[#D93D35]/30 bg-[#FDF1F0]/10"
          : "border-[#E4E0D9] hover:border-[#C93A35]/30"
      }`}
    >
      <span className="text-[12px] text-[#817D76] font-bold tracking-tight uppercase">
        {title}
      </span>
      <span
        className={`text-[26px] font-black tracking-tight leading-none ${
          isAlert ? "text-[#D93D35]" : "text-[#111111]"
        }`}
      >
        {value}
      </span>
      <span
        className={`text-[12px] font-semibold ${
          isAlert ? "text-[#B83A38]" : "text-[#817D76]"
        }`}
      >
        {subtitle}
      </span>
    </div>
  );
}
