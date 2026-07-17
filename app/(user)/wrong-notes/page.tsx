"use client";

import React, { useState } from "react";
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
  const [selectedSubject, setSelectedSubject] = useState<string>("전체");
  const [myNotesOnly, setMyNotesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCauseFilter, setSelectedCauseFilter] = useState<string>("전체");

  // 개별 카드의 오답 원인 변경 핸들러
  const handleCauseChange = (cardId: string, newCause: "unknown" | "confused" | "mistake") => {
    setCardCauses((prev) => ({
      ...prev,
      [cardId]: newCause,
    }));
  };

  // 과목 목록 상단 필터용 리스트
  const subjects = ["전체", "부동산세법", "부동산공법", "중개·물권"];

  // 필터링 적용된 오답 노트 데이터
  const filteredNotes = wrongNotes.filter((note) => {
    // 1. 과목 필터링
    if (selectedSubject !== "전체" && note.subject !== selectedSubject) return false;
    
    // 2. 검색어 필터링 (과목, 단원명, 개념)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchSubject = note.subject.toLowerCase().includes(query);
      const matchChapter = note.chapter.toLowerCase().includes(query);
      const matchTopic = note.topic.toLowerCase().includes(query);
      if (!matchSubject && !matchChapter && !matchTopic) return false;
    }

    // 3. 데스크톱용 오답 원인 필터링
    const currentCause = cardCauses[note.id] || note.cause;
    if (selectedCauseFilter !== "전체") {
      if (selectedCauseFilter === "아예 모름" && currentCause !== "unknown") return false;
      if (selectedCauseFilter === "애매" && currentCause !== "confused") return false;
      if (selectedCauseFilter === "알면서 실수" && currentCause !== "mistake") return false;
    }

    // 4. 내 오답만 모아보기 (체크 시 특정 조건 필터 예시)
    if (myNotesOnly && currentCause === "unknown") return false;

    return true;
  });

  // 별점 ★ 렌더러
  const renderStars = (count: number) => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <span
        key={idx}
        className={`text-[13px] ${
          idx < count ? "text-[#C93A35]" : "text-[#E4E0D9]"
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
        <p className="text-[14px] text-[#817D76] font-medium">
          누적 오답을 과목 및 유발 원인별로 상세히 분류하고 유사 문제로 보완합니다.
        </p>
      </div>

      {/* 반응형 레이아웃 배치 */}
      {/* 데스크톱: 좌측 필터 사이드 패널 + 우측 오답 카드 리스트 / 모바일&태블릿: 세로 스택 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* 데스크톱 전용 좌측 필터 패널 (xl:col-span-3 / 모바일선 숨김) */}
        <aside className="hidden xl:flex xl:col-span-3 bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-[#F6F4F0] pb-3">
            <h3 className="text-[15px] font-bold text-[#111111] tracking-tight">
              상세 필터 검색
            </h3>
            <p className="text-[11px] text-[#817D76]">
              과목 및 원인별 동적 매칭
            </p>
          </div>

          {/* 검색 입력창 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-[#111111] tracking-wider uppercase">
              오답 개념 검색
            </label>
            <input
              type="text"
              placeholder="과목, 단원, 키워드 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-[13px] px-3.5 py-2.5 bg-[#F6F4F0] border border-[#E4E0D9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C93A35] text-[#111111] font-medium"
            />
          </div>

          {/* 오답 원인 필터 버튼 */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-extrabold text-[#111111] tracking-wider uppercase">
              오답 원인 필터
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["전체", "아예 모름", "애매", "알면서 실수"].map((cause) => {
                const isSelected = selectedCauseFilter === cause;
                return (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => setSelectedCauseFilter(cause)}
                    className={`text-[12px] font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C93A35] border-[#C93A35] text-white"
                        : "bg-white border-[#E4E0D9] text-[#817D76] hover:bg-[#F6F4F0]"
                    }`}
                  >
                    {cause}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 우측 영역 (데스크톱 9열): 누적 오답 뱃지 + 과목 필터 캡슐 + 오답 카드들 */}
        <div className="xl:col-span-9 space-y-6">
          
          {/* 누적 오답 요약 바 */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E4E0D9] shadow-xs">
            <span className="text-[14px] font-extrabold text-[#111111]">
              누적 오답 <strong className="text-[#C93A35]">{filteredNotes.length}문항</strong>
            </span>
            <label className="flex items-center gap-2 text-[13px] font-bold text-[#111111] cursor-pointer">
              <input
                type="checkbox"
                checked={myNotesOnly}
                onChange={(e) => setMyNotesOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-[#C93A35] cursor-pointer"
              />
              <span>내 오답만 모아보기</span>
            </label>
          </div>

          {/* 과목 필터 알약 버튼 (모바일 가로 스크롤 대응) */}
          <div className="w-full overflow-x-auto scrollbar-hide py-1">
            <div className="flex gap-2 min-w-max">
              {subjects.map((subj) => {
                const isActive = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSelectedSubject(subj)}
                    className={`text-[13px] font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#C93A35] border-[#C93A35] text-white shadow-xs"
                        : "bg-white border-[#E4E0D9] text-[#111111] hover:bg-[#F6F4F0]/60"
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>
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
                              className={`text-[12px] font-extrabold py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
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

    </div>
  );
}
