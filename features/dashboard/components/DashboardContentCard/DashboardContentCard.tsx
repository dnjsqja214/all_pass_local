import type { DashboardContent } from "../../services/dashboardContentService";
import styles from "./DashboardContentCard.module.css";

interface DashboardContentCardProps {
  content: DashboardContent[] | undefined;
  isLoading?: boolean;
  error?: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
});

function formatDate(value: string | null): string {
  if (!value) return "-";
  const [year, month, day] = value.split("-").map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

function dDay(value: string | null): string | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const difference = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (difference === 0) return "D-Day";
  return difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
}

function ContentCard({ content }: { content: DashboardContent }) {
  const exam = content.type === "EXAM";
  const countdown = exam ? dDay(content.examDate) : null;
  return (
    <section className={styles.card} data-type={content.type}>
      <div className={styles.head}>
        <div>
          {content.eyebrow ? <span className={styles.eyebrow}>{content.eyebrow}</span> : null}
          <h2>{content.title}</h2>
        </div>
        {countdown ? <strong className={styles.dDay}>{countdown}</strong> : null}
      </div>
      {content.body ? <p className={styles.body}>{content.body}</p> : null}
      {exam ? (
        <div className={styles.schedule}>
          <div><span>시험 일정</span><strong>{formatDate(content.examDate)}</strong></div>
          <div><span>접수 일자</span><strong>{formatDate(content.registrationStart)} ~ {formatDate(content.registrationEnd)}</strong></div>
          <div><span>합격자 발표</span><strong>{formatDate(content.announcementDate)}</strong></div>
        </div>
      ) : null}
      {content.subjectSummary ? (
        <div className={styles.summary}>
          <span>시험 안내</span>
          {content.subjectSummary.split("\n").map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
        </div>
      ) : null}
    </section>
  );
}

export function DashboardContentCard({ content, isLoading, error }: DashboardContentCardProps) {
  if (isLoading) return <section className={styles.state}>대시보드 안내를 불러오는 중입니다.</section>;
  if (error) return <section className={styles.state} data-error="true">{error}</section>;
  if (!content?.length) return <section className={styles.state}>현재 등록된 대시보드 안내가 없습니다.</section>;

  const ordered = [...content].sort((left, right) =>
    (left.type === "EXAM" ? 0 : 1) - (right.type === "EXAM" ? 0 : 1));
  return <div className={styles.stack}>{ordered.map((item) => <ContentCard key={item.id} content={item} />)}</div>;
}
