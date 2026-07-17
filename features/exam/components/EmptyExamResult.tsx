import React from "react";
import { RotateCcw } from "lucide-react";

interface EmptyExamResultProps {
  onReset: () => void;
}

export function EmptyExamResult({ onReset }: EmptyExamResultProps) {
  return (
    <div className="py-16 px-4 text-center bg-white rounded-2xl border border-[#E4E0D9] flex flex-col items-center justify-center gap-4">
      <div className="text-[32px]">🔍</div>
      <div className="space-y-1">
        <h3 className="text-[16px] font-bold text-[#111111] tracking-tight">
          검색 조건에 맞는 시험이 없습니다.
        </h3>
        <p className="text-[13px] text-[#817D76] font-medium">
          검색 조건을 변경하거나 초기화해주세요.
        </p>
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 bg-[#F6F4F0] hover:bg-[#E4E0D9] text-[#111111] font-bold py-2.5 px-5 rounded-xl text-[12px] tracking-wide transition-all border border-[#E4E0D9] cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#817D76]" />
        <span>검색 초기화</span>
      </button>
    </div>
  );
}
