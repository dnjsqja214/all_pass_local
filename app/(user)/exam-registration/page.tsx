"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, HelpCircle, Clock, X } from "lucide-react";
import { examRegistrationService, ExamRegistration } from "../../../features/exam/services/examRegistrationService";
import { ExamSelectionPage } from "../../../features/exam/ExamSelectionPage";
import { mockExams } from "../../../features/exam/data/mockExams";

export default function ExamRegistrationPage() {
  const [registrations, setRegistrations] = useState<ExamRegistration[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  // Form 입력값 상태 관리
  const [targetDate, setTargetDate] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedExamTitle, setSelectedExamTitle] = useState<string | null>(null);

  // 신청 목록 마운트 시 가져오기 및 openForm 쿼리 파라미터 체크
  useEffect(() => {
    setRegistrations(examRegistrationService.getRegistrations());

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("openForm") === "true") {
        handleOpenForm();

        // URL 클린업 (옵션: 새로고침 시 계속 열려있는 것 방지)
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  const handleOpenForm = () => {
    setTargetDate("");
    setSelectedExamId(null);
    setSelectedExamTitle(null);
    setIsFormOpen(true);
  };

  const handleSelectExamClick = () => {
    setIsSelectionOpen(true);
  };

  const handleSelectExam = (examId: string) => {
    setIsSelectionOpen(false);
    const exam = mockExams.find((e) => e.id === examId);
    if (exam) {
      setSelectedExamId(exam.id);
      setSelectedExamTitle(exam.title);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (dateStr: string) => {
    const todayStr = getTodayString();
    if (dateStr < todayStr) {
      alert("오늘 이전의 날짜는 선택할 수 없습니다.");
      setTargetDate("");
      return;
    }

    const isDuplicate = registrations.some((reg) => reg.registrationDate === dateStr);
    if (isDuplicate) {
      alert("이미 해당 날짜에 신청된 시험이 있습니다. 다른 날짜를 선택해주세요.");
      setTargetDate("");
    } else {
      setTargetDate(dateStr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !targetDate) return;

    const todayStr = getTodayString();
    if (targetDate < todayStr) {
      alert("오늘 이전의 날짜는 선택할 수 없습니다.");
      setTargetDate("");
      return;
    }

    const isDuplicate = registrations.some((reg) => reg.registrationDate === targetDate);
    if (isDuplicate) {
      alert("이미 해당 날짜에 신청된 시험이 있습니다. 다른 날짜를 선택해주세요.");
      setTargetDate("");
      return;
    }

    try {
      await examRegistrationService.registerExam(selectedExamId, targetDate);
      setRegistrations(examRegistrationService.getRegistrations());
      setIsFormOpen(false);
    } catch (err: any) {
      alert(err.message || "시험 신청에 실패했습니다.");
    }
  };

  const handleCancelRegistration = (id: string) => {
    if (confirm("정말 이 시험 신청을 취소하시겠습니까?")) {
      examRegistrationService.cancelRegistration(id);
      setRegistrations(examRegistrationService.getRegistrations());
    }
  };

  return (
    <div className="flex-grow flex flex-col h-full min-h-0 overflow-hidden px-4 pt-6 md:px-8 xl:p-8 space-y-5">
      {/* 상단 타이틀 영역 (데스크톱용은 레이아웃 헤더가 감싸고 있지만 모바일 상단 대응도 함께 구성) */}
      <div className="hidden xl:flex flex-col gap-1 mb-1 shrink-0">
        <h1 className="text-[28px] font-black text-[#111111] tracking-tight">
          시험 신청 목록
        </h1>
      </div>

      {/* 목록 헤더 & 버튼 */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-[#E4E0D9] shadow-xs shrink-0">
        <div>
          <h2 className="text-[16px] font-extrabold text-[#111111] tracking-tight">
            신청 내역 요약
          </h2>
          <p className="text-[12px] text-[#817D76] font-medium mt-0.5">
            등록된 시험 일정: <strong className="text-[#C93A35] font-black">{registrations.length}</strong>건
          </p>
        </div>
        <button
          onClick={handleOpenForm}
          className="bg-[#C93A35] hover:bg-[#A82A25] active:bg-[#92231F] text-white font-bold text-[13px] py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs min-h-[40px] border-none outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>신청 추가</span>
        </button>
      </div>

      {/* 리스트 본문 영역 */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-16">
        {registrations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-[#E4E0D9] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C93A35]/25 transition-all"
              >
                {/* 좌측 정보 영역 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#C93A35] bg-[#C93A35]/5 border border-[#C93A35]/15 px-2 py-0.5 rounded uppercase tracking-wider">
                      {reg.round}회 기출
                    </span>
                  </div>
                  <h3 className="text-[16.5px] font-black text-[#111111] tracking-tight truncate">
                    {reg.examTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#817D76] font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      목표일: <strong className="text-[#111111] font-bold">{reg.registrationDate}</strong>
                    </span>
                    <span className="text-[#E4E0D9]">|</span>
                    <span>과목: {reg.subject}</span>
                  </div>
                </div>

                {/* 우측 제어 단추 */}
                <div className="flex items-center justify-end shrink-0 border-t border-[#F6F4F0] pt-3 md:border-t-0 md:pt-0">
                  <button
                    onClick={() => handleCancelRegistration(reg.id)}
                    className="px-4 py-2 bg-white hover:bg-[#FDF1F0] active:bg-[#FCDAD7] text-[#D93D35] border border-[#D93D35]/25 hover:border-[#D93D35]/40 font-bold text-[12px] rounded-xl transition-all cursor-pointer min-h-[38px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>신청 취소</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4E0D9] p-8 text-center shadow-xs flex flex-col items-center justify-center gap-4 py-16">
            <div className="w-14 h-14 rounded-full bg-[#F6F4F0] flex items-center justify-center text-[#817D76]">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[15px] font-extrabold text-[#111111]">
                신청된 시험이 없습니다.
              </h3>
              <p className="text-[12px] text-[#817D76] font-medium">
                상단의 "신청 추가" 버튼을 눌러 목표 시험을 추가해 보세요.
              </p>
            </div>
            <button
              onClick={handleOpenForm}
              className="bg-[#C93A35] hover:bg-[#A82A25] text-white font-bold text-[12px] py-2 px-4 rounded-xl transition-colors cursor-pointer min-h-[36px] border-none outline-none shadow-xs"
            >
              새로운 시험 신청하기
            </button>
          </div>
        )}
      </div>

      {/* 1. 시험 신청 Form 모달 팝업 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form
            onSubmit={handleSubmit}
            className="bg-[#F6F4F0] rounded-3xl w-full max-w-md p-6 border border-[#E4E0D9] shadow-2xl flex flex-col gap-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center border-b border-[#E4E0D9] pb-3">
              <h3 className="text-[17px] font-black text-[#111111] tracking-tight">
                새로운 시험 신청
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 hover:bg-[#EAE8E2] rounded-full transition-colors cursor-pointer text-[#817D76] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 입력 폼 필드 */}
            <div className="space-y-4">
              {/* 날짜 선택 */}
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#111111] tracking-wide">
                  응시 목표일 선택
                </label>
                <input
                  type="date"
                  required
                  min={getTodayString()}
                  value={targetDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-white border border-[#E4E0D9] rounded-xl px-4 py-3 text-[14px] text-[#111111] font-semibold focus:outline-none focus:border-[#C93A35] transition-all cursor-pointer"
                />
              </div>

              {/* 시험 선택 */}
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#111111] tracking-wide">
                  대상 시험 선택
                </label>
                <div className="flex flex-col gap-2">
                  {selectedExamTitle ? (
                    <div className="bg-white border border-[#E4E0D9] rounded-xl px-4 py-3 flex justify-between items-center">
                      <span className="text-[14px] text-[#111111] font-bold truncate">
                        {selectedExamTitle}
                      </span>
                      <button
                        type="button"
                        onClick={handleSelectExamClick}
                        className="text-[12px] font-bold text-[#C93A35] hover:text-[#A82A25] transition-colors cursor-pointer border-none outline-none bg-transparent"
                      >
                        변경
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSelectExamClick}
                      className="w-full bg-white hover:bg-neutral-50 border border-[#E4E0D9] rounded-xl px-4 py-3 text-[14px] text-[#817D76] hover:text-[#111111] font-bold text-center transition-all cursor-pointer min-h-[46px] flex items-center justify-center border-dashed"
                    >
                      <span>클릭하여 시험 선택하기</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 하단 제어 단추 */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E4E0D9]">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-full py-3 px-4 bg-white border border-[#E4E0D9] text-[#111111] font-bold text-[13.5px] rounded-xl hover:bg-[#EAE8E2] transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!selectedExamId || !targetDate}
                className={`w-full py-3 px-4 font-bold text-[13.5px] rounded-xl transition-colors cursor-pointer border-none outline-none ${selectedExamId && targetDate
                    ? "bg-[#C93A35] hover:bg-[#A82A25] text-white"
                    : "bg-[#E4E0D9] text-[#A8A7A5] cursor-not-allowed"
                  }`}
              >
                신청하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. 중첩 시험 선택 팝업 모달 */}
      {isSelectionOpen && (
        <ExamSelectionPage
          isModal
          onClose={() => setIsSelectionOpen(false)}
          onSelectExam={handleSelectExam}
        />
      )}
    </div>
  );
}
