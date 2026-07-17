import React from "react";
import { Search, RotateCcw } from "lucide-react";

interface MemberSearchFormProps {
  searchName: string;
  setSearchName: (val: string) => void;
  onSearch: (keyword: string) => void;
  onReset: () => void;
}

export function MemberSearchForm({
  searchName,
  setSearchName,
  onSearch,
  onReset,
}: MemberSearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchName);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col md:flex-row md:items-end gap-4"
    >
      <div className="flex-1 space-y-2">
        <label
          htmlFor="search-name"
          className="block text-[13px] font-bold text-[#111111] tracking-wide"
        >
          회원 이름 검색
        </label>
        <div className="relative">
          <input
            id="search-name"
            type="text"
            placeholder="이름을 입력하세요 (예: 김서연)"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:mb-0">
        <button
          type="submit"
          className="flex-1 md:flex-initial bg-[#111111] hover:bg-[#C93A35] text-white font-bold py-3.5 px-6 rounded-xl text-[13px] tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>검색</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 md:flex-initial bg-[#F6F4F0] hover:bg-[#E4E0D9] text-[#111111] font-bold py-3.5 px-6 rounded-xl text-[13px] tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border border-[#E4E0D9]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#817D76]" />
          <span>초기화</span>
        </button>
      </div>
    </form>
  );
}
