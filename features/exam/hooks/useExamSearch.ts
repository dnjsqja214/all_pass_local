"use client";

import { useMemo, useState } from "react";
import { queryErrorMessage } from "@/features/store/api/queryError";
import { useGetExamsQuery } from "../api/examApi";
import type { ExamSearchParams } from "../services/examService";
import { ExamListItem } from "../types/exam";

export function useExamSearch(initialExams?: ExamListItem[]) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRound, setSelectedRound] = useState("all");
  const [activeParams, setActiveParams] = useState<ExamSearchParams>({
    type: "all",
    subject: "all",
    round: "all",
  });
  const {
    data: apiExams = [],
    isLoading,
    isFetching,
    error: queryError,
  } = useGetExamsQuery(activeParams, {
    skip: initialExams !== undefined,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const filteredStaticExams = useMemo(() => {
    if (!initialExams) return [];
    return initialExams.filter((exam) => {
      if (selectedType === "pre" && exam.title.includes("모의고사")) return false;
      if (selectedType === "mock" && !exam.title.includes("모의고사")) return false;
      if (selectedSubject !== "all" && exam.subject !== selectedSubject) return false;
      return selectedRound === "all" || exam.round === Number(selectedRound);
    });
  }, [initialExams, selectedRound, selectedSubject, selectedType]);

  // 과목 목록은 서버가 준 시험 데이터에서 뽑는다.
  // 과목 구성(시험 슬롯)이 바뀌어도 화면을 고칠 필요가 없다.
  const subjectOptions = useMemo(() => {
    const source = initialExams ?? apiExams;
    return Array.from(new Set(source.map((exam) => exam.subject))).sort();
  }, [initialExams, apiExams]);

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
    filteredExams: initialExams ? filteredStaticExams : apiExams,
    isLoading: initialExams === undefined && (isLoading || isFetching),
    error: queryError
      ? queryErrorMessage(queryError, "시험 목록을 불러올 수 없습니다.")
      : null,
    handleSearch,
    handleReset,
  };
}
