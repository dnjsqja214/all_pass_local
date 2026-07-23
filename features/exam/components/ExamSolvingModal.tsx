"use client";

import React, { useState } from "react";
import { useExamData } from "../hooks/useExamData";
import { ExamNotice } from "./ExamNotice";
import { OMRGrid } from "./OMRGrid";
import { SubmitDialog } from "./SubmitDialog";
import { X } from "lucide-react";
import styles from "./ExamSolvingModal.module.css";

interface ExamSolvingModalProps {
  registrationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ExamSolvingModal({
  registrationId,
  isOpen,
  onClose,
  onSubmitted,
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

  // 제출 다이얼로그 모달 노출 상태
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // 중단 확인 다이얼로그 노출 상태 (시험 도중 닫을 때)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState<boolean>(false);

  // 정답지 제출하기 클릭 시
  const handleSubmitClick = () => {
    if (isSubmitted) return;
    setIsDialogOpen(true);
  };

  // 모달 확인 완료 시
  const handleConfirmSubmit = async () => {
    setIsDialogOpen(false);
    try {
      const result = await submitExam();
      alert(result.gradingStatus === "pending"
        ? "정답지가 정상적으로 제출되었습니다. 정답 등록 후 채점됩니다."
        : `정답지가 정상적으로 제출되었습니다. 점수: ${result.score}점`);
      onSubmitted?.();
      onClose();
    } catch {
      // 오류 내용은 훅의 토스트로 표시한다.
    }
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
            disabled={isSubmitted || isSubmitting}
            className={styles.btnSubmit}
          >
            {isSubmitting ? "제출 중..." : "답안 제출"}
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
        isOpen={isDialogOpen}
        unansweredCount={unansweredCount}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* 중간 이탈 경고 모달 */}
      {isCloseConfirmOpen && (
        <div className={`${styles.confirmBackdrop} animate-in fade-in duration-200`}>
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
