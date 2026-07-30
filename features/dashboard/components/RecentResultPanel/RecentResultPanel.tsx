import { BookOpenCheck } from "lucide-react";
import type { ExamRegistration } from "../../../exam/services/examRegistrationService";
import styles from "./RecentResultPanel.module.css";

interface RecentResultPanelProps {
  registrations: ExamRegistration[];
  onOpenWrongNote: (registrationId: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
});

export function RecentResultPanel({ registrations, onOpenWrongNote }: RecentResultPanelProps) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div><span>Recent results</span><h2>최근 응시 결과</h2></div>
        <p>실제 채점이 완료된 시험만 표시됩니다.</p>
      </div>
      {registrations.length ? (
        <div className={styles.list}>
          {registrations.map((registration) => (
            <article key={registration.id} className={styles.item}>
              <div className={styles.result}>
                <strong>{registration.score ?? "-"}점</strong>
                <button type="button" onClick={() => onOpenWrongNote(registration.id)}>
                  <BookOpenCheck /> 오답 노트
                </button>
              </div>
              <div className={styles.detail}>
                <h3>{registration.examTitle}</h3>
                <p>{registration.round}회 · {registration.subject} · {dateFormatter.format(new Date(registration.startsAt))}</p>
              </div>
            </article>
          ))}
        </div>
      ) : <div className={styles.empty}>채점이 완료된 시험 성적이 없습니다.</div>}
    </section>
  );
}
