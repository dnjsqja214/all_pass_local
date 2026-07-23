import React from "react";
import styles from "./ExamDDayCard.module.css";

interface ExamDDayCardProps {
  examRound?: number;
  examDate?: string; // ISO format (e.g. "2026-10-31")
  registrationStart?: string; // ISO format (e.g. "2026-08-03")
  registrationEnd?: string; // ISO format (e.g. "2026-08-07")
  announcementDate?: string; // ISO format (e.g. "2026-12-02")
}

// 요일 포함 날짜 포맷팅 헬퍼 (YYYY-MM-DD -> YYYY-MM-DD (요일))
function formatDateWithDayOfWeek(dateStr: string): string {
  if (!dateStr) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  
  // 타임존 방지를 위해 로컬 기준으로 파싱
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  if (isNaN(date.getTime())) return dateStr;
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dayOfWeek = days[date.getDay()];
  
  return `${y}-${m}-${d} (${dayOfWeek})`;
}

// 로컬 자정 기준 Date 객체 생성
function parseLocalMidnight(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function ExamDDayCard({
  examRound = 37,
  examDate = "2026-10-31",
  registrationStart = "2026-08-03",
  registrationEnd = "2026-08-07",
  announcementDate = "2026-12-02",
}: ExamDDayCardProps) {
  // 실시간 D-Day 및 남은 주차 계산
  const targetDate = parseLocalMidnight(examDate);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  
  const diffMs = targetDate.getTime() - todayMidnight.getTime();
  const dDay = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeksRemaining = Math.max(0, Math.ceil(dDay / 7));

  // 화면 출력용 포맷팅
  const formattedExamDate = formatDateWithDayOfWeek(examDate);
  const formattedRegPeriod = `${formatDateWithDayOfWeek(registrationStart)} ~ ${formatDateWithDayOfWeek(registrationEnd)}`;
  const formattedAnnounceDate = formatDateWithDayOfWeek(announcementDate);

  return (
    <div className={styles.card}>
      {/* 상단 타이틀 & D-day 뱃지 영역 */}
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>{examRound}th License Exam</span>
          <h4 className={styles.title}>제{examRound}회 공인중개사</h4>
        </div>

        {/* D-Day 뱃지 */}
        <div className={styles.dDayBadge}>
          <span className={styles.dDayValue}>
            {dDay > 0 ? `D-${dDay}` : dDay === 0 ? "D-Day" : `D+${Math.abs(dDay)}`}
          </span>
          <span className={styles.weeks}>W-{weeksRemaining}주</span>
        </div>
      </div>

      {/* 시험 세부 일정 리스트 */}
      <div className={styles.schedule}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>시험 일정</span>
          <span className={styles.rowValue}>{formattedExamDate}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>접수 일자</span>
          <span className={styles.rowValue}>{formattedRegPeriod}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>합격자 발표</span>
          <span className={styles.rowValue}>{formattedAnnounceDate}</span>
        </div>
      </div>

      {/* 2차 시험 과목 안내 박스 */}
      <div className={styles.subjects}>
        <h5 className={styles.subjectsTitle}>2차 시험 과목</h5>
        <div className={styles.subjectsBody}>
          <div>
            <span className={styles.period}>1교시 :</span> 공인중개사법령 및 중개실무, 부동산공법
          </div>
          <div>
            <span className={styles.period}>2교시 :</span> 부동산공시법 및 부동산세법
          </div>
        </div>
      </div>
    </div>
  );
}
