"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useExamData } from "../hooks/useExamData";
import { useVoiceReminders } from "../hooks/useVoiceReminder";
import type { VoiceReminderSetting } from "../services/examRegistrationService";
import { ExamNotice } from "./ExamNotice";
import { OMRGrid } from "./OMR";
import { SubmitDialog } from "./SubmitDialog";
import type { SubmittedExamSession } from "../types/exam";
import { CheckCircle2, Clock3, X } from "lucide-react";
import styles from "./ExamSolvingModal.module.css";

interface ExamSolvingModalProps {
  registrationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  endReminders?: VoiceReminderSetting[];
}

export function ExamSolvingModal({
  registrationId,
  isOpen,
  onClose,
  onSubmitted,
  endReminders,
}: ExamSolvingModalProps) {
  const {
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
    showToast,
    toastMessage,
  } = useExamData(isOpen ? registrationId : undefined);

  useVoiceReminders({
    notificationKey: isOpen ? `${registrationId}:end` : null,
    reminders: endReminders ?? [],
    remainingSeconds,
    active: examInfo !== null && !isSubmitted,
  });

  // 제출 다이얼로그 모달 노출 상태
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // 중단 확인 다이얼로그 노출 상태 (시험 도중 닫을 때)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<SubmittedExamSession | null>(null);
  const autoSubmissionAttemptedRef = useRef<string | null>(null);
  const submissionRequestRef = useRef(false);

  const completeSubmission = useCallback(async () => {
    if (submissionRequestRef.current) return;
    submissionRequestRef.current = true;
    try {
      const result = await submitExam();
      setSubmittedResult(result);
    } catch {
      // 오류 내용은 훅의 토스트로 표시한다.
      submissionRequestRef.current = false;
    }
  }, [submitExam]);

  // 정답지 제출하기 클릭 시
  const handleSubmitClick = () => {
    if (isSubmitted || remainingSeconds <= 0) return;
    setIsDialogOpen(true);
  };

  // 모달 확인 완료 시 수동 제출도 자동 만료와 같은 제출 함수를 사용한다.
  const handleConfirmSubmit = () => {
    setIsDialogOpen(false);
    void completeSubmission();
  };

  useEffect(() => {
    if (remainingSeconds > 0 || isLoading || error || !examInfo || isSubmitted || isSubmitting) return;
    if (autoSubmissionAttemptedRef.current === registrationId) return;
    autoSubmissionAttemptedRef.current = registrationId;
    void completeSubmission();
  }, [
    completeSubmission,
    error,
    examInfo,
    isLoading,
    isSubmitted,
    isSubmitting,
    registrationId,
    remainingSeconds,
  ]);

  const closeSubmittedResult = () => {
    setSubmittedResult(null);
    onSubmitted?.();
    onClose();
  };

  // 나가기 버튼 클릭 시
  const handleCloseClick = () => {
    if (markedCount > 0 && !isSubmitted) {
      setIsCloseConfirmOpen(true);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={styles.fullScreenState}>시험 세션을 준비하는 중입니다.</div>
    );
  }

  if (error || !examInfo) {
    return (
      <div className={styles.fullScreenState}>
        <p className={styles.errorText}>{error ?? "시험 정보를 불러올 수 없습니다."}</p>
        <button type="button" onClick={onClose} className={styles.stateButton}>
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      {/* 상단바 (Sticky Header) */}
      <header className={styles.stickyHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerStatusBadge}>
            실시간 풀이 중
          </span>
          <h2 className={styles.headerTitleText}>
            {examInfo.title}
          </h2>
        </div>
        
        <div className={styles.headerRight}>
          {/* 제출 진행 상황 및 자동 저장 상태 */}
          <div className={styles.progressWrapper}>
            <span className={styles.progressCountText}>
              제출 {markedCount} / {examInfo.totalQuestions}
            </span>
            <div className={styles.saveStatusWrapper} data-status={saveStatus}>
              <div className={styles.saveStatusIndicator} />
              <span>
                {saveStatus === "saved" ? "자동 저장됨" : saveStatus === "error" ? "저장 실패" : "저장 중..."}
              </span>
            </div>
          </div>

          {/* 타이머 */}
          <div className={styles.timerWrapper}>
            <span className={styles.timerLabel}>남은 시간</span>
            <span className={styles.timerText} data-warning={remainingSeconds <= 600}>
              {Math.floor(remainingSeconds / 60).toString().padStart(2, "0")}:
              {(remainingSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmitClick}
            disabled={isSubmitted || isSubmitting || remainingSeconds <= 0}
            className={styles.btnSubmit}
          >
            {isSubmitting ? "제출 중..." : remainingSeconds <= 0 ? "시험 종료" : "답안 제출"}
          </button>

          <button
            onClick={handleCloseClick}
            className={styles.btnClose}
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <div className={styles.bodyContainer}>
        
        {/* 설명 및 타이틀 */}
        <div className={styles.descWrapper}>
          <p className={styles.descText}>
            본인의 기출문제집을 풀며 아래 OMR 답안지에 정답을 입력하세요. 실시간 타이머 및 자동 저장 기능이 적용되어 있습니다.
          </p>
        </div>

        {/* 반응형 2단 레이아웃 분기 */}
        <div className={styles.layoutGrid}>
          
          {/* 좌측 영역 (데스크톱: 4열 / 모바일: 전체) */}
          <div className={styles.leftColumn}>
            <ExamNotice />
          </div>

          {/* 우측 영역 (데스크톱: 8열 / 모바일: 전체) */}
          <div className={styles.rightColumn}>
            <OMRGrid
              totalQuestions={examInfo.totalQuestions}
              answers={answers}
              onSelectAnswer={selectAnswer}
            />
          </div>

        </div>
      </div>

      {/* 제출 확인 모달 다이얼로그 */}
      <SubmitDialog
        isOpen={isDialogOpen && remainingSeconds > 0}
        unansweredCount={unansweredCount}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {submittedResult ? (
        <div className={styles.resultBackdrop}>
          <section
            className={styles.resultCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-result-title"
          >
            <div
              className={styles.resultIcon}
              data-pending={submittedResult.gradingStatus === "pending"}
            >
              {submittedResult.gradingStatus === "pending" ? <Clock3 /> : <CheckCircle2 />}
            </div>
            <div className={styles.resultHeading}>
              <span>답안 제출 완료</span>
              <h3 id="submission-result-title">
                {submittedResult.gradingStatus === "pending"
                  ? "정상적으로 제출되었습니다"
                  : "채점이 완료되었습니다"}
              </h3>
              <p>
                {submittedResult.gradingStatus === "pending"
                  ? "정답이 등록되면 점수가 자동으로 반영됩니다."
                  : "수고하셨습니다. 신청 목록에서 점수를 다시 확인할 수 있습니다."}
              </p>
            </div>
            {submittedResult.gradingStatus === "graded" ? (
              <>
                <div className={styles.resultScore}>
                  <span>최종 점수</span>
                  <strong>{submittedResult.score}점</strong>
                </div>
                <div className={styles.resultStats}>
                  <div><span>정답</span><strong>{submittedResult.correctCount}개</strong></div>
                  <div><span>오답</span><strong>{submittedResult.wrongCount}개</strong></div>
                  <div><span>전체</span><strong>{submittedResult.totalQuestions}개</strong></div>
                </div>
              </>
            ) : (
              <div className={styles.pendingResult}>
                <Clock3 />
                <div><span>현재 상태</span><strong>채점 대기</strong></div>
              </div>
            )}
            <button type="button" className={styles.resultConfirm} onClick={closeSubmittedResult}>
              확인
            </button>
          </section>
        </div>
      ) : null}

      {/* 중간 이탈 경고 모달 */}
      {isCloseConfirmOpen && (
        <div className={styles.confirmBackdrop}>
          <div className={styles.confirmCard}>
            <div className={styles.confirmFlex}>
              <div className={styles.confirmIconWrapper}>
                <span>⚠️</span>
              </div>
              <div>
                <h3 className={styles.confirmTitle}>
                  시험 풀이를 중단하시겠습니까?
                </h3>
                <p className={styles.confirmDesc}>
                  작성 중인 답안은 임시 저장되지만, 타이머는 초기화될 수 있습니다.
                </p>
              </div>
            </div>
            <div className={styles.confirmGrid}>
              <button
                type="button"
                onClick={() => setIsCloseConfirmOpen(false)}
                className={styles.btnConfirmKeep}
              >
                계속 풀기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCloseConfirmOpen(false);
                  onClose();
                }}
                className={styles.btnConfirmLeave}
              >
                중단하고 나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 저장 실패 시 안내하는 토스트 메시지 팝업 */}
      {showToast && (
        <div className={styles.toastWrapper}>
          <span>⚠️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
