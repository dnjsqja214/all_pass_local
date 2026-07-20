"use client";

import React, { useState } from "react";
import { RotateCcw, ChevronDown } from "lucide-react";
import { useDashboardData } from "../../../features/dashboard/hooks/useDashboardData";

export default function WrongNotes() {
  // 오답노트 탭 활성화 상태로 데이터 훅 호출
  const {
    wrongNotes,
  } = useDashboardData("incorrect");

  // 오답 카드별 원인 분류 로컬 상태 관리 (초기값 mock data로 바인딩)
  const [cardCauses, setCardCauses] = useState<Record<string, "unknown" | "confused" | "mistake">>(
    wrongNotes.reduce((acc, note) => {
      acc[note.id] = note.cause;
      return acc;
    }, {} as Record<string, "unknown" | "confused" | "mistake">)
  );

  // 필터 조건 상태
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedRound, setSelectedRound] = useState<string>("all");
  const [myNotesOnly, setMyNotesOnly] = useState<boolean>(false);

  // 검색 시점에 적용할 필터 상태 (검색하기 버튼 클릭 시 반영)
  const [appliedType, setAppliedType] = useState<string>("all");
  const [appliedSubject, setAppliedSubject] = useState<string>("all");
  const [appliedRound, setAppliedRound] = useState<string>("all");

  // 개별 카드의 오답 원인 변경 핸들러
  const handleCauseChange = (cardId: string, newCause: "unknown" | "confused" | "mistake") => {
    setCardCauses((prev) => ({
      ...prev,
      [cardId]: newCause,
    }));
  };

  const handleSearch = () => {
    setAppliedType(selectedType);
    setAppliedSubject(selectedSubject);
    setAppliedRound(selectedRound);
  };

  const handleReset = () => {
    setSelectedType("all");
    setSelectedSubject("all");
    setSelectedRound("all");
    setAppliedType("all");
    setAppliedSubject("all");
    setAppliedRound("all");
  };

  // 필터링 적용된 오답 노트 데이터
  const filteredNotes = wrongNotes.filter((note) => {
    // 1. 과목 필터링 (부동산 공법 / 부동산공시법령 부동산세법)
    if (appliedSubject !== "all") {
      if (appliedSubject === "부동산 공법" && note.subject !== "부동산공법") return false;
      if (appliedSubject === "부동산공시법령 부동산세법" && note.subject !== "부동산세법") return false;
    }

    // 2. 회차 필터링
    if (appliedRound !== "all") {
      if (appliedRound === "35") {
        if (note.id !== "wrong-1" && note.id !== "wrong-3") return false;
      }
      if (appliedRound === "34") {
        if (note.id !== "wrong-2") return false;
      }
    }

    // 3. 유형 필터링
    if (appliedType !== "all") {
      if (appliedType === "pre") {
        if (note.id !== "wrong-1" && note.id !== "wrong-2") return false;
      }
      if (appliedType === "mock") {
        if (note.id !== "wrong-3") return false;
      }
    }

    // 4. 내 오답만 모아보기 (체크 시 특정 조건 필터 예시)
    const currentCause = cardCauses[note.id] || note.cause;
    if (myNotesOnly && currentCause === "unknown") return false;

    return true;
  });

  // 별점 ★ 렌더러
  const renderStars = (count: number) => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <span
        key={idx}
        className={`text-[13px] ${idx < count ? "text-[#C93A35]" : "text-[#E4E0D9]"
          }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-20 md:px-8 xl:p-8 space-y-6">

      {/* 데스크톱 타이틀 (데스크톱용) */}
      <div className="hidden xl:flex flex-col gap-1 mb-2">
        <h1 className="text-[28px] font-black text-[#111111] tracking-tight">
          오답노트 학습 OS
        </h1>
      </div>

      {/* 검색 필터 영역 (시험 선택 조회 조건 필터와 동일한 디자인) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-xs flex flex-col md:flex-row md:items-end gap-4 shrink-0">

        {/* 2. 과목 선택 (부동산 공법, 부동산공시법령 부동산세법 2개만) */}
        <div className="flex-grow md:flex-[1.5] min-w-[200px] space-y-2">
          <label className="block text-[13px] font-bold text-[#111111] tracking-wide">
            과목
          </label>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer hover:bg-[#EAE8E2]"
            >
              <option value="all">전체 과목</option>
              <option value="부동산 공법">부동산 공법</option>
              <option value="부동산공시법령 부동산세법">부동산공시법령 부동산세법</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
          </div>
        </div>

        {/* 3. 회차 선택 (35회, 34회 2개만) */}
        <div className="flex-1 min-w-[140px] space-y-2">
          <label className="block text-[13px] font-bold text-[#111111] tracking-wide">
            회차
          </label>
          <div className="relative">
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
              className="w-full bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl pl-4 pr-10 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all appearance-none cursor-pointer hover:bg-[#EAE8E2]"
            >
              <option value="all">전체 회차</option>
              <option value="35">35회/2026</option>
              <option value="34">34회/2025</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817D76] pointer-events-none" />
          </div>
        </div>

        {/* 초기화 / 검색 버튼 */}
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 py-3 px-5 border border-[#E4E0D9] hover:bg-[#F6F4F0] text-[#817D76] hover:text-[#111111] font-bold text-[14px] rounded-xl transition-all cursor-pointer bg-white"
          >
            <RotateCcw className="w-4 h-4" />
            <span>초기화</span>
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="flex-2 md:flex-none py-3 px-7 bg-[#C93A35] hover:bg-[#A82A25] active:bg-[#971F1A] text-white font-extrabold text-[14px] rounded-xl transition-all cursor-pointer shadow-xs border-none outline-none"
          >
            검색하기
          </button>
        </div>
      </div>

      {/* 반응형 레이아웃 배치 */}
      <div className="space-y-6">

        {/* 누적 오답 요약 바 */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E4E0D9] shadow-xs">
          <span className="text-[14px] font-extrabold text-[#111111]">
            누적 오답 <strong className="text-[#C93A35]">{filteredNotes.length}문항</strong>
          </span>
        </div>

        {/* 오답 리스트 피드 */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E0D9] p-12 text-center text-[#817D76] font-bold text-[14px]">
            필터에 일치하는 오답 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredNotes.map((note) => {
              const currentCause = cardCauses[note.id] || note.cause;

              // aiSummary 줄바꿈 기준으로 핵심 요약과 피드백 분리
              const aiLines = note.aiSummary.split("\n");
              const conceptSummary = aiLines[0] || "핵심 개념 정리";
              const feedback = aiLines[1] || "개념 복습 권장";

              return (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-xs flex flex-col gap-4 transition-all hover:shadow-xs"
                >
                  {/* 카드 헤더 */}
                  <div className="flex justify-between items-start gap-2 border-b border-[#F6F4F0] pb-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] text-[#C93A35] font-extrabold">
                        {note.subject} · {note.chapter}
                      </span>
                      <h4 className="text-[16px] font-black text-[#111111] tracking-tight mt-0.5">
                        {note.topic}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex gap-0.5">{renderStars(note.frequency)}</div>
                      <span className="text-[11px] text-[#817D76] font-semibold">
                        오답 {note.frequency}회
                      </span>
                    </div>
                  </div>

                  {/* 오답 원인 분석 선택 단추 (1문항 1선택 제한) */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold text-[#817D76] tracking-wider uppercase">
                      내가 진단한 오답 원인
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "unknown" as const, label: "아예 모름" },
                        { id: "confused" as const, label: "애매" },
                        { id: "mistake" as const, label: "실수" },
                      ].map((btn) => {
                        const isSelected = currentCause === btn.id;
                        return (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => handleCauseChange(note.id, btn.id)}
                            className={`text-[12px] font-extrabold py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                              ? "bg-[#111111] border-[#111111] text-white shadow-xs"
                              : "bg-[#F6F4F0]/40 border-[#E4E0D9] text-[#817D76] hover:bg-[#F6F4F0]"
                              }`}
                          >
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI 오답 보완 영역 (모바일: 세로 1열 / 데스크톱: 가로 3열) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* ① 진단 피드백 */}
                    <div className="bg-[#F6F4F0]/60 border border-[#E4E0D9] rounded-xl p-3.5">
                      <span className="text-[11px] font-bold text-[#C93A35]">
                        ① 취약점 피드백
                      </span>
                      <p className="text-[12px] text-[#111111] font-bold leading-relaxed mt-1.5">
                        {feedback}
                      </p>
                    </div>

                    {/* ② 오답 개념 정리 */}
                    <div className="bg-[#FFFDF0] border border-[#F6EAA9] rounded-xl p-3.5">
                      <span className="text-[11px] font-bold text-[#A88A1A]">
                        ② AI 핵심 요약
                      </span>
                      <p className="text-[12px] text-[#785E08] font-bold leading-relaxed mt-1.5">
                        {conceptSummary}
                      </p>
                    </div>

                    {/* ③ 유사문제 추천 */}
                    <div className="bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl p-3.5 flex flex-col gap-1.5 justify-between">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold text-[#C93A35]">
                          ③ 재적용
                        </span>
                        <span className="text-[11px] font-extrabold text-[#111111]">
                          유사문제 {note.similarQuestionCount}개
                        </span>
                        <p className="text-[11px] text-[#817D76] font-medium leading-relaxed mt-1">
                          같은 개념·다른 유형으로 훈련 준비됨
                        </p>
                      </div>
                      <span className="text-[9px] text-[#3F7D4E] font-bold text-right self-end mt-2">
                        ✓ 추천 완료
                      </span>
                    </div>
                  </div>

                  {/* ④ 확립 — 유사문제 풀어보기 버튼 */}
                  <button
                    onClick={() => alert(`${note.topic} 관련 유사 문제 풀이를 시작합니다!`)}
                    className="w-full bg-[#111111] hover:bg-[#222222] text-white text-[13px] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>④ 확립 — 유사문제 풀어보기</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
