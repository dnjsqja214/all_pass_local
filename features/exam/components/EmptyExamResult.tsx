import React from "react";
import { RotateCcw } from "lucide-react";
import styles from "./EmptyExamResult.module.css";

interface EmptyExamResultProps {
  onReset: () => void;
}

export function EmptyExamResult({ onReset }: EmptyExamResultProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.emoji}>🔍</div>
      <div className={styles.message}>
        <h3 className={styles.title}>검색 조건에 맞는 시험이 없습니다.</h3>
        <p className={styles.description}>검색 조건을 변경하거나 초기화해주세요.</p>
      </div>
      <button onClick={onReset} className={styles.resetButton}>
        <RotateCcw className={styles.resetIcon} />
        <span>검색 초기화</span>
      </button>
    </div>
  );
}
