"use client";

import { useEffect, useRef, useState } from "react";
import { examService } from "../services/examService";
import { AnswerMark, SubmittedExamSession } from "../types/exam";

export interface Exam {
  id: string;
  title: string;
  totalQuestions: number;
  duration: number;
  startedAt: string;
}

export type SaveStatus = "saved" | "saving" | "error";

function toAnswerMarks(answers: Record<number, number>): AnswerMark[] {
  return Object.entries(answers)
    .map(([questionNumber, selectedChoice]) => ({
      questionNumber: Number(questionNumber),
      selectedChoice,
    }))
    .sort((left, right) => left.questionNumber - right.questionNumber);
}

export function useExamData(examId?: string) {
  const [examInfo, setExamInfo] = useState<Exam | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(examId !== undefined);
  const [error, setError] = useState<string | null>(examId ? null : "시험을 먼저 선택해 주세요.");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [submissionResult, setSubmissionResult] = useState<SubmittedExamSession | null>(null);

  const answersRef = useRef<Record<number, number>>({});
  const remainingSecondsRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const saveVersionRef = useRef(0);
  const mountedRef = useRef(true);

  const showErrorToast = (message: string) => {
    if (!mountedRef.current) return;
    setToastMessage(message);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    mountedRef.current = true;
    if (!examId) {
      return () => {
        mountedRef.current = false;
      };
    }

    const controller = new AbortController();
    const initialize = async () => {
      try {
        await Promise.resolve();
        if (controller.signal.aborted) return;
        setIsLoading(true);
        setError(null);
        setIsSubmitted(false);
        setSubmissionResult(null);
        setSessionId(null);
        setAnswers({});
        answersRef.current = {};
        const detail = await examService.getExam(examId, controller.signal);
        const started = await examService.startSession(examId, controller.signal);
        if (controller.signal.aborted) return;

        const restoredAnswers = Object.fromEntries(detail.savedAnswers.map((answer) => [
          answer.questionNumber,
          answer.selectedChoice,
        ]));
        answersRef.current = restoredAnswers;
        remainingSecondsRef.current = started.remainingSeconds;
        setAnswers(restoredAnswers);
        setSessionId(started.sessionId);
        setRemainingSeconds(started.remainingSeconds);
        setExamInfo({
          id: detail.id,
          title: detail.title,
          totalQuestions: detail.totalQuestions,
          duration: detail.durationMinutes,
          startedAt: started.startedAt,
        });
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "시험 정보를 불러올 수 없습니다.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void initialize();
    return () => {
      mountedRef.current = false;
      controller.abort();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [examId]);

  useEffect(() => {
    if (!sessionId || isSubmitted) return;
    const timer = setInterval(() => {
      setRemainingSeconds((previous) => {
        const next = Math.max(0, previous - 1);
        remainingSecondsRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, sessionId]);

  const queueSave = (nextAnswers: Record<number, number>) => {
    if (!sessionId) return;
    const version = ++saveVersionRef.current;
    const answerMarks = toAnswerMarks(nextAnswers);
    setSaveStatus("saving");
    saveChainRef.current = saveChainRef.current
      .catch(() => undefined)
      .then(async () => {
        await examService.tempSave(sessionId, answerMarks, remainingSecondsRef.current);
        if (mountedRef.current && version === saveVersionRef.current) setSaveStatus("saved");
      })
      .catch((reason: unknown) => {
        if (mountedRef.current && version === saveVersionRef.current) {
          setSaveStatus("error");
          showErrorToast(reason instanceof Error ? reason.message : "답안을 자동 저장하지 못했습니다.");
        }
      });
  };

  const selectAnswer = (questionNumber: number, choice: number) => {
    if (isSubmitted || !sessionId || remainingSecondsRef.current <= 0) return;
    const nextAnswers = { ...answersRef.current };
    if (nextAnswers[questionNumber] === choice) {
      delete nextAnswers[questionNumber];
    } else {
      nextAnswers[questionNumber] = choice;
    }
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setSaveStatus("saving");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => queueSave(nextAnswers), 500);
  };

  const submitExam = async (): Promise<SubmittedExamSession> => {
    if (!sessionId) throw new Error("시험 세션이 준비되지 않았습니다.");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setIsSubmitting(true);
    try {
      await saveChainRef.current.catch(() => undefined);
      const result = await examService.submit(sessionId, toAnswerMarks(answersRef.current));
      if (mountedRef.current) {
        setSubmissionResult(result);
        setIsSubmitted(true);
        setSaveStatus("saved");
      }
      return result;
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "시험을 제출하지 못했습니다.";
      showErrorToast(message);
      throw reason;
    } finally {
      if (mountedRef.current) setIsSubmitting(false);
    }
  };

  const markedCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, (examInfo?.totalQuestions ?? 0) - markedCount);

  return {
    examInfo,
    answers,
    remainingSeconds,
    saveStatus,
    isSubmitted,
    isSubmitting,
    isLoading,
    error,
    markedCount,
    unansweredCount,
    selectAnswer,
    submitExam,
    submissionResult,
    showToast,
    toastMessage,
  };
}
