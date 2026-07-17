import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { formatStudyTime } from "../../../learning/utils";

interface MemberTableProps {
  members: Member[];
  onSelectMember: (memberId: string) => void;
}

export function MemberTable({ members, onSelectMember }: MemberTableProps) {
  const getScoreColorClass = (score: number) => {
    if (score >= 180) return "text-[#3F7D4E] font-extrabold";
    if (score < 120) return "text-[#D93D35] font-extrabold";
    return "text-[#111111] font-semibold";
  };

  return (
    <div className="hidden md:block bg-white rounded-2xl border border-[#E4E0D9] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F6F4F0] border-b border-[#E4E0D9] text-[13px] font-bold text-[#111111]">
              <th className="px-5 py-4">이름</th>
              <th className="px-5 py-4">이메일</th>
              <th className="px-5 py-4">가입일</th>
              <th className="px-5 py-4">최근 접속일</th>
              <th className="px-5 py-4">학습 상태</th>
              <th className="px-5 py-4 text-center">누적 공부 시간</th>
              <th className="px-5 py-4 text-center">최근 점수</th>
              <th className="px-5 py-4 text-center">누적 오답</th>
              <th className="px-5 py-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E0D9] text-[14px]">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-[#F6F4F0]/10 transition-colors"
              >
                <td className="px-5 py-4 font-bold text-[#111111]">
                  {member.name}
                </td>
                <td className="px-5 py-4 text-[#817D76] font-medium break-all">
                  {member.email}
                </td>
                <td className="px-5 py-4 text-[#817D76] whitespace-nowrap">
                  {member.joinedAt}
                </td>
                <td className="px-5 py-4 text-[#817D76] whitespace-nowrap">
                  {member.lastLoginAt}
                </td>
                <td className="px-5 py-4">
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className="px-5 py-4 text-center text-[#111111] font-semibold whitespace-nowrap">
                  {formatStudyTime(member.studyMinutes)}
                </td>
                <td className={`px-5 py-4 text-center ${getScoreColorClass(member.recentScore)}`}>
                  {member.recentScore}점
                </td>
                <td className="px-5 py-4 text-center text-[#C93A35] font-extrabold">
                  {member.wrongAnswerCount}개
                </td>
                <td className="px-5 py-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => onSelectMember(member.id)}
                    className="bg-[#111111] hover:bg-[#C93A35] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-16 text-center text-[14px] text-[#817D76] font-medium"
                >
                  검색 조건에 맞는 회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
