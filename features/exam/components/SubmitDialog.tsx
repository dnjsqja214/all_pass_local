import React from "react";

interface SubmitDialogProps {
  isOpen: boolean;
  unansweredCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmitDialog({
  isOpen,
  unansweredCount,
  onClose,
  onConfirm,
}: SubmitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      {/* OMR 제출 모달 박스 */}
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E4E0D9] shadow-2xl flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {/* AlertTriangle 대체 인라인 SVG */}
          <div className="w-10 h-10 rounded-full bg-[#FDF1F0] flex items-center justify-center text-[#C93A35] shrink-0 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-[17px] font-extrabold text-[#111111] tracking-tight leading-tight">
              시험을 제출하시겠습니까?
            </h3>
            <p className="text-[13px] text-[#817D76] font-medium mt-1">
              제출 후에는 답안을 수정할 수 없습니다.
            </p>
          </div>
        </div>

        {/* 미응답 경고 박스 */}
        {unansweredCount > 0 && (
          <div className="bg-[#FFFDF0] border border-[#F6EAA9] p-3.5 rounded-xl flex flex-col gap-1">
            <span className="text-[13px] font-extrabold text-[#785E08]">
              ⚠️ 미응답 {unansweredCount}문항이 있습니다.
            </span>
            <span className="text-[12px] text-[#8C731A] font-medium leading-relaxed">
              작성되지 않은 문항은 자동 오답 처리됩니다. 그래도 제출을 진행하시겠습니까?
            </span>
          </div>
        )}

        {/* 하단 취소/제출 단추 */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-[#F6F4F0] border border-[#E4E0D9] text-[#111111] font-bold text-[14px] rounded-xl hover:bg-[#EAE8E2] transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 bg-[#C93A35] text-white font-bold text-[14px] rounded-xl hover:bg-[#B82F2A] transition-colors cursor-pointer focus:ring-2 focus:ring-[#C93A35]"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
