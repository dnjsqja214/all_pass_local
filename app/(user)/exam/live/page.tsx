"use client";

import { useRouter } from "next/navigation";

export default function LiveExam() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#E4E0D9] bg-white p-8 text-center shadow-sm">
        <h1 className="text-[20px] font-black text-[#111111]">응시할 시험을 선택해 주세요.</h1>
        <p className="mt-2 text-[13px] font-medium text-[#817D76]">
          시험을 선택하면 백엔드에서 응시 세션과 남은 시간을 불러옵니다.
        </p>
        <button
          type="button"
          onClick={() => router.push("/exams")}
          className="mt-6 w-full rounded-xl bg-[#C93A35] px-5 py-3.5 text-[14px] font-bold text-white cursor-pointer hover:bg-[#A82A25]"
        >
          시험 선택하기
        </button>
      </div>
    </div>
  );
}
