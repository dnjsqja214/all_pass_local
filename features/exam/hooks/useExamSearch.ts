import { useState, useMemo } from "react";
import { ExamListItem } from "../types/exam";

export function useExamSearch(initialExams: ExamListItem[]) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRound, setSelectedRound] = useState("all");

  const handleSearch = () => {
    // 검색 단추 클릭 시 동작 (실시간 필터링되므로 현재는 예비용)
  };

  const handleReset = () => {
    setSelectedType("all");
    setSelectedSubject("all");
    setSelectedRound("all");
  };

  const filteredExams = useMemo(() => {
    return initialExams.filter((exam) => {
      // 1. 유형 필터 ("all" | "pre" | "mock")
      if (selectedType !== "all") {
        if (selectedType === "pre") {
          // 기출문제: 제목에 "모의고사"가 없는 시험
          if (exam.title.includes("모의고사")) return false;
        } else if (selectedType === "mock") {
          // 모의고사: 제목에 "모의고사"가 포함된 시험
          if (!exam.title.includes("모의고사")) return false;
        }
      }

      // 2. 과목 필터
      if (selectedSubject !== "all") {
        const subjectMapping: Record<string, string> = {
          "공인중개사법령 및 실무": "중개사법령 및 실무",
          "부동산 공법": "부동산공법",
          "부동산공시법령 부동산세법": "부동산세법",
        };
        const targetSubject = subjectMapping[selectedSubject] || selectedSubject;
        if (exam.subject !== targetSubject) {
          return false;
        }
      }

      // 3. 회차 필터
      if (selectedRound !== "all") {
        if (exam.round !== parseInt(selectedRound)) {
          return false;
        }
      }

      return true;
    });
  }, [initialExams, selectedType, selectedSubject, selectedRound]);

  return {
    selectedType,
    setSelectedType,
    selectedSubject,
    setSelectedSubject,
    selectedRound,
    setSelectedRound,
    filteredExams,
    handleSearch,
    handleReset,
  };
}
