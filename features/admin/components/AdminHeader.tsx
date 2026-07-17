import React from "react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-[#E4E0D9] h-16 px-4 lg:px-8 flex justify-between items-center w-full shrink-0">
      {/* 좌측 영역 */}
      <div className="flex items-center gap-3">
        {/* 햄버거 메뉴 토글 버튼 */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="메뉴 토글"
          className="p-1.5 rounded-lg border border-[#E4E0D9] hover:bg-[#F6F4F0]/40 text-[#111111] cursor-pointer focus:outline-none transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div className="flex items-baseline gap-2">
          <h2 className="text-[17px] font-extrabold text-[#111111] tracking-tight leading-none">
            ALLPASS Study OS
          </h2>
          <span className="text-[10px] bg-[#F6F4F0] border border-[#E4E0D9] text-[#817D76] font-extrabold px-1.5 py-0.5 rounded">
            프로토타입
          </span>
        </div>
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center gap-4">
        <span className="hidden md:inline-block text-[12px] text-[#817D76] font-semibold">
          운영 대시보드 모드
        </span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C93A35] flex items-center justify-center font-bold text-white text-[12px]">
            AD
          </div>
          <span className="text-[13px] font-bold text-[#111111] hidden sm:inline-block">
            마스터님
          </span>
        </div>
      </div>
    </header>
  );
}
