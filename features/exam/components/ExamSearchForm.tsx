import React from "react";
import { Search, RotateCcw } from "lucide-react";

interface ExamSearchFormProps {
  title: string;
  setTitle: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  round: string;
  setRound: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function ExamSearchForm({
  title,
  setTitle,
  year,
  setYear,
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
      className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col lg:flex-row lg:items-end gap-4"
    >
      {/* 1. 시험명 */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <label
          htmlFor="search-title"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          시험명
        </label>
        <div className="relative">
          <input
            id="search-title"
            type="text"
            placeholder="시험명을 입력하세요 (예: 35회 부동산공법)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
        </div>
      </div>

      {/* 2. 연도 선택 */}
      <div className="w-full lg:w-44 space-y-2">
        <label
          htmlFor="search-year"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          연도
        </label>
        <select
          id="search-year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl px-4 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer"
        >
          <option value="all">전체</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      {/* 3. 회차 선택 */}
      <div className="w-full lg:w-44 space-y-2">
        <label
          htmlFor="search-round"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          회차
        </label>
        <select
          id="search-round"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl px-4 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer"
        >
          <option value="all">전체</option>
          <option value="35">35회</option>
          <option value="34">34회</option>
          <option value="33">33회</option>
          <option value="32">32회</option>
        </select>
      </div>

      {/* 4. 버튼 영역 */}
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <button
          type="submit"
          className="flex-1 lg:flex-initial bg-[#111111] hover:bg-[#C93A35] text-white font-bold py-3.5 px-6 rounded-xl text-[13px] tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <span>검색</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 lg:flex-initial bg-[#F6F4F0] hover:bg-[#E4E0D9] text-[#111111] font-bold py-3.5 px-6 rounded-xl text-[13px] tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border border-[#E4E0D9] min-h-[44px]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#817D76]" />
          <span>초기화</span>
        </button>
      </div>
    </form>
  );
}
