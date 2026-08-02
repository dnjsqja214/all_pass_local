"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RefreshCw,
  Users,
} from "lucide-react";
import { useGetDailyOperationsQuery } from "@/features/admin/operations/api/operationsApi";
import { queryErrorMessage } from "@/features/store/api/queryError";
import type { AccessStatus } from "@/features/admin/operations/services/operationsService";
import styles from "./page.module.css";

const KST_OFFSET = 9 * 60 * 60 * 1000;

function toDateValue(date: Date): string {
  return new Date(date.getTime() + KST_OFFSET).toISOString().slice(0, 10);
}

function shiftDate(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00+09:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateValue(date);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00+09:00`));
}

function formatTime(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

const statusLabels: Record<AccessStatus, string> = {
  ONLINE: "접속 중",
  RECENT: "최근 인증",
  LOGOUT: "로그아웃",
  SESSION_TIMEOUT: "세션 만료 (30분)",
};

export default function AdminDashboard() {
  const today = useMemo(() => toDateValue(new Date()), []);
  const [date, setDate] = useState(today);
  const query = useGetDailyOperationsQuery(date, {
    refetchOnFocus: true,
  });
  const data = query.data;
  const submitted = data?.exams.reduce((sum, exam) => sum + exam.submittedCount, 0) ?? 0;
  const started = data?.exams.reduce((sum, exam) => sum + exam.startedCount, 0) ?? 0;
  const submissionRate = started === 0 ? 0 : Math.round(submitted * 100 / started);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>OPERATIONS</p>
          <h1>운영 현황</h1>
          <p>실제 인증 이력과 시험 응시·제출 데이터를 날짜별로 확인합니다.</p>
        </div>
        <div className={styles.dateToolbar}>
          <button type="button" aria-label="이전 날짜" onClick={() => setDate(shiftDate(date, -1))}>
            <ChevronLeft size={18} />
          </button>
          <label>
            <CalendarDays size={17} />
            <input type="date" value={date} max={today} onChange={(event) => setDate(event.target.value)} />
          </label>
          <button type="button" aria-label="다음 날짜" disabled={date >= today}
            onClick={() => setDate(shiftDate(date, 1))}>
            <ChevronRight size={18} />
          </button>
          <button type="button" className={styles.todayButton} onClick={() => setDate(today)}>오늘</button>
          <button type="button" className={styles.todayButton} aria-label="새로고침"
            disabled={query.isFetching} onClick={() => void query.refetch()}>
            <RefreshCw size={16} className={query.isFetching ? styles.spin : undefined} /> 새로고침
          </button>
        </div>
      </header>

      <div className={styles.dateSummary}>
        <span>{formatDate(date)}</span>
      </div>

      {query.isLoading ? (
        <div className={styles.state}><RefreshCw className={styles.spin} />운영 현황을 불러오는 중입니다.</div>
      ) : query.isError ? (
        <div className={styles.errorState}>
          <strong>운영 현황을 불러오지 못했습니다.</strong>
          <span>{queryErrorMessage(query.error, "잠시 후 다시 시도해 주세요.")}</span>
          <button type="button" onClick={() => query.refetch()}>다시 시도</button>
        </div>
      ) : data ? (
        <>
          <section className={styles.metrics} aria-label="운영 지표">
            <Metric icon={<Activity />} label="현재 접속" value={`${data.currentOnlineCount}명`}
              detail="STOMP 실시간 연결 기준" tone="live" />
            <Metric icon={<Users />} label="조회일 접속 회원" value={`${data.users.length}명`}
              detail="인증 성공 이력 기준" />
            <Metric icon={<Clock3 />} label="실시 시험" value={`${data.exams.length}건`}
              detail="해당 일자 일정 기준" />
            <Metric icon={<CheckCircle2 />} label="정답지 제출률" value={`${submissionRate}%`}
              detail={`${submitted} / ${started}명 제출`} />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div><h2>회원 접속 현황</h2><p>로그인부터 마지막 인증, 종료 판단까지 표시합니다.</p></div>
              <span>{data.users.length}명</span>
            </div>
            {data.users.length === 0 ? <Empty text="이 날짜에 기록된 접속 이력이 없습니다." /> : (
              <div className={styles.tableScroll}>
                <table>
                  <thead><tr><th>회원</th><th>로그인</th><th>최종 인증</th><th>종료</th><th>상태</th></tr></thead>
                  <tbody>
                    {data.users.map((user) => (
                      <tr key={user.userId}>
                        <td><strong>{user.name || "이름 없음"}</strong><span>{user.email}</span></td>
                        <td>{formatTime(user.loggedInAt)}</td>
                        <td>{formatTime(user.lastAuthenticatedAt)}</td>
                        <td>{formatTime(user.endedAt)}</td>
                        <td><span className={styles.status} data-status={user.status}>
                          {statusLabels[user.status]}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div><h2>시험별 응시 현황</h2><p>신청 인원과 실제 시작·정답지 제출 상태를 비교합니다.</p></div>
              <span>{data.exams.length}건</span>
            </div>
            {data.exams.length === 0 ? <Empty text="이 날짜에 실시된 시험이 없습니다." /> : (
              <div className={styles.examGrid}>
                {data.exams.map((exam) => (
                  <article className={styles.examCard} key={`${exam.examId}-${exam.startsAt}`}>
                    <div className={styles.examHeading}>
                      <div><span>{exam.year}년 · {exam.round}회</span><h3>{exam.examTitle}</h3>
                        <p>{exam.subject} · {formatTime(exam.startsAt)}</p></div>
                      <strong>{exam.submissionRate}%</strong>
                    </div>
                    <div className={styles.progress}><i style={{ width: `${exam.submissionRate}%` }} /></div>
                    <dl>
                      <div><dt>신청</dt><dd>{exam.registeredCount}명</dd></div>
                      <div><dt>응시</dt><dd>{exam.startedCount}명</dd></div>
                      <div><dt>제출</dt><dd>{exam.submittedCount}명</dd></div>
                      <div><dt>미제출</dt><dd>{exam.unsubmittedCount}명</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

function Metric({ icon, label, value, detail, tone }: {
  icon: React.ReactNode; label: string; value: string; detail: string; tone?: "live";
}) {
  return <article className={styles.metric} data-tone={tone}><span className={styles.metricIcon}>{icon}</span>
    <div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div></article>;
}

function Empty({ text }: { text: string }) {
  return <div className={styles.empty}>{text}</div>;
}
