import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Member } from "../types/member";
import { mockMemberLearningDetails } from "../data/mockMemberLearningDetails";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { ScoreTrendChart } from "../../../learning/components/ScoreTrendChart";
import { PassingRuleCard } from "../../../learning/components/PassingRuleCard";
import { ExamHistoryList } from "../../../learning/components/ExamHistoryList";

interface MemberDetailDialogProps {
  member: Member | null;
  onClose: () => void;
}

export function MemberDetailDialog({ member, onClose }: MemberDetailDialogProps) {
  // 스크롤 방지 효과
  useEffect(() => {
    if (member) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [member]);

  if (!member) return null;

  const detail = mockMemberLearningDetails[member.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6">
      {/* 백드롭 레이어 */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* 다이얼로그 본체 */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[900px] xl:max-w-[1000px] bg-[#F6F4F0] sm:rounded-2xl border border-[#E4E0D9] shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
        {/* 상단 헤더 정보 영역 */}
        <header className="bg-white border-b border-[#E4E0D9] p-5 sm:p-6 shrink-0 flex justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#C93A35] tracking-widest uppercase">
              ALLPASS STUDY OS
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-[20px] sm:text-[24px] font-black text-[#111111] tracking-tight">
                {member.name} 님의 학습 상세
              </h2>
              <MemberStatusBadge status={member.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] sm:text-[13px] text-[#817D76] font-medium mt-1">
              <span>이메일: <strong className="text-[#111111] font-semibold">{member.email}</strong></span>
              <span className="hidden sm:inline text-[#E4E0D9]">|</span>
              <span>가입일: <strong className="text-[#111111] font-semibold">{member.joinedAt}</strong></span>
              <span className="hidden sm:inline text-[#E4E0D9]">|</span>
              <span>최근 접속: <strong className="text-[#111111] font-semibold">{member.lastLoginAt}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-lg hover:bg-[#F6F4F0] text-[#817D76] hover:text-[#111111] transition-colors cursor-pointer shrink-0 border border-transparent hover:border-[#E4E0D9]"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </header>

        {/* 바디 영역 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {detail ? (
            <>

              {/* 2. 대시보드 2단 배치 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreTrendChart
                  historyData={[...detail.examHistory]
                    .slice(0, 3)
                    .reverse()
                    .map((history) => ({
                      label: `${history.examTitle} ${history.attemptTitle}`,
                      subjects: history.subjects.map((s) => ({
                        name: s.name,
                        score: s.score,
                      })),
                    }))}
                  title="시험 성적 추이"
                  subtitle="최근 응시한 시험의 과목별 점수 변화량"
                />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PassingRuleCard
                  totalScore={member.recentScore}
                  subjectScores={detail.subjectScores}
                />
              </div>

              {/* 3. 시험 이력 리스트 (아래 전체 너비) */}
              <div className="border-t border-[#E4E0D9] pt-6">
                <ExamHistoryList history={detail.examHistory} />
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-[14px] text-[#817D76] font-medium bg-white rounded-2xl border border-[#E4E0D9]">
              선택한 회원의 학습 상세 데이터를 찾을 수 없습니다.
            </div>
          )}
        </div>

        {/* 하단 닫기 영역 (모바일용 고정 푸터 / 데스크톱에서도 유용) */}
        <footer className="bg-white border-t border-[#E4E0D9] p-4 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#111111] hover:bg-[#C93A35] text-white font-bold py-3 px-8 rounded-xl text-[13px] tracking-wide transition-all duration-200 cursor-pointer text-center"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
