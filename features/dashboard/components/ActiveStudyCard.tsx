"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import type { ExamRegistration, ExamSlot } from "../../exam/services/examRegistrationService";
import styles from "./ActiveStudyCard.module.css";

interface ActiveStudyCardProps {
  registrations: ExamRegistration[];
  openSlots: ExamSlot[];
  serverNow?: number;
  isLoading?: boolean;
  onStart: (registration: ExamRegistration) => void;
  onApplyExamClick: () => void;
}

const dateTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit",
});

interface NextExam {
  exam: ExamSlot | ExamRegistration;
  registration: ExamRegistration | null;
}

function examKey(exam: Pick<ExamSlot, "examId" | "startsAt">): string {
  return `${exam.examId}@${new Date(exam.startsAt).getTime()}`;
}

function overlaps(left: Pick<ExamSlot, "startsAt" | "durationMinutes">,
  right: Pick<ExamSlot, "startsAt" | "durationMinutes">): boolean {
  const leftStart = new Date(left.startsAt).getTime();
  const rightStart = new Date(right.startsAt).getTime();
  const leftEnd = leftStart + left.durationMinutes * 60_000;
  const rightEnd = rightStart + right.durationMinutes * 60_000;
  return leftStart < rightEnd && leftEnd > rightStart;
}

function findNextExam(registrations: ExamRegistration[], openSlots: ExamSlot[], now: number): NextExam | null {
  const candidates = new Map<string, NextExam>();
  const applied = registrations.filter((registration) => registration.status === "applied" &&
    new Date(registration.entryClosesAt).getTime() >= now);
  openSlots
    .filter((slot) => new Date(slot.entryClosesAt).getTime() >= now &&
      !applied.some((registration) => examKey(slot) !== examKey(registration) && overlaps(slot, registration)))
    .forEach((slot) => candidates.set(examKey(slot), { exam: slot, registration: null }));
  applied.forEach((registration) => candidates.set(examKey(registration), {
      exam: registration,
      registration,
    }));
  return [...candidates.values()].sort((left, right) =>
    new Date(left.exam.startsAt).getTime() - new Date(right.exam.startsAt).getTime())[0] ?? null;
}

export function ActiveStudyCard({
  registrations,
  openSlots,
  serverNow,
  isLoading,
  onStart,
  onApplyExamClick,
}: ActiveStudyCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const clientStartedAt = Date.now();
    const serverStartedAt = serverNow ?? clientStartedAt;
    const timer = window.setInterval(() => {
      setNow(serverStartedAt + Date.now() - clientStartedAt);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [serverNow]);

  const nextExam = findNextExam(registrations, openSlots, now);
  if (!nextExam) {
    return <section className={styles.card}><div className={styles.textGroup}><span className={styles.title}>다음 시험</span><h2 className={styles.time}>{isLoading ? "시험 일정을 확인하는 중입니다" : "신청 가능한 시험이 없습니다"}</h2></div>{!isLoading ? <div className={styles.empty}>새로운 시험 일정은 시험 신청 화면에서 확인할 수 있습니다.<button onClick={onApplyExamClick}>시험 신청</button></div> : null}</section>;
  }

  const { exam, registration } = nextExam;
  const startsAt = new Date(exam.startsAt).getTime();
  const canOpen = now >= startsAt;

  return (
    <section className={styles.card}>
      <div className={styles.textGroup}><span className={styles.title}>다음 시험</span><h2 className={styles.time}>{dateTime.format(new Date(exam.startsAt))}</h2></div>
      <div className={styles.exam}><span>{exam.round}회 · {exam.durationMinutes}분</span><strong>{exam.examTitle}</strong><small><Clock3 /> 입장 마감 {dateTime.format(new Date(exam.entryClosesAt))}</small></div>
      {registration && !canOpen ? (
        <div className={styles.status}>신청 완료</div>
      ) : registration ? (
        <button className={styles.button} onClick={() => onStart(registration)}>시험 시작</button>
      ) : (
        <button className={styles.button} onClick={onApplyExamClick}>시험 신청</button>
      )}
    </section>
  );
}
