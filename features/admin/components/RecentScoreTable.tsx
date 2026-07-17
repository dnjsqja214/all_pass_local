import React from "react";
import { MemberScore } from "../hooks/adminData";

interface RecentScoreTableProps {
  scores: MemberScore[];
}

export function RecentScoreTable({ scores }: RecentScoreTableProps) {
  // 과목 점수 렌더러
  const renderScore = (score: number | "미제출") => {
    if (score === "미제출") {
      return <span className="text-[#817D76] font-semibold">미제출</span>;
    }
    if (score < 40) {
      return <span className="text-[#D93D35] font-bold">{score}</span>;
    }
    if (score >= 60) {
      return <span className="text-[#3F7D4E] font-bold">{score}</span>;
    }
    return <span className="text-[#111111] font-semibold">{score}</span>;
  };

  // 총점 합격 여부 렌더러
  const renderTotalScore = (total: number | "-", hasFail: boolean) => {
    if (total === "-") {
      return <span className="text-[#817D76] font-semibold">-</span>;
    }
    // 합격 기준: 총점 180점 이상 & 과목별 과락(40점 미만) 없음
    if (total >= 180 && !hasFail) {
      return <span className="text-[#3F7D4E] font-extrabold">{total}</span>;
    }
    if (hasFail) {
      return <span className="text-[#D93D35] font-bold">{total}</span>;
    }
    return <span className="text-[#111111] font-bold">{total}</span>;
  };

  // 추이 렌더러
  const renderTrend = (trend: "up" | "down" | "flat") => {
    switch (trend) {
      case "up":
        return <span className="text-[#3F7D4E] font-bold">▲</span>;
      case "down":
        return <span className="text-[#D93D35] font-bold">▼</span>;
      case "flat":
        return <span className="text-[#817D76] font-bold">━</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-xs flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-0.5 border-b border-[#F6F4F0] pb-2">
        <h4 className="text-[15px] font-bold text-[#111111] tracking-tight">
          회원별 최근 점수
        </h4>
        <p className="text-[12px] text-[#817D76]">
          회차별 정답지 채점 점수 및 최근 변동 추이 요약
        </p>
      </div>

      {/* 테이블 가로 스크롤 대응 */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr className="bg-[#F6F4F0] border-b border-[#E4E0D9] text-[12px] font-bold text-[#111111]">
              <th className="px-5 py-3">회원</th>
              <th className="px-5 py-3">최근 회차</th>
              <th className="px-5 py-3">중개</th>
              <th className="px-5 py-3">공법</th>
              <th className="px-5 py-3">세법</th>
              <th className="px-5 py-3 text-center">총점</th>
              <th className="px-5 py-3 text-center">추이</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E0D9] text-[13px]">
            {scores.map((score) => {
              // 과락(40점 미만) 여부 계산
              const hasFail = score.subjectScores.some(
                (s) => typeof s.score === "number" && s.score < 40
              );

              return (
                <tr key={score.id} className="hover:bg-[#F6F4F0]/10 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E4E0D9] text-[#111111] flex items-center justify-center font-extrabold text-[11px] shrink-0">
                        {score.avatarText}
                      </div>
                      <span className="font-bold text-[#111111]">{score.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#817D76] font-medium">{score.recentRound}</td>
                  <td className="px-5 py-3">{renderScore(score.subjectScores[0]?.score)}</td>
                  <td className="px-5 py-3">{renderScore(score.subjectScores[1]?.score)}</td>
                  <td className="px-5 py-3">{renderScore(score.subjectScores[2]?.score)}</td>
                  <td className="px-5 py-3 text-center">
                    {renderTotalScore(score.totalScore, hasFail)}
                  </td>
                  <td className="px-5 py-3 text-center">{renderTrend(score.trend)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
