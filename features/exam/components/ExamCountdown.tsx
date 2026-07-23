"use client";

import React from "react";
import type { ExamRegistration } from "../services/examRegistrationService";
import styles from "./ExamCountdown.module.css";

/**
 * 시험 시작 대기 화면.
 *
 * <p>판정도 조회도 하지 않는다. 받은 값을 그리고 버튼 클릭을 위로 넘길 뿐이다 —
 * 지금이 어느 단계인지는 {@code useExamPhase} 가 정하고 레이아웃이 넘겨준다.</p>
 */

interface ExamCountdownProps {
  remainingSeconds: number;
  registration: ExamRegistration;
  /** 시작 시각이 지나 버튼을 누를 수 있는 상태인지. */
  canStart: boolean;
  isStarting: boolean;
  onStart: () => void;
  error?: string | null;
}

/** 한 시간이 넘으면 시:분:초로 늘린다. 483:27 처럼 분이 세 자리가 되면 읽을 수 없다. */
function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

function formatStartsAt(value: string): string {
  return new Date(value).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export function ExamCountdown({
  remainingSeconds,
  registration,
  canStart,
  isStarting,
  onStart,
  error,
}: ExamCountdownProps) {
  return (
    <div className={styles.screen} data-urgent={!canStart && remainingSeconds <= 60}>
      <div>
        <p className={styles.eyebrow}>시험 시작 대기</p>
        <h1 className={styles.examTitle}>{registration.examTitle}</h1>
        <p className={styles.subject}>
          {registration.year}년 {registration.round}회 · {registration.subject}
        </p>
      </div>

      <div>
        <p className={styles.clockLabel}>{canStart ? "시작되었습니다" : "시작까지"}</p>
        <p className={styles.clock}>{formatClock(canStart ? 0 : remainingSeconds)}</p>
      </div>

      <p className={styles.startsAt}>{formatStartsAt(registration.startsAt)} 시작</p>

      <button
        type="button"
        className={styles.startButton}
        disabled={!canStart || isStarting}
        onClick={onStart}
      >
        {isStarting ? "시험을 준비하는 중" : "시험 시작"}
      </button>

      <p className={styles.notice}>
        시작 시각이 되면 버튼이 활성화됩니다. 화면을 닫지 말고 기다려 주세요.
        <br />
        문제는 본인 기출책으로 풀고, 화면에는 정답만 표시합니다.
      </p>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
