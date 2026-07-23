import React from "react";
import styles from "./SubmitFooter.module.css";

interface SubmitFooterProps {
  onSubmitClick: () => void;
  disabled?: boolean;
}

export function SubmitFooter({ onSubmitClick, disabled = false }: SubmitFooterProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.inner}>
        <button
          type="button"
          onClick={onSubmitClick}
          disabled={disabled}
          className={styles.submitButton}
        >
          {/* Send 대체 인라인 SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={styles.icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
          <span>{disabled ? "제출 처리 중" : "정답지 제출하기"}</span>
        </button>
      </div>
    </div>
  );
}
