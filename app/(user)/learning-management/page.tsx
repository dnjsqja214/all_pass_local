"use client";

import React from "react";
import { LearningSummaryCards } from "../../../features/learning/components/LearningSummaryCards";
import { ScoreTrendChart } from "../../../features/learning/components/ScoreTrendChart";
import { SubjectScoreList } from "../../../features/learning/components/SubjectScoreList";
import { PassingRuleCard } from "../../../features/learning/components/PassingRuleCard";
import { ExamHistoryList } from "../../../features/learning/components/ExamHistoryList";
import { WeakTopicList } from "../../../features/learning/components/WeakTopicList";
import { useGetLearningManagementQuery } from "../../../features/learning/api/learningApi";
import { queryErrorMessage } from "../../../features/store/api/queryError";
import styles from "./page.module.css";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "2-digit",
  day: "2-digit",
});

export default function LearningManagement() {
  const { data, error, isLoading, refetch } = useGetLearningManagementQuery();

  if (isLoading) {
    return <div className={styles.state}>실제 학습 기록을 불러오는 중입니다.</div>;
  }

  if (!data) {
    return (
      <div className={styles.state}>
        <p>{queryErrorMessage(error, "학습 기록을 불러오지 못했습니다.")}</p>
        <button type="button" onClick={() => refetch()}>다시 시도</button>
      </div>
    );
  }

  const trendData = data.scoreTrend.map((point) => ({
    label: point.label,
    score: point.score,
  }));
  const examHistory = data.examHistory.map((attempt) => ({
    id: attempt.id,
    examTitle: attempt.examTitle,
    attemptTitle: attempt.attemptTitle,
    date: dateFormatter.format(new Date(attempt.submittedAt)),
    totalScore: attempt.score,
    result: attempt.score >= 60
      ? "ABOVE_AVERAGE" as const
      : attempt.score < 40 ? "CUTOFF_RISK" as const : "BELOW_AVERAGE" as const,
    subjects: attempt.subjectScores.map((subject) => ({
      name: subject.subject,
      score: subject.score,
      isFailed: subject.score < 40,
    })),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        <h1 className={styles.title}>학습관리 대시보드</h1>
        <p className={styles.description}>
          실제 응시 기록을 기준으로 점수 추이와 합격 기준 충족 여부를 진단합니다.
        </p>
      </div>

      <LearningSummaryCards
        elapsedExamMinutes={data.summary.elapsedExamMinutes}
        examCount={data.summary.completedAttemptCount}
        averageScore={data.summary.averageScore}
        wrongAnswerCount={data.summary.wrongAnswerCount}
      />

      <div className={styles.metrics}>
        <div className={styles.mainColumn}>
          <ScoreTrendChart trendData={trendData} />
        </div>

        <div className={styles.sideColumn}>
          <PassingRuleCard assessment={data.assessment} />
          <SubjectScoreList subjectScores={data.assessment.subjectScores} />
        </div>

        <div className={styles.sideColumn}>
          <WeakTopicList weakTopics={data.weakTopics} />
        </div>

        <div className={styles.mainColumn}>
          <ExamHistoryList history={examHistory} />
        </div>
      </div>
    </div>
  );
}
