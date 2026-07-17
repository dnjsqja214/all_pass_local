"use client";

import React, { useState } from "react";
import { LogIn, Shield, User, AlertCircle } from "lucide-react";
import { mockAccounts } from "../data/mockAccounts";
import { useMockAuth } from "../hooks/useMockAuth";

export function LoginForm() {
  const { login } = useMockAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) {
      setError("계정 유형을 선택해주세요.");
      return;
    }
    setError("");
    const account = mockAccounts.find((acc) => acc.id === selectedRoleId);
    if (account) {
      login(account);
    } else {
      setError("올바르지 않은 계정 정보입니다.");
    }
  };

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
        <p className="text-[14px] text-[#817D76] font-medium mt-1.5">
          테스트할 계정 유형을 선택하세요.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label
            htmlFor="role-select"
            className="block text-[13px] font-bold text-[#111111] mb-2 tracking-wide"
          >
            역할 선택
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                if (e.target.value) setError("");
              }}
              className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl px-4 py-3.5 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] focus:ring-1 focus:ring-[#C93A35] transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                계정 유형 선택
              </option>
              {mockAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.role === "admin" ? "관리자" : "일반 사용자"})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-[#817D76]">
              {selectedRoleId ? (
                mockAccounts.find((a) => a.id === selectedRoleId)?.role === "admin" ? (
                  <Shield className="w-4 h-4 text-[#C93A35]" />
                ) : (
                  <User className="w-4 h-4 text-[#3F7D4E]" />
                )
              ) : null}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 에러 피드백 */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-[#D93D35]/5 border border-[#D93D35]/20 rounded-xl text-[#D93D35] text-[13px] font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#111111] hover:bg-[#C93A35] text-white font-bold py-4 px-6 rounded-xl text-[14px] tracking-wide transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <LogIn className="w-4 h-4" />
          <span>로그인</span>
        </button>
      </form>
    </div>
  );
}
