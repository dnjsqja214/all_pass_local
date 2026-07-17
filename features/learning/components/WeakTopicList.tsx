import React from "react";
import { WeakTopic } from "../types";

interface WeakTopicListProps {
  weakTopics: WeakTopic[];
}

export function WeakTopicList({ weakTopics }: WeakTopicListProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col gap-4 h-full">
      <h4 className="text-[15px] font-bold text-[#111111] border-b border-[#F6F4F0] pb-2">
        취약 단원 TOP 3
      </h4>
      <div className="flex flex-col gap-3">
        {weakTopics.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[13px] border-b border-[#F6F4F0] pb-2.5 last:border-0 last:pb-0">
            <span className="text-[#111111] font-semibold truncate pr-2">
              {idx + 1}. {item.topic}
            </span>
            <span className="font-extrabold text-[#C93A35] bg-[#FDF1F0] px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
              오답 {item.wrongCount}회
            </span>
          </div>
        ))}
        {weakTopics.length === 0 && (
          <div className="text-center py-6 text-[13px] text-[#817D76] font-medium">
            감지된 취약 단원이 없습니다.
          </div>
        )}
      </div>
      {weakTopics.length > 0 && (
        <div className="bg-[#FDF1F0] p-3 rounded-lg border border-[#FCDDDB] text-[12px] text-[#B83A38] font-medium leading-relaxed mt-auto">
          💡 상위 취약 단원에 대한 개념 오답 노트를 적극 활용하여 이론을 보강하세요.
        </div>
      )}
    </div>
  );
}
