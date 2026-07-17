"use client";

import React from "react";
import { useDashboardData } from "../../../features/dashboard/hooks/useDashboardData";

export default function LearningManagement() {
  // 학습관리 탭 활성화 상태로 데이터 훅 호출
  const {
    examAttempts,
  } = useDashboardData("profile");

  // 과목별 점수 렌더링 헬퍼 (과락<40: 빨간색, 합격>=60: 초록색, 일반: 검은색)
  const renderSubjectScores = (scores: { name: string; score: number }[]) => {
    return (
      <div className="flex flex-wrap gap-x-2 text-[13px] text-[#817D76]">
        {scores.map((sub, idx) => {
          let scoreColor = "text-[#111111]";
          if (sub.score < 40) {
            scoreColor = "text-[#D93D35] font-bold";
          } else if (sub.score >= 60) {
            scoreColor = "text-[#3F7D4E] font-bold";
          }
          return (
            <span key={idx} className="inline-flex items-center">
              <span>{sub.name}</span>
              <span className={`ml-1 ${scoreColor}`}>{sub.score}</span>
              {idx < scores.length - 1 && <span className="ml-2 text-[#E4E0D9]">·</span>}
            </span>
          );
        })}
      </div>
    );
  };

  // 총점 합격 여부 렌더링 헬퍼
  const isPassAttempt = (attempt: typeof examAttempts[0]) => {
    const hasFailSubject = attempt.subjectScores.some(s => s.score < 40);
    return attempt.totalScore >= 180 && !hasFailSubject;
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-20 md:px-8 xl:p-8 space-y-6">
      
      {/* 학습관리 타이틀 (데스크톱용) */}
      <div className="hidden xl:flex flex-col gap-1 mb-2">
        <h1 className="text-[28px] font-black text-[#111111] tracking-tight">
          학습관리 대시보드
        </h1>
        <p className="text-[14px] text-[#817D76] font-medium">
          회차별 시험 성적 추이와 합격 기준 부합 여부를 한눈에 진단합니다.
        </p>
      </div>

      {/* 반응형 레이아웃 배치 */}
      {/* 데스크톱: 2단 그리드 및 하단 테이블 / 모바일&태블릿: 세로 스택 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* 점수 추이 차트 카드 (데스크톱 7열 / 모바일 전체) */}
        <div className="xl:col-span-7 bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-[#F6F4F0] pb-3">
            <h3 className="text-[17px] font-bold text-[#111111] tracking-tight">
              33회 반복 응시 - 점수 추이
            </h3>
            <p className="text-[12px] text-[#817D76]">
              최근 3회차 총점 변동 내역
            </p>
          </div>

          {/* SVG 선형 차트 영역 */}
          <div className="w-full bg-[#F6F4F0]/30 rounded-xl p-3 flex justify-center">
            <svg viewBox="0 0 400 180" className="w-full max-w-[450px] overflow-visible">
              {/* 가로 그리드선 및 점수 라벨 */}
              <line x1="40" y1="150" x2="380" y2="150" stroke="#E4E0D9" strokeDasharray="3 3" />
              <text x="30" y="154" fill="#817D76" fontSize="10" textAnchor="end">100</text>
              
              <line x1="40" y1="75" x2="380" y2="75" stroke="#E4E0D9" strokeDasharray="3 3" />
              <text x="30" y="79" fill="#817D76" fontSize="10" textAnchor="end">150</text>
              
              <line x1="40" y1="0" x2="380" y2="0" stroke="#E4E0D9" strokeDasharray="3 3" />
              <text x="30" y="4" fill="#817D76" fontSize="10" textAnchor="end">200</text>

              {/* 초록색 합격선 기준 (180점: y=30) */}
              <line x1="40" y1="30" x2="380" y2="30" stroke="#3F7D4E" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="385" y="34" fill="#3F7D4E" fontSize="9" fontWeight="bold" textAnchor="start">합격선 (180점)</text>

              {/* 차트 꺾은선 (1회: 142점(y=87) -> 2회: 163점(y=55.5) -> 3회: 188점(y=18)) */}
              <path
                d="M 60 87 L 210 55.5 L 360 18"
                fill="none"
                stroke="#C93A35"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 포인트 1 (1회: 142점) */}
              <circle cx="60" cy="87" r="6" fill="#C93A35" stroke="white" strokeWidth="2" />
              <text x="60" y="74" fill="#111111" fontSize="12" fontWeight="extrabold" textAnchor="middle">142점</text>
              <text x="60" y="172" fill="#817D76" fontSize="11" fontWeight="bold" textAnchor="middle">1회차</text>

              {/* 포인트 2 (2회: 163점) */}
              <circle cx="210" cy="55.5" r="6" fill="#C93A35" stroke="white" strokeWidth="2" />
              <text x="210" y="42.5" fill="#111111" fontSize="12" fontWeight="extrabold" textAnchor="middle">163점</text>
              <text x="210" y="172" fill="#817D76" fontSize="11" fontWeight="bold" textAnchor="middle">2회차</text>

              {/* 포인트 3 (3회: 188점) */}
              <circle cx="360" cy="18" r="6" fill="#C93A35" stroke="white" strokeWidth="2" />
              <text x="360" y="5" fill="#3F7D4E" fontSize="12" fontWeight="extrabold" textAnchor="middle">188점</text>
              <text x="360" y="172" fill="#817D76" fontSize="11" fontWeight="bold" textAnchor="middle">3회차</text>
            </svg>
          </div>

          {/* 하단 격려 및 정보 문구 */}
          <div className="bg-[#F6F4F0] p-4 rounded-xl border border-[#E4E0D9] text-center">
            <span className="text-[13px] text-[#111111] font-medium leading-relaxed tracking-tight">
              반복할수록 오르는 게 눈에 보여요 —{" "}
              <strong className="text-[#3F7D4E]">3회차 188점</strong>,{" "}
              <strong className="text-[#3F7D4E]">합격선 통과</strong>
            </span>
          </div>
        </div>

        {/* 우측 영역 (데스크톱 5열: 합격조건 + 학습요약) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* 합격 조건 안내 카드 (Dark Background) */}
          <div className="bg-[#151515] text-white rounded-2xl p-5 border border-[#2C2A27] flex flex-col gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3F7D4E]" />
              <h4 className="text-[14px] font-extrabold tracking-wider text-gray-300 uppercase">
                이중 합격 조건 자동 판정
              </h4>
            </div>
            <div className="text-[14px] text-gray-100 font-semibold leading-relaxed tracking-tight">
              총점 <strong className="text-white text-base">180점 이상</strong>(평균 60점) & 과목별 <strong className="text-[#C93A35] text-base">40점 이상</strong>(과락 방지)
            </div>
            <p className="text-[11px] text-gray-400">
              * 1차 시험 기준: 3과목(부동산학개론, 민법, 부동산공법/세법) 기준 예시 시뮬레이션입니다.
            </p>
          </div>

          {/* 학습 요약 분석 카드 (데스크톱 전용 추가 구성) */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4E0D9] shadow-sm flex flex-col gap-4">
            <h4 className="text-[15px] font-bold text-[#111111] border-b border-[#F6F4F0] pb-2">
              학습 분석 요약
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#817D76]">평균 획득 총점</span>
                <span className="font-extrabold text-[#111111]">176.3점</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#817D76]">최고 기록 회차</span>
                <span className="font-extrabold text-[#3F7D4E]">33회 (188점, 합격)</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#817D76]">취약 과목 진단</span>
                <span className="font-extrabold text-[#D93D35]">세법 (평균 45.8점)</span>
              </div>
            </div>
            <div className="bg-[#FDF1F0] p-3 rounded-lg border border-[#FCDDDB] text-[12px] text-[#B83A38] font-medium leading-relaxed">
              💡 세법에서 과락(40점 미만) 위험이 감지되었습니다. 취약 개념 오답 복습을 추천합니다.
            </div>
          </div>
        </div>

        {/* 하단 회차별 응시 이력 (데스크톱에서는 아래 가로 전체 테이블 / 모바일&태블릿에서는 리스트) */}
        <div className="xl:col-span-12 space-y-3">
          <h3 className="text-[14px] font-bold text-[#C93A35] tracking-widest uppercase">
            회차별 응시 이력
          </h3>

          {/* 1. 모바일 및 태블릿 리스트 뷰 (xl:hidden) */}
          <div className="xl:hidden bg-white rounded-2xl border border-[#E4E0D9] shadow-sm overflow-hidden">
            <div className="divide-y divide-[#E4E0D9]">
              {examAttempts.map((attempt) => {
                const passed = isPassAttempt(attempt);
                return (
                  <div key={attempt.id} className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[18px] font-extrabold text-[#111111]">
                        {attempt.roundTitle}
                      </h4>
                      <span className="text-[12px] text-[#817D76]">
                        {attempt.attemptTitle} · {attempt.date}
                      </span>
                    </div>

                    {/* 과목별 점수 리스트 */}
                    {renderSubjectScores(attempt.subjectScores)}

                    <div className="flex justify-between items-center pt-1 border-t border-[#F6F4F0]">
                      <span className="text-[12px] font-bold text-[#817D76]">결과</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#817D76]">
                          총점 <strong className="text-[#111111]">{attempt.totalScore}</strong>
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          passed 
                            ? "bg-[#E6F4EA] text-[#137333]" 
                            : "bg-[#FDF1F0] text-[#B83A38]"
                        }`}>
                          {passed ? "합격" : "불합격"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. 데스크톱 테이블 뷰 (hidden xl:block) */}
          <div className="hidden xl:block bg-white rounded-2xl border border-[#E4E0D9] shadow-sm overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F6F4F0] border-b border-[#E4E0D9] text-[13px] font-bold text-[#111111]">
                  <th className="px-6 py-4">시험 회차</th>
                  <th className="px-6 py-4">응시 차수</th>
                  <th className="px-6 py-4">응시 날짜</th>
                  <th className="px-6 py-4">과목별 점수</th>
                  <th className="px-6 py-4 text-center">총점</th>
                  <th className="px-6 py-4 text-center">합격 여부</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E0D9] text-[14px]">
                {examAttempts.map((attempt) => {
                  const passed = isPassAttempt(attempt);
                  return (
                    <tr key={attempt.id} className="hover:bg-[#F6F4F0]/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#111111]">{attempt.roundTitle}</td>
                      <td className="px-6 py-4 text-[#817D76]">{attempt.attemptTitle}</td>
                      <td className="px-6 py-4 text-[#817D76]">{attempt.date}</td>
                      <td className="px-6 py-4">{renderSubjectScores(attempt.subjectScores)}</td>
                      <td className="px-6 py-4 text-center font-extrabold text-[#111111]">{attempt.totalScore}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[12px] font-bold px-3 py-1 rounded-full inline-block ${
                          passed 
                            ? "bg-[#E6F4EA] text-[#137333]" 
                            : "bg-[#FDF1F0] text-[#B83A38]"
                        }`}>
                          {passed ? "합격" : "불합격"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
