import React from "react";
import styles from "./ExamNotice.module.css";

export function ExamNotice() {
  return (
    <div className={styles.notice}>
      {/* BookOpen 대체 인라인 SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={styles.icon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
      <div className={styles.body}>
        <span>문제는 본인 기출책으로 푸세요. 화면엔 문제가 없습니다.</span>
        <span>정답만 선택하여 시간 내 제출하시면 됩니다.</span>
      </div>
    </div>
  );
}
