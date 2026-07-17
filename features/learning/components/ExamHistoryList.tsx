import React from "react";

interface ExamSubjectScore {
  name: string;
  score: number;
  isFailed: boolean;
}

interface ExamHistoryItem {
  id: string;
  examTitle: string;
  attemptTitle: string;
  date: string;
  totalScore: number;
  isPassed: boolean;
  subjects: ExamSubjectScore[];
}

interface ExamHistoryListProps {
  history: ExamHistoryItem[];
}

export function ExamHistoryList({ history }: ExamHistoryListProps) {
  const renderSubjectScores = (subjects: ExamSubjectScore[]) => {
    return (
      <div className="flex flex-wrap gap-x-2 text-[13px] text-[#817D76]">
        {subjects.map((sub, idx) => {
          let scoreColor = "text-[#111111]";
          if (sub.isFailed) {
            scoreColor = "text-[#D93D35] font-bold";
          } else if (sub.score >= 60) {
            scoreColor = "text-[#3F7D4E] font-bold";
          }
          return (
            <span key={idx} className="inline-flex items-center">
              <span>{sub.name}</span>
              <span className={`ml-1 ${scoreColor}`}>{sub.score}</span>
              {idx < subjects.length - 1 && <span className="ml-2 text-[#E4E0D9]">·</span>}
            </span>
          );
        })}
      </div>
    );
  };

  const hasCutoffFail = (subjects: ExamSubjectScore[]) => {
    return subjects.some((sub) => sub.isFailed);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-[14px] font-bold text-[#C93A35] tracking-widest uppercase">
        회차별 응시 이력
      </h3>

      {/* 1. 모바일 및 태블릿 리스트 뷰 (xl:hidden) */}
      <div className="xl:hidden bg-white rounded-2xl border border-[#E4E0D9] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#E4E0D9]">
          {history.map((attempt) => {
            const hasFail = hasCutoffFail(attempt.subjects);
            return (
              <div key={attempt.id} className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[18px] font-extrabold text-[#111111]">
                    {attempt.examTitle}
                  </h4>
                  <span className="text-[12px] text-[#817D76]">
                    {attempt.attemptTitle} · {attempt.date}
                  </span>
                </div>

                {/* 과목별 점수 리스트 */}
                {renderSubjectScores(attempt.subjects)}

                <div className="flex justify-between items-center pt-2 border-t border-[#F6F4F0]">
                  <span className="text-[12px] font-bold text-[#817D76]">결과</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#817D76]">
                      총점 <strong className="text-[#111111]">{attempt.totalScore}</strong>
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      attempt.isPassed 
                        ? "bg-[#E6F4EA] text-[#137333]" 
                        : "bg-[#FDF1F0] text-[#B83A38]"
                    }`}>
                      {attempt.isPassed ? "합격" : hasFail ? "불합격 (과락)" : "불합격"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {history.length === 0 && (
            <div className="p-6 text-center text-[13px] text-[#817D76] font-medium">
              응시 이력이 존재하지 않습니다.
            </div>
          )}
        </div>
      </div>

      {/* 2. 데스크톱 테이블 뷰 (hidden xl:block) */}
      <div className="hidden xl:block bg-white rounded-2xl border border-[#E4E0D9] shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F6F4F0] border-b border-[#E4E0D9] text-[13px] font-bold text-[#111111]">
              <th className="px-6 py-4">시험 회차</th>
              <th className="px-6 py-4">응시 차수</th>
              <th className="px-6 py-4">응시 날짜</th>
              <th className="px-6 py-4">과목별 점수</th>
              <th className="px-6 py-4 text-center">총점</th>
              <th className="px-6 py-4 text-center">합격 여부</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E0D9] text-[14px]">
            {history.map((attempt) => {
              const hasFail = hasCutoffFail(attempt.subjects);
              return (
                <tr key={attempt.id} className="hover:bg-[#F6F4F0]/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#111111]">{attempt.examTitle}</td>
                  <td className="px-6 py-4 text-[#817D76]">{attempt.attemptTitle}</td>
                  <td className="px-6 py-4 text-[#817D76]">{attempt.date}</td>
                  <td className="px-6 py-4">{renderSubjectScores(attempt.subjects)}</td>
                  <td className="px-6 py-4 text-center font-extrabold text-[#111111]">{attempt.totalScore}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full inline-block ${
                      attempt.isPassed 
                        ? "bg-[#E6F4EA] text-[#137333]" 
                        : "bg-[#FDF1F0] text-[#B83A38]"
                    }`}>
                      {attempt.isPassed ? "합격" : hasFail ? "불합격 (과락)" : "불합격"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[13px] text-[#817D76] font-medium">
                  응시 이력이 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
