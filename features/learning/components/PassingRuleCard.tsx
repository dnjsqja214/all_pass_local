import React from "react";

interface SubjectScoreItem {
  subject: string;
  score: number;
}

interface PassingRuleCardProps {
  totalScore: number;
  subjectScores: SubjectScoreItem[];
}

export function PassingRuleCard({ totalScore, subjectScores }: PassingRuleCardProps) {
  const hasFailSubject = subjectScores.some((sub) => sub.score < 40);
  const isPassed = totalScore >= 180 && !hasFailSubject;

  let statusText = "불합격";
  let statusBadgeColor = "bg-[#FDF1F0] text-[#B83A38] border-[#FCDDDB]";
  let message = "총점이 합격 기준(180점)에 미달했습니다.";

  if (isPassed) {
    statusText = "합격";
    statusBadgeColor = "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]";
    message = "축하합니다! 총점 및 과락 기준을 모두 충족하여 합격 상태입니다.";
  } else if (hasFailSubject) {
    statusText = "과락 위험";
    statusBadgeColor = "bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]";
    const failSubjects = subjectScores
      .filter((s) => s.score < 40)
      .map((s) => s.subject)
      .join(", ");
    message = `일부 과목(${failSubjects})에서 40점 미만 과락이 감지되었습니다.`;
  }

  return (
    <div className="bg-[#151515] text-white rounded-2xl p-5 border border-[#2C2A27] flex flex-col gap-4 shadow-md h-full justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isPassed ? "bg-[#3F7D4E]" : hasFailSubject ? "bg-[#FEF7E0]/80" : "bg-[#C93A35]"}`} />
            <h4 className="text-[14px] font-extrabold tracking-wider text-gray-300 uppercase">
              이중 합격 조건 판정
            </h4>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${statusBadgeColor}`}>
            {statusText}
          </span>
        </div>
        
        <div className="text-[14px] text-gray-100 font-semibold leading-relaxed tracking-tight">
          총점 <strong className="text-white text-base">180점 이상</strong>(평균 60점) & 과목별 <strong className="text-[#C93A35] text-base">40점 이상</strong>(과락 방지)
        </div>
      </div>

      <div className="bg-[#262626] p-3 rounded-lg border border-[#333333] text-[12px] text-gray-300 font-medium leading-relaxed mt-2">
        {message}
      </div>
    </div>
  );
}
