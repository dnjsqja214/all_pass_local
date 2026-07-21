"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { ExamRegistration } from "../../exam/services/examRegistrationService";
import styles from "./ActiveStudyCard.module.css";

interface ActiveStudyCardProps {
  closestRegistration: ExamRegistration | null;
  onStart: (registration: ExamRegistration) => void;
  onApplyExamClick: () => void;
}

const dateTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit",
});

function countdown(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds % 86400 / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  if (days) return `${days}일 ${hours}시간 후 시작`;
  if (hours) return `${hours}시간 ${minutes}분 후 시작`;
  return `${minutes}분 후 시작`;
}

export function ActiveStudyCard({ closestRegistration, onStart, onApplyExamClick }: ActiveStudyCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!closestRegistration) {
    return <section className={styles.card}><div className={styles.textGroup}><span className={styles.title}>다음 시험</span><h2 className={styles.time}>신청된 시험이 없습니다</h2></div><div className={styles.empty}>관리자가 개설한 회차를 먼저 신청해 주세요.<button onClick={onApplyExamClick}>시험 신청</button></div></section>;
  }

  const startsAt = new Date(closestRegistration.startsAt).getTime();
  const closesAt = new Date(closestRegistration.entryClosesAt).getTime();
  const canOpen = now >= startsAt;
  const closed = now > closesAt;

  return (
    <section className={styles.card}>
      <div className={styles.textGroup}><span className={styles.title}>다음 시험</span><h2 className={styles.time}>{dateTime.format(new Date(closestRegistration.startsAt))}</h2></div>
      <div className={styles.exam}><span>{closestRegistration.round}회 · {closestRegistration.durationMinutes}분</span><strong>{closestRegistration.examTitle}</strong><small><Clock3 /> 입장 마감 {dateTime.format(new Date(closestRegistration.entryClosesAt))}</small></div>
      <button className={styles.button} disabled={!canOpen} onClick={() => onStart(closestRegistration)}>
        {closed ? "이어풀기" : canOpen ? "시험 시작" : countdown(startsAt - now)}
      </button>
    </section>
  );
}
