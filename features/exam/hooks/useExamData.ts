"use client";

import { useState, useEffect, useRef } from "react";
import { mockExams } from "../data/mockExams";

export interface Exam {
  id: string;
  title: string;
  totalQuestions: number;
  duration: number; // in minutes
  startedAt: string;
  remainingSeconds: number;
}

export interface Answer {
  questionNumber: number;
  selectedChoice: number;
}

export interface Submission {
  examId: string;
  answers: Answer[];
  submittedAt: string;
}

export function useExamData(examId?: string) {
  // OMR 답변 상태 (key: 문항번호 1~40, value: 선택한 답 1~5)
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
    6: 1, 7: 2, 8: 3, 9: 4, 10: 5,
    11: 1, 12: 2, 13: 3, 14: 4, 15: 5,
    16: 1, 17: 2, 18: 3, 19: 4, 20: 5,
    21: 1, 22: 2, 23: 3, 24: 4,
    // 초기 24문항 마킹 상태 모킹
  });

  // 전달받은 examId로 시험 정보 매핑 (없으면 기본값)
  const selectedExam = mockExams.find((e) => e.id === examId);

  const examInfo: Exam = {
    id: selectedExam?.id || "exam-live-1",
    title: selectedExam?.title || "35회 · 부동산공법",
    totalQuestions: selectedExam?.totalQuestions || 40,
    duration: selectedExam?.durationMinutes || 40,
    startedAt: new Date().toISOString(),
    remainingSeconds: (selectedExam?.durationMinutes || 40) * 60, // 초 단위로 변환
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(examInfo.remainingSeconds);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // 디바운스용 타이머 참조
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1초 단위 타이머 카운트다운
  useEffect(() => {
    if (isSubmitted || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // 시간 초과 시 자동 제출 등 처리 가능
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, isSubmitted]);

  // 답변 선택 및 자동 저장 (500ms 디바운스)
  const selectAnswer = (questionNumber: number, choice: number) => {
    if (isSubmitted) return;

    setAnswers((prev) => {
      const nextAnswers = { ...prev };
      // 만약 이미 선택된 답을 다시 클릭했다면 해제 가능
      if (nextAnswers[questionNumber] === choice) {
        delete nextAnswers[questionNumber];
      } else {
        nextAnswers[questionNumber] = choice;
      }
      return nextAnswers;
    });

    // 자동 저장 상태 변경
    setSaveStatus("saving");

    // 이전 디바운스 타이머 클리어
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 500ms 디바운스 적용 후 저장 완료 처리
    debounceTimerRef.current = setTimeout(() => {
      // 10% 확률로 저장 실패 에러 시뮬레이션 (Toast 테스트용)
      const isSuccess = Math.random() > 0.05;
      if (isSuccess) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("saved"); // 실패하더라도 UI 흐름 안정성을 위해 저장 완료 표시
        setToastMessage("답안 자동 저장 도중 일시적 통신 지연이 발생했습니다.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }, 500);
  };

  // 최종 제출 처리
  const submitExam = () => {
    setIsSubmitted(true);
    // 실제 전송 구조
    const submission: Submission = {
      examId: examInfo.id,
      answers: Object.entries(answers).map(([qNum, choice]) => ({
        questionNumber: parseInt(qNum),
        selectedChoice: choice,
      })),
      submittedAt: new Date().toISOString(),
    };
    console.log("Submitted OMR Answers:", submission);
  };

  // 문항 마킹 수 계산
  const markedCount = Object.keys(answers).length;
  const unansweredCount = examInfo.totalQuestions - markedCount;

  return {
    examInfo,
    answers,
    remainingSeconds,
    saveStatus,
    isSubmitted,
    markedCount,
    unansweredCount,
    selectAnswer,
    submitExam,
    showToast,
    toastMessage,
  };
}
