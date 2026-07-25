"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock, X } from "lucide-react";
import styles from "./ScheduleValuePickerModal.module.css";

type PickerKind = "time" | "date";

interface ScheduleValuePickerModalProps {
  kind: PickerKind;
  existingValues: string[];
  onConfirm: (value: string) => void;
  onClose: () => void;
}

function formatTime(value: string): string {
  const [hour = "00", minute = "00"] = value.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function ScheduleValuePickerModal({
  kind,
  existingValues,
  onConfirm,
  onClose,
}: ScheduleValuePickerModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isTime = kind === "time";
  const normalizedValue = isTime && value ? formatTime(value) : value;
  const isDuplicate = Boolean(normalizedValue && existingValues.includes(normalizedValue));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();
    try {
      inputRef.current?.showPicker();
    } catch {
      // 기본 피커 자동 실행이 제한된 브라우저에서는 입력란을 눌러 선택한다.
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const confirm = () => {
    if (!normalizedValue || isDuplicate) return;
    onConfirm(normalizedValue);
  };

  const title = isTime ? "시간 추가" : "제외 일자 추가";
  const selectionLabel = isTime ? "선택한 시간" : "선택한 일자";

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-value-picker-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.title}>
            <span className={styles.icon} aria-hidden="true">
              {isTime ? <Clock /> : <CalendarDays />}
            </span>
            <h2 id="schedule-value-picker-title">{title}</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
            <X />
          </button>
        </header>

        <div className={styles.picker}>
          <label>
            <span>{isTime ? "시간 선택" : "일자 선택"}</span>
            <input
              ref={inputRef}
              type={kind}
              step={isTime ? 60 : undefined}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.selection} data-empty={!normalizedValue}>
          <span>{selectionLabel}</span>
          <strong>{normalizedValue || "선택 전"}</strong>
        </div>

        {isDuplicate ? <p className={styles.duplicate}>이미 추가된 값입니다.</p> : null}

        <footer className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>취소</button>
          <button type="button" className={styles.confirmButton} onClick={confirm} disabled={!normalizedValue || isDuplicate}>추가</button>
        </footer>
      </section>
    </div>
  );
}
