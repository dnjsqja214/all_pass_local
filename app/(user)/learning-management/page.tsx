"use client";

import React from "react";
import { useDashboardData } from "../../../features/dashboard/hooks/useDashboardData";
import { LearningSummaryCards } from "../../../features/learning/components/LearningSummaryCards";
import { ScoreTrendChart } from "../../../features/learning/components/ScoreTrendChart";
import { SubjectScoreList } from "../../../features/learning/components/SubjectScoreList";
import { PassingRuleCard } from "../../../features/learning/components/PassingRuleCard";
import { ExamHistoryList } from "../../../features/learning/components/ExamHistoryList";
import { WeakTopicList } from "../../../features/learning/components/WeakTopicList";

export default function LearningManagement() {
  const { examAttempts, scoreTrend, wrongNotes } = useDashboardData("profile");

  const latestAttempt = examAttempts[0];

  // 과목명 맵핑
  const mapSubjectName = (name: string) => {
    if (name === "중개") return "중개사법령 및 실무";
    if (name === "공법") return "부동산공법";
    if (name === "세법") return "부동산세법";
    return name;
  };

  // 과목별 점수 데이터 구성
  const subjectScoresMapped = latestAttempt
    ? latestAttempt.subjectScores.map((sub) => ({
        subject: mapSubjectName(sub.name),
        score: sub.score,
      }))
    : [];

  // 총 누적 계산
  const studyMinutes = 870; // 주당 14.5시간 기준 누적 공부시간
  const examCount = examAttempts.length;
  const averageScore = examAttempts.reduce((acc, a) => acc + a.totalScore, 0) / (examAttempts.length || 1);
  const wrongAnswerCount = wrongNotes.reduce((acc, n) => acc + n.frequency, 0);

  // 차트 트렌드 데이터 변환
  const trendData = scoreTrend.map((pt) => ({
    label: pt.round,
    score: pt.score,
  }));

  // 시험 이력 데이터 변환
  const examHistoryMapped = examAttempts.map((attempt) => {
    const hasFail = attempt.subjectScores.some((s) => s.score < 40);
    const passed = attempt.totalScore >= 180 && !hasFail;
    return {
      id: attempt.id,
      examTitle: attempt.roundTitle,
      attemptTitle: attempt.attemptTitle,
      date: attempt.date,
      totalScore: attempt.totalScore,
      isPassed: passed,
      subjects: attempt.subjectScores.map((s) => ({
        name: mapSubjectName(s.name),
        score: s.score,
        isFailed: s.score < 40,
      })),
    };
  });

  // 취약 단원 데이터 변환
  const weakTopicsMapped = wrongNotes.map((note) => ({
    topic: note.topic,
    wrongCount: note.frequency,
  }));

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

      {/* 1. 학습 요약 카드 (4열) */}
      <LearningSummaryCards
        studyMinutes={studyMinutes}
        examCount={examCount}
        averageScore={averageScore}
        wrongAnswerCount={wrongAnswerCount}
      />

      {/* 2. 상세 지표 그리드 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 좌측: 차트 */}
        <div className="xl:col-span-7">
          <ScoreTrendChart trendData={trendData} />
        </div>

        {/* 우측: 합격 판정 & 과목 점수 */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <PassingRuleCard
            totalScore={latestAttempt ? latestAttempt.totalScore : 0}
            subjectScores={subjectScoresMapped}
          />
          <SubjectScoreList subjectScores={subjectScoresMapped} />
        </div>

        {/* 하단: 취약 단원 & 시험 이력 */}
        <div className="xl:col-span-5">
          <WeakTopicList weakTopics={weakTopicsMapped} />
        </div>
        
        <div className="xl:col-span-7">
          <ExamHistoryList history={examHistoryMapped} />
        </div>
      </div>
    </div>
  );
}
