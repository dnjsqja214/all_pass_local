"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { examService, ExamSearchParams } from "../services/examService";
import { ExamListItem } from "../types/exam";

const SUBJECT_MAPPING: Record<string, string> = {
  "공인중개사법령 및 실무": "중개사법령 및 실무",
  "부동산 공법": "부동산공법",
  "부동산공시법령 부동산세법": "부동산세법",
};

function normalizeSubject(subject: string): string {
  return SUBJECT_MAPPING[subject] ?? subject;
}

export function useExamSearch(initialExams?: ExamListItem[]) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRound, setSelectedRound] = useState("all");
  const [apiExams, setApiExams] = useState<ExamListItem[]>([]);
  const [isLoading, setIsLoading] = useState(initialExams === undefined);
  const [error, setError] = useState<string | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  const loadExams = useCallback(async (params: ExamSearchParams) => {
    if (initialExams) return;
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    await Promise.resolve();
    if (controller.signal.aborted) return;
    setIsLoading(true);
    setError(null);
    try {
      const exams = await examService.findExams({
        ...params,
        subject: normalizeSubject(params.subject),
      }, controller.signal);
      if (!controller.signal.aborted) setApiExams(exams);
    } catch (reason: unknown) {
      if (!controller.signal.aborted) {
        setError(reason instanceof Error ? reason.message : "시험 목록을 불러올 수 없습니다.");
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [initialExams]);

  useEffect(() => {
    if (initialExams) return;
    const controller = new AbortController();
    requestControllerRef.current = controller;
    examService.findExams({ type: "all", subject: "all", round: "all" }, controller.signal)
      .then((exams) => {
        if (!controller.signal.aborted) setApiExams(exams);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "시험 목록을 불러올 수 없습니다.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [initialExams]);

  const filteredStaticExams = useMemo(() => {
    if (!initialExams) return [];
    return initialExams.filter((exam) => {
      if (selectedType === "pre" && exam.title.includes("모의고사")) return false;
      if (selectedType === "mock" && !exam.title.includes("모의고사")) return false;
      if (selectedSubject !== "all" && exam.subject !== normalizeSubject(selectedSubject)) return false;
      return selectedRound === "all" || exam.round === Number(selectedRound);
    });
  }, [initialExams, selectedRound, selectedSubject, selectedType]);

  const handleSearch = () => {
    void loadExams({ type: selectedType, subject: selectedSubject, round: selectedRound });
  };

  const handleReset = () => {
    setSelectedType("all");
    setSelectedSubject("all");
    setSelectedRound("all");
    void loadExams({ type: "all", subject: "all", round: "all" });
  };

  return {
    selectedType,
    setSelectedType,
    selectedSubject,
    setSelectedSubject,
    selectedRound,
    setSelectedRound,
    filteredExams: initialExams ? filteredStaticExams : apiExams,
    isLoading,
    error,
    handleSearch,
    handleReset,
  };
}
