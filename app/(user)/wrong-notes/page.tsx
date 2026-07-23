"use client";

import React, { useState, useEffect } from "react";
import { useDashboardData } from "../../../features/dashboard/hooks/useDashboardData";
import { examService } from "../../../features/exam/services/examService";
import { ExamListItem } from "../../../features/exam/types/exam";
import { WrongExamSelection } from "./_components/WrongExamSelection/WrongExamSelection";
import { WrongNotesDetail } from "./_components/WrongNotesDetail/WrongNotesDetail";
import styles from "./page.module.css";

const MOCK_COMPLETED_EXAMS: ExamListItem[] = [
  {
    id: "mock-exam-35-tax",
    title: "35회 부동산세법 기출문제 (연습)",
    year: 2026,
    round: 35,
    subject: "부동산세법",
    totalQuestions: 40,
    durationMinutes: 50,
    status: "completed",
    completedAt: "2026-07-15T12:00:00Z",
    score: 85,
  },
  {
    id: "mock-exam-35-public",
    title: "35회 부동산공법 기출문제 (실전)",
    year: 2026,
    round: 35,
    subject: "부동산공법",
    totalQuestions: 40,
    durationMinutes: 50,
    status: "completed",
    completedAt: "2026-07-10T14:30:00Z",
    score: 58,
  },
  {
    id: "mock-exam-34-public",
    title: "34회 부동산공법 기출문제 (연습)",
    year: 2025,
    round: 34,
    subject: "부동산공법",
    totalQuestions: 40,
    durationMinutes: 50,
    status: "completed",
    completedAt: "2026-07-05T10:00:00Z",
    score: 72,
  },
  {
    id: "mock-exam-35-broker",
    title: "35회 중개사법령 및 실무 기출",
    year: 2026,
    round: 35,
    subject: "중개·물권",
    totalQuestions: 40,
    durationMinutes: 50,
    status: "completed",
    completedAt: "2026-07-02T16:00:00Z",
    score: 65,
  },
];

export default function WrongNotes() {
  const { wrongNotes } = useDashboardData("incorrect");

  // 풀어본 시험 리스트 상태
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 선택된 시험
  const [selectedExam, setSelectedExam] = useState<ExamListItem | null>(null);

  // 오답 카드별 원인 분류 로컬 상태 관리 (초기값 mock data로 바인딩)
  const [cardCauses, setCardCauses] = useState<Record<string, "unknown" | "confused" | "mistake">>(
    wrongNotes.reduce((acc, note) => {
      acc[note.id] = note.cause;
      return acc;
    }, {} as Record<string, "unknown" | "confused" | "mistake">)
  );

  // 필터 조건 상태
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedRound, setSelectedRound] = useState<string>("all");

  // 검색 시점에 적용할 필터 상태 (검색하기 버튼 클릭 시 반영)
  const [appliedSubject, setAppliedSubject] = useState<string>("all");
  const [appliedRound, setAppliedRound] = useState<string>("all");

  // 시험 목록 조회
  useEffect(() => {
    let active = true;
    const fetchExams = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let completedApiExams: ExamListItem[] = [];
        try {
          const res = await examService.findExams({ type: "all", subject: "all", round: "all" });
          completedApiExams = res.filter((exam) => exam.status === "completed");
        } catch (apiErr) {
          console.warn("Backend fetch failed, using mock exams only:", apiErr);
        }

        if (!active) return;

        // API 결과와 더미 리스트를 병합하여 중복 제거
        const combined = [...MOCK_COMPLETED_EXAMS];
        completedApiExams.forEach((apiExam) => {
          if (!combined.some((item) => item.id === apiExam.id)) {
            combined.push(apiExam);
          }
        });

        setExams(combined);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "시험 목록을 불러올 수 없습니다.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchExams();
    return () => {
      active = false;
    };
  }, []);

  // 개별 카드의 오답 원인 변경 핸란러
  const handleCauseChange = (cardId: string, newCause: "unknown" | "confused" | "mistake") => {
    setCardCauses((prev) => ({
      ...prev,
      [cardId]: newCause,
    }));
  };

  const handleSearch = () => {
    setAppliedSubject(selectedSubject);
    setAppliedRound(selectedRound);
  };

  const handleReset = () => {
    setSelectedSubject("all");
    setSelectedRound("all");
    setAppliedSubject("all");
    setAppliedRound("all");
  };

  // 필터링 적용된 완료 시험 데이터
  const filteredExams = exams.filter((exam) => {
    // 1. 과목 필터링
    if (appliedSubject !== "all") {
      const normalizedApplied =
        appliedSubject === "부동산 공법"
          ? "부동산공법"
          : appliedSubject === "부동산공시법령 부동산세법"
            ? "부동산세법"
            : appliedSubject;
      if (exam.subject !== normalizedApplied) return false;
    }

    // 2. 회차 필터링
    if (appliedRound !== "all") {
      if (exam.round !== Number(appliedRound)) return false;
    }

    return true;
  });

  // 선택한 시험의 과목에 맵핑되는 오답 문항 목록 필터링
  const examNotes = wrongNotes.filter((note) => {
    if (!selectedExam) return false;
    return note.subject === selectedExam.subject;
  });

  return (
    <div className={styles.page}>
      {/* 상태에 따른 화면 렌더링 */}
      {!selectedExam ? (
        <WrongExamSelection
          filteredExams={filteredExams}
          isLoading={isLoading}
          error={error}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
          handleSearch={handleSearch}
          handleReset={handleReset}
          onSelectExam={(exam: ExamListItem) => {
            setSelectedExam(exam);
          }}
        />
      ) : (
        <WrongNotesDetail
          selectedExam={selectedExam}
          examNotes={examNotes}
          onBack={() => setSelectedExam(null)}
          cardCauses={cardCauses}
          onCauseChange={handleCauseChange}
        />
      )}
    </div>
  );
}
