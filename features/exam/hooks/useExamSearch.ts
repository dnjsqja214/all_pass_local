import { useState, useMemo } from "react";
import { ExamListItem } from "../types/exam";

export function useExamSearch(initialExams: ExamListItem[]) {
  const [examNameInput, setExamNameInput] = useState("");
  const [appliedExamName, setAppliedExamName] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedRound, setSelectedRound] = useState("all");

  const handleSearch = () => {
    setAppliedExamName(examNameInput.trim());
  };

  const handleReset = () => {
    setExamNameInput("");
    setAppliedExamName("");
    setSelectedYear("all");
    setSelectedRound("all");
  };

  const filteredExams = useMemo(() => {
    return initialExams.filter((exam) => {
      // 1. 시험명 검색 (공백 제거 후 부분 일치, 대소문자 무관)
      if (appliedExamName) {
        const cleanedTitle = exam.title.replace(/\s+/g, "").toLowerCase();
        const cleanedKeyword = appliedExamName.replace(/\s+/g, "").toLowerCase();
        if (!cleanedTitle.includes(cleanedKeyword)) {
          return false;
        }
      }

      // 2. 연도 검색
      if (selectedYear !== "all") {
        if (exam.year !== parseInt(selectedYear)) {
          return false;
        }
      }

      // 3. 회차 검색
      if (selectedRound !== "all") {
        if (exam.round !== parseInt(selectedRound)) {
          return false;
        }
      }

      return true;
    });
  }, [initialExams, appliedExamName, selectedYear, selectedRound]);

  return {
    examNameInput,
    setExamNameInput,
    appliedExamName,
    selectedYear,
    setSelectedYear,
    selectedRound,
    setSelectedRound,
    filteredExams,
    handleSearch,
    handleReset,
  };
}
