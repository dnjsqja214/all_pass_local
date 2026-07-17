import React from "react";
import { StudySessionInfo } from "../hooks/useDashboardData";

interface ActiveStudyCardProps {
  session: StudySessionInfo;
}

export function ActiveStudyCard({ session }: ActiveStudyCardProps) {
  return (
    <div className="w-full bg-[#B83A38] text-white rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] text-red-100 font-medium tracking-tight">
            {session.title}
          </span>
          <h2 className="text-[26px] font-bold tracking-tight leading-none">
            {session.timeRange}
          </h2>
        </div>
        <span className="bg-[#FFFFFF33] text-white text-[13px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs">
          {session.badgeText}
        </span>
      </div>

      <button className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-bold py-4 px-5 rounded-2xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer text-[15px]">
        {/* 비디오 카메라 아이콘 (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <span>{session.linkText}</span>
      </button>
    </div>
  );
}
