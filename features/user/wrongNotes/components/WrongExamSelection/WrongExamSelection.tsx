"use client";

import React from "react";
import { RotateCcw, ChevronDown, Calendar, HelpCircle, Clock } from "lucide-react";
import { ExamListItem } from "../../../exam/types/exam";
import styles from "./WrongExamSelection.module.css";

interface WrongExamSelectionProps {
  filteredExams: ExamListItem[];
  isLoading: boolean;
  error: string | null;
  selectedSubject: string;
  setSelectedSubject: (val: string) => void;
  selectedRound: string;
  setSelectedRound: (val: string) => void;
  handleSearch: () => void;
  handleReset: () => void;
  onSelectExam: (exam: ExamListItem) => void;
}

export function WrongExamSelection({
  filteredExams,
  isLoading,
  error,
  selectedSubject,
  setSelectedSubject,
  selectedRound,
  setSelectedRound,
  handleSearch,
  handleReset,
  onSelectExam,
}: WrongExamSelectionProps) {
  return (
    <>
      {/* 검색 필터 영역 */}
      <div className={styles.filterContainer}>
        {/* 과목 선택 */}
        <div className={`${styles.filterGroup} ${styles.filterGroupSubject}`}>
          <label className={styles.label}>과목</label>
          <div className={styles.selectWrapper}>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={styles.select}
            >
              <option value="all">전체 과목</option>
              <option value="부동산 공법">부동산 공법</option>
              <option value="부동산공시법령 부동산세법">부동산공시법령 부동산세법</option>
            </select>
            <ChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 회차 선택 */}
        <div className={`${styles.filterGroup} ${styles.filterGroupRound}`}>
          <label className={styles.label}>회차</label>
          <div className={styles.selectWrapper}>
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
              className={styles.select}
            >
              <option value="all">전체 회차</option>
              <option value="35">35회/2026</option>
              <option value="34">34회/2025</option>
            </select>
            <ChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* 초기화 / 검색 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            <RotateCcw className="w-4 h-4" />
            <span>초기화</span>
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className={styles.searchButton}
          >
            검색하기
          </button>
        </div>
      </div>

      {/* 리스트 피드 */}
      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.infoState}>
            시험 목록을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p className={styles.errorText}>{error}</p>
            <button
              type="button"
              onClick={handleSearch}
              className={styles.retryButton}
            >
              다시 시도
            </button>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className={styles.infoState}>
            풀어본 시험 내역이 없습니다.
          </div>
        ) : (
          <div className={styles.examList}>
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className={styles.examCard}
              >
                {/* 좌측 정보 영역 */}
                <div className={styles.cardInfo}>
                  <div className={styles.badgeGroup}>
                    <span className={styles.roundBadge}>
                      {exam.round}회 기출
                    </span>
                    <span className={styles.subjectName}>
                      {exam.subject}
                    </span>
                  </div>
                  <h3 className={styles.examTitle}>
                    {exam.title}
                  </h3>
                  <div className={styles.metaGroup}>
                    <span className={styles.metaItem}>
                      <Calendar className="w-3.5 h-3.5" />
                      완료일: <strong className={styles.metaValue}>{exam.completedAt ? new Date(exam.completedAt).toLocaleDateString() : "-"}</strong>
                    </span>
                    <span className={styles.divider}>|</span>
                    <span className={styles.metaItem}>
                      <HelpCircle className="w-3.5 h-3.5" />
                      <strong className={styles.metaValue}>{exam.totalQuestions}</strong>문항
                    </span>
                    <span className={styles.divider}>|</span>
                    <span className={styles.metaItem}>
                      <Clock className="w-3.5 h-3.5" />
                      <strong className={styles.metaValue}>{exam.durationMinutes}</strong>분
                    </span>
                  </div>
                </div>

                {/* 우측 성적 정보 및 제어 버튼 */}
                <div className={styles.cardControl}>
                  <div className={styles.scoreWrapper}>
                    {exam.score != null ? (
                      <div className={`${styles.scoreLabel} ${
                        exam.score >= 80
                          ? styles.scorePass
                          : exam.score >= 60
                            ? styles.scoreWarning
                            : styles.scoreFail
                      }`}>
                        최근 점수 <div className={styles.scoreValue}>{exam.score}점</div>
                      </div>
                    ) : (
                      <div className={styles.noScore}>점수 없음</div>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectExam(exam)}
                    className={styles.selectButton}
                  >
                    오답노트 선택
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
