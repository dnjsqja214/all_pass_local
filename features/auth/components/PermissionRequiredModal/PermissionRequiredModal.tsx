"use client";

import styles from "./PermissionRequiredModal.module.css";

interface PermissionRequiredModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
}

export function PermissionRequiredModal({
  isOpen,
  title = "권한이 없습니다",
  description = "시험 신청·응시는 멤버 권한이 필요합니다.",
  onClose,
}: PermissionRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.head}>
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
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 0h10.5a2.25 2.25 0 0 1 2.25 2.25v6.75a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-6.75a2.25 2.25 0 0 1 2.25-2.25Z"
              />
            </svg>
          </div>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.confirmButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
