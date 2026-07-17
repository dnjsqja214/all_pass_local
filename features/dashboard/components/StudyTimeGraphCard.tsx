import React from "react";
import { DailyStudyTime } from "../hooks/useDashboardData";

interface StudyTimeGraphCardProps {
  studyTimes: DailyStudyTime[];
}

export function StudyTimeGraphCard({ studyTimes }: StudyTimeGraphCardProps) {
  // 전체 공부 시간 합산
  const totalHours = studyTimes.reduce((acc, curr) => acc + curr.hours, 0);
  
  // 그래프 최대 높이 기준값 (가장 많이 공부한 시간 찾기, 최소값 5시간으로 고정하여 안정적인 높이 보장)
  const maxHours = Math.max(...studyTimes.map((t) => t.hours), 5);

  return (
    <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[#EDEDED] flex flex-col gap-4">
      <div className="flex justify-between items-start pb-2 border-b border-[#F5F5F5]">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight">
            일별 공부 시간
          </h4>
          <p className="text-[12px] text-[#8E8E8E]">
            요일별 학습 몰입도 비교
          </p>
        </div>
        <div className="text-right">
          <span className="text-[16px] font-extrabold text-[#B83A38]">
            총 {totalHours.toFixed(1)}h
          </span>
        </div>
      </div>

      {/* 바 그래프 영역 */}
      <div className="h-[180px] flex items-end justify-between px-2 pt-6 pb-2">
        {studyTimes.map((item, index) => {
          const heightPercent = (item.hours / maxHours) * 100;
          return (
            <div key={index} className="flex flex-col items-center gap-2 h-full justify-end flex-1">
              {/* 시간 텍스트 (바 위에 노출) */}
              <span className="text-[10px] font-bold text-[#1A1A1A] mb-1">
                {item.hours > 0 ? `${item.hours.toFixed(1)}` : "-"}
              </span>
              
              {/* 그래프 바 */}
              <div className="w-6 bg-[#F5F5F5] rounded-t-lg relative flex items-end h-[120px] overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#B83A38] rounded-t-lg transition-all duration-500 ease-out hover:bg-[#9B2F2E]"
                />
              </div>

              {/* 요일 */}
              <span className="text-[12px] font-bold text-[#8E8E8E]">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
