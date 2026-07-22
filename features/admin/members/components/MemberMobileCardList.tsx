import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { formatStudyTime } from "../../../user/learning/utils";

interface MemberMobileCardListProps {
  members: Member[];
  onSelectMember: (memberId: string) => void;
}

export function MemberMobileCardList({
  members,
  onSelectMember,
}: MemberMobileCardListProps) {
  const getScoreColorClass = (score: number) => {
    if (score >= 180) return "text-[#3F7D4E] font-bold";
    if (score < 120) return "text-[#D93D35] font-bold";
    return "text-[#111111] font-semibold";
  };

  return (
    <div className="block md:hidden space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col gap-3.5"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[16px] font-bold text-[#111111]">
                {member.name}
              </h4>
              <p className="text-[12px] text-[#817D76] mt-0.5 break-all">
                {member.email}
              </p>
            </div>
            <MemberStatusBadge status={member.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-[#F6F4F0] text-[13px]">
            <div>
              <span className="text-[#817D76] block text-[11px] font-medium uppercase tracking-tight mb-0.5">최근 점수</span>
              <strong className={getScoreColorClass(member.recentScore)}>{member.recentScore}점</strong>
            </div>
            <div>
              <span className="text-[#817D76] block text-[11px] font-medium uppercase tracking-tight mb-0.5">공부 시간</span>
              <strong className="text-[#111111]">{formatStudyTime(member.studyMinutes)}</strong>
            </div>
          </div>

          <button
            onClick={() => onSelectMember(member.id)}
            className="w-full bg-[#111111] hover:bg-[#C93A35] text-white font-bold py-3.5 px-4 rounded-xl text-[13px] tracking-wide transition-all duration-200 cursor-pointer text-center"
          >
            상세보기
          </button>
        </div>
      ))}
      {members.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-[#E4E0D9] text-center text-[13px] text-[#817D76] font-medium shadow-sm">
          검색 조건에 맞는 회원이 없습니다.
        </div>
      )}
    </div>
  );
}
