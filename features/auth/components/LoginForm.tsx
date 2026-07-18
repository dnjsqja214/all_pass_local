"use client";

import { LoginButton } from "@/features/coderhan/components/LoginButton";

export function LoginForm() {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E4E0D9] p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)]">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#C93A35] flex items-center justify-center font-black text-white text-[24px] mb-4 shadow-md shadow-[#C93A35]/20 animate-fade-in">
          A
        </div>
        <h1 className="text-[24px] font-black text-[#111111] tracking-tight">
          ALLPASS
        </h1>
      </div>

      <LoginButton className="w-full" label="로그인" />
    </div>
  );
}
