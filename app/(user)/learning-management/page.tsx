"use client";

import React from "react";
import { useDashboardData } from "../../../features/dashboard/hooks/useDashboardData";
import { ScoreTrendChart } from "../../../features/learning/components/ScoreTrendChart";
import { ExamHistoryList } from "../../../features/learning/components/ExamHistoryList";
import { StudyContributionCalendar } from "../../../features/learning/components/StudyContributionCalendar";

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
    <div className="flex-1 px-4 pt-6 pb-20 md:px-8 xl:p-8 space-y-6 xl:h-full xl:min-h-0 xl:flex xl:flex-col xl:pb-8">
      {/* 2. 상세 지표 그리드 (좌측 차트, 우측 시험 이력 및 학습 잔디) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:flex-1 xl:min-h-0">
        {/* 좌측: 차트 */}
        <div className="xl:col-span-6 xl:h-full xl:min-h-0 flex flex-col gap-6">
          <ScoreTrendChart
            historyData={examAttempts.map((attempt) => ({
              label: `${attempt.roundTitle} ${attempt.attemptTitle}`,
              subjects: attempt.subjectScores.map((s) => ({
                name: mapSubjectName(s.name),
                score: s.score,
                date: s.date || attempt.date,
                roundTitle: s.roundTitle || attempt.roundTitle,
                attemptTitle: s.attemptTitle || attempt.attemptTitle,
              })),
            }))}
          />
        </div>

        {/* 우측: 학습 잔디 & 시험 이력 */}
        <div className="xl:col-span-6 xl:h-full xl:min-h-0 flex flex-col gap-6">
          <StudyContributionCalendar />
          <ExamHistoryList history={examHistoryMapped} className="xl:flex-1 xl:min-h-0" />
        </div>
      </div>
    </div>
  );
}
