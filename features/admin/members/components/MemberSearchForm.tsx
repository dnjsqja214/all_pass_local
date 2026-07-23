import React from "react";
import { Search, RotateCcw } from "lucide-react";
import styles from "./MemberSearchForm.module.css";

interface MemberSearchFormProps {
  searchName: string;
  setSearchName: (val: string) => void;
  onSearch: (keyword: string) => void;
  onReset: () => void;
}

export function MemberSearchForm({
  searchName,
  setSearchName,
  onSearch,
  onReset,
}: MemberSearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchName);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="search-name" className={styles.label}>
          회원 이름 검색
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="search-name"
            type="text"
            placeholder="이름을 입력하세요 (예: 김서연)"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={styles.input}
          />
          <Search className={styles.searchIcon} />
        </div>
      </div>

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
