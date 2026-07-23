import React from "react";
import { RotateCcw, ChevronDown } from "lucide-react";
import styles from "./ExamSearchForm.module.css";

interface ExamSearchFormProps {
  type: string;
  setType: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  subjectOptions: string[];
  round: string;
  setRound: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function ExamSearchForm({
  type,
  setType,
  subject,
  setSubject,
  subjectOptions,
  round,
  setRound,
  onSearch,
  onReset,
}: ExamSearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* 1. 시험 유형 선택 */}
      <div className={styles.field}>
        <label htmlFor="search-type" className={styles.label}>
          유형
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="search-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={styles.select}
          >
            <option value="all">전체 유형</option>
            <option value="pre">기출문제</option>
            <option value="mock">모의고사</option>
          </select>
          <ChevronDown className={styles.chevron} />
        </div>
      </div>

      {/* 2. 과목 선택 */}
      <div className={styles.field} data-wide="true">
        <label htmlFor="search-subject" className={styles.label}>
          과목
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="search-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={styles.select}
          >
            <option value="all">전체 과목</option>
            {subjectOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.chevron} />
        </div>
      </div>

      {/* 3. 회차 선택 */}
      <div className={styles.field}>
        <label htmlFor="search-round" className={styles.label}>
          회차
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="search-round"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className={styles.select}
          >
            <option value="all">전체 회차</option>
            <option value="35">35회/2026</option>
            <option value="34">34회/2025</option>
            <option value="33">33회/2024</option>
            <option value="32">32회/2023</option>
          </select>
          <ChevronDown className={styles.chevron} />
        </div>
      </div>

      {/* 4. 버튼 영역 */}
      <div className={styles.buttons}>
        <button type="submit" className={styles.searchButton}>
          <span>검색</span>
        </button>

        <button type="button" onClick={onReset} className={styles.resetButton}>
          <RotateCcw className={styles.resetIcon} />
          <span>초기화</span>
        </button>
      </div>
    </form>
  );
}
