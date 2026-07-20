import React from "react";
import { RotateCcw, ChevronDown } from "lucide-react";

interface ExamSearchFormProps {
  type: string;
  setType: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  round: string;
  setRound: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function ExamSearchForm({
  type,
  setType,
  subject,
  setSubject,
  round,
  setRound,
  onSearch,
  onReset,
}: ExamSearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col md:flex-row md:items-end gap-4"
    >
      {/* 1. 유형 선택 */}
      <div className="flex-1 min-w-[140px] space-y-2">
        <label
          htmlFor="search-type"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          유형
        </label>
        <div className="relative">
          <select
            id="search-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer hover:bg-[#EAE8E2]"
          >
            <option value="all">전체</option>
            <option value="pre">기출문제</option>
            <option value="mock">모의고사</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
        </div>
      </div>

      {/* 2. 과목 선택 */}
      <div className="flex-1 md:flex-[1.5] min-w-[200px] space-y-2">
        <label
          htmlFor="search-subject"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          과목
        </label>
        <div className="relative">
          <select
            id="search-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer hover:bg-[#EAE8E2]"
          >
            <option value="all">전체 과목</option>
            <option value="공인중개사법령 및 실무">공인중개사법령 및 실무</option>
            <option value="부동산 공법">부동산 공법</option>
            <option value="부동산공시법령 부동산세법">부동산공시법령 부동산세법</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
        </div>
      </div>

      {/* 3. 회차 선택 */}
      <div className="flex-1 min-w-[140px] space-y-2">
        <label
          htmlFor="search-round"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          회차
        </label>
        <div className="relative">
          <select
            id="search-round"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer hover:bg-[#EAE8E2]"
          >
            <option value="all">전체 회차</option>
            <option value="35">35회/2026</option>
            <option value="34">34회/2025</option>
            <option value="33">33회/2024</option>
            <option value="32">32회/2023</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
        </div>
      </div>

      {/* 4. 버튼 영역 */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
        <button
          type="submit"
          className="flex-1 md:flex-initial bg-[#C93A35] hover:bg-[#A82A25] active:bg-[#92231F] text-white font-bold py-3.5 px-6 rounded-xl text-[13.5px] tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-h-[46px] shadow-sm"
        >
          <span>검색</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 md:flex-initial bg-[#F6F4F0] hover:bg-[#EAE8E2] active:bg-[#DDD9D0] text-[#111111] font-bold py-3.5 px-6 rounded-xl text-[13.5px] tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border border-[#E4E0D9] min-h-[46px]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#817D76]" />
          <span>초기화</span>
        </button>
      </div>
    </form>
  );
}
