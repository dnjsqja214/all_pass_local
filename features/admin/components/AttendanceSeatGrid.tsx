import React from "react";
import { SeatStatus } from "../hooks/adminData";

interface AttendanceSeatGridProps {
  seats: SeatStatus[];
}

export function AttendanceSeatGrid({ seats }: AttendanceSeatGridProps) {
  // 상태별 클래스 매핑
  const seatStyles = {
    normal: "bg-[#E6F4EA] border-[#C2E7CD] text-[#137333]",
    late: "bg-[#FEF7E0] border-[#FADF91] text-[#B06000]",
    absent: "bg-[#FDF1F0] border-[#FCDDDB] text-[#B83A38]",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-xs flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-0.5 border-b border-[#F6F4F0] pb-2">
        <h4 className="text-[15px] font-bold text-[#111111] tracking-tight">
          실시간 출결
        </h4>
        <p className="text-[12px] text-[#817D76]">
          오프라인 지정좌석 16석 + 온라인
        </p>
      </div>

      {/* 16개 지정 좌석 배치도 (모바일은 8열, 데스크톱 등은 4열) */}
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-4 gap-2.5 py-1">
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            className={`h-11 rounded-xl border flex flex-col items-center justify-center font-extrabold text-[13px] ${
              seatStyles[seat.status]
            }`}
          >
            <span className="text-[9px] opacity-75 leading-none mb-0.5">#{seat.seatNumber}</span>
            <span className="leading-none text-[12px]">
              {seat.status === "normal" && "정상"}
              {seat.status === "late" && "지각"}
              {seat.status === "absent" && "결석"}
            </span>
          </div>
        ))}
      </div>

      {/* 출결 범례 */}
      <div className="flex justify-center gap-4 pt-3 border-t border-[#F6F4F0] text-[11px] font-bold text-[#817D76]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E6F4EA] border border-[#C2E7CD]" />
          <span>정상</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEF7E0] border border-[#FADF91]" />
          <span>지각</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FDF1F0] border border-[#FCDDDB]" />
          <span>결석</span>
        </div>
      </div>
    </div>
  );
}
