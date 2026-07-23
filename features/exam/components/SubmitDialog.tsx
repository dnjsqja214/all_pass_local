import React from "react";
import styles from "./SubmitDialog.module.css";

interface SubmitDialogProps {
  isOpen: boolean;
  unansweredCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmitDialog({
  isOpen,
  unansweredCount,
  onClose,
  onConfirm,
}: SubmitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      {/* OMR 제출 모달 박스 */}
      <div className={styles.dialog}>
        <div className={styles.head}>
          {/* AlertTriangle 대체 인라인 SVG */}
          <div className={styles.iconCircle}>
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
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div>
            <h3 className={styles.title}>시험을 제출하시겠습니까?</h3>
            <p className={styles.description}>제출 후에는 답안을 수정할 수 없습니다.</p>
          </div>
        </div>

        {/* 미응답 경고 박스 */}
        {unansweredCount > 0 && (
          <div className={styles.warning}>
            <span className={styles.warningTitle}>
              ⚠️ 미응답 {unansweredCount}문항이 있습니다.
            </span>
            <span className={styles.warningText}>
              작성되지 않은 문항은 자동 오답 처리됩니다. 그래도 제출을 진행하시겠습니까?
            </span>
          </div>
        )}

        {/* 하단 취소/제출 단추 */}
        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
          <button type="button" onClick={onConfirm} className={styles.confirmButton}>
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
