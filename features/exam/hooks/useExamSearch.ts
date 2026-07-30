"use client";

import { useMemo, useState } from "react";
import { queryErrorMessage } from "@/features/store/api/queryError";
import { useGetExamsQuery } from "../api/examApi";
import type { ExamSearchParams } from "../services/examService";

export function useExamSearch() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRound, setSelectedRound] = useState("all");
  const [activeParams, setActiveParams] = useState<ExamSearchParams>({
    type: "all",
    subject: "all",
    round: "all",
  });
  const {
    data: exams = [],
    isLoading,
    isFetching,
    error: queryError,
  } = useGetExamsQuery(activeParams, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 과목 목록은 서버가 준 시험 데이터에서 뽑는다.
  // 과목 구성(시험 슬롯)이 바뀌어도 화면을 고칠 필요가 없다.
  const subjectOptions = useMemo(() => {
    return Array.from(new Set(exams.map((exam) => exam.subject))).sort();
  }, [exams]);

  const roundOptions = useMemo(() => {
    const unique = new Map<string, { round: number; year: number }>();
    exams.forEach((exam) => unique.set(`${exam.year}-${exam.round}`, {
      round: exam.round,
      year: exam.year,
    }));
    return Array.from(unique.values()).sort((left, right) =>
      right.round - left.round || right.year - left.year);
  }, [exams]);

  const handleSearch = () => {
    setActiveParams({
      type: selectedType,
      subject: selectedSubject,
      round: selectedRound,
    });
  };

  const handleReset = () => {
    setSelectedType("all");
    setSelectedSubject("all");
    setSelectedRound("all");
    setActiveParams({ type: "all", subject: "all", round: "all" });
  };

  return {
    selectedType,
    setSelectedType,
    selectedSubject,
    setSelectedSubject,
    selectedRound,
    setSelectedRound,
    subjectOptions,
    roundOptions,
    filteredExams: exams,
    isLoading: isLoading || isFetching,
    error: queryError
      ? queryErrorMessage(queryError, "시험 목록을 불러올 수 없습니다.")
      : null,
    handleSearch,
    handleReset,
  };
}
