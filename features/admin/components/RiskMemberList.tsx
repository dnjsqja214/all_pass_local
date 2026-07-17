import React from "react";
import { RiskMember } from "../hooks/adminData";

interface RiskMemberListProps {
  members: RiskMember[];
}

export function RiskMemberList({ members }: RiskMemberListProps) {
  // 경고 배지 스타일 매핑
  const badgeStyles = (type: string) => {
    switch (type) {
      case "과락 위험":
        return "bg-[#FDF1F0] text-[#B83A38] border-[#FCDDDB]";
      case "미제출":
        return "bg-[#F1F0EC] text-[#817D76] border-[#E4E0D9]";
      case "반복 오답":
        return "bg-[#FEF7E0] text-[#B06000] border-[#FADF91]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-xs flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-0.5 border-b border-[#F6F4F0] pb-2">
        <h4 className="text-[15px] font-bold text-[#111111] tracking-tight">
          위험군 — 오늘 관리 필요
        </h4>
        <p className="text-[12px] text-[#817D76]">
          점수 하락 또는 미제출 등으로 알림이 감지된 학습자입니다.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-[#F6F4F0]">
        {members.map((member) => (
          <div key={member.id} className="flex justify-between items-center py-3.5 first:pt-1 last:pb-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 w-fit ${badgeStyles(
                  member.type
                )}`}
              >
                {member.type}
              </span>
              
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-[#111111] leading-tight">
                  {member.name}
                </span>
                <span className="text-[11px] text-[#817D76] truncate mt-0.5">
                  {member.reason}
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`${member.name}님에게 ${member.actionText} 처리를 시도합니다.`)}
              className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-white text-[12px] font-bold rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
            >
              {member.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
