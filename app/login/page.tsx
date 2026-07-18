"use client";

import React from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F6F4F0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* 장식용 은은한 그라데이션 블러 서클 (미적인 요소 추가) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#C93A35]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3F7D4E]/5 blur-[120px] pointer-events-none" />

      {/* 로그인 폼 */}
      <LoginForm />
    </div>
  );
}
