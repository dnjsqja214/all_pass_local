"use client";

import React, { useRef, useEffect } from "react";
import { useExamSearch } from "./hooks/useExamSearch";
import { ExamListItem } from "./types/exam";
import { ExamSearchForm } from "./components/ExamSearchForm";
import { ExamCardList } from "./components/ExamCardList";
import { EmptyExamResult } from "./components/EmptyExamResult";
import { X } from "lucide-react";
import styles from "./ExamSelectionPage.module.css";

interface ExamSelectionPageProps {
  onSelectExam?: (exam: ExamListItem) => void;
  isModal?: boolean;
  onClose?: () => void;
  initialExams?: ExamListItem[];
}

export function ExamSelectionPage({
  onSelectExam,
  isModal = false,
  onClose,
  initialExams,
}: ExamSelectionPageProps) {
  const {
    selectedType,
    setSelectedType,
    selectedSubject,
    setSelectedSubject,
    selectedRound,
    setSelectedRound,
    filteredExams,
    isLoading,
    error,
    handleSearch,
    handleReset,
    subjectOptions,
  } = useExamSearch(initialExams);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 검색 조건(유형, 과목, 회차) 변경 시 스크롤을 맨 위로 리셋
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedType, selectedSubject, selectedRound]);

  const content = (
    <div className={styles.page} data-modal={isModal}>
      {/* 상단 타이틀 영역 */}
      <div className={styles.header}>
        <h1 className={styles.title}>시험 선택</h1>
        {isModal && onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        )}
      </div>

      {/* 검색 필터 */}
      <div className={styles.filter}>
        <ExamSearchForm
          type={selectedType}
          setType={setSelectedType}
          subject={selectedSubject}
          setSubject={setSelectedSubject}
          subjectOptions={subjectOptions}
          round={selectedRound}
          setRound={setSelectedRound}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* 결과 건수 */}
      <div className={styles.resultCount}>
        검색 결과 <span className={styles.countValue}>{filteredExams.length}</span>개
      </div>

      {/* 시험 목록 또는 빈 화면 (스크롤 가능하도록 배치) */}
      {isLoading ? (
        <div className={styles.state}>시험 목록을 불러오는 중입니다.</div>
      ) : error ? (
        <div className={styles.state}>
          <p className={styles.errorText}>{error}</p>
          <button type="button" onClick={handleSearch} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      ) : filteredExams.length > 0 ? (
        <ExamCardList exams={filteredExams} scrollRef={scrollRef} onSelectExam={onSelectExam} />
      ) : (
        <div className={styles.emptyScroller}>
          <EmptyExamResult onReset={handleReset} />
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalCard}>{content}</div>
      </div>
    );
  }

  return content;
}
