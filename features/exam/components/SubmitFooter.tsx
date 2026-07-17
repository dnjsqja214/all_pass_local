import React from "react";

interface SubmitFooterProps {
  onSubmitClick: () => void;
}

export function SubmitFooter({ onSubmitClick }: SubmitFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 xl:left-64 right-0 bg-white border-t border-[#E4E0D9] px-4 py-3.5 flex justify-center z-30 shadow-md">
      <div className="w-full max-w-md md:max-w-2xl xl:max-w-[1440px] flex justify-center">
        <button
          type="button"
          onClick={onSubmitClick}
          className="w-full xl:w-auto xl:px-24 bg-[#C93A35] hover:bg-[#B82F2A] text-white text-[15px] font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C93A35]"
        >
          {/* Send 대체 인라인 SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
          <span>정답지 제출하기</span>
        </button>
      </div>
    </div>
  );
}
