import React, { RefObject } from "react";
import { useRouter } from "next/navigation";
import { ExamListItem } from "../types/exam";
import { Calendar, HelpCircle, Clock } from "lucide-react";
import styles from "./ExamCardList.module.css";

interface ExamCardListProps {
  exams: ExamListItem[];
  scrollRef?: RefObject<HTMLDivElement | null>;
  onSelectExam?: (exam: ExamListItem) => void;
}

// 점수 구간 판정. 색상은 CSS 가 data-grade 로 고른다.
function scoreGrade(score: number) {
  if (score >= 80) return "high";
  if (score >= 60) return "mid";
  return "low";
}

export function ExamCardList({ exams, scrollRef, onSelectExam }: ExamCardListProps) {
  const router = useRouter();

  const handleSelect = (exam: ExamListItem) => {
    if (exam.status === "scheduled") return;
    if (onSelectExam) {
      onSelectExam(exam);
    } else {
      router.push(`/exams/${exam.id}/solve`);
    }
  };

  return (
    <div ref={scrollRef} className={styles.scroller}>
      <div className={styles.list}>
        {exams.map((exam) => (
          <div key={exam.id} className={styles.card}>
            {/* 좌측 정보 영역 */}
            <div className={styles.info}>
              <span className={styles.roundBadge}>{exam.round}회 기출</span>

              <h3 className={styles.title}>{exam.title}</h3>

              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <Calendar className={styles.metaIcon} />
                  {exam.year}년 · {exam.round}회
                </span>
                <span className={styles.divider}>|</span>
                <span className={styles.metaItem}>
                  <HelpCircle className={styles.metaIcon} />
                  {exam.totalQuestions}문항
                </span>
                <span className={styles.divider}>|</span>
                <span className={styles.metaItem}>
                  <Clock className={styles.metaIcon} />
                  {exam.durationMinutes}분
                </span>
              </div>
            </div>

            {/* 우측 단추 및 스코어 영역 */}
            <div className={styles.actions}>
              <div className={styles.scoreBox}>
                {exam.status === "completed" && exam.score != null ? (
                  <div className={styles.score} data-grade={scoreGrade(exam.score)}>
                    최근 점수
                    <div className={styles.scoreValue}>{exam.score}점</div>
                  </div>
                ) : (
                  <div className={styles.noScore}>
                    {exam.status === "scheduled" ? "업데이트 예정" : "미응시 시험"}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSelect(exam)}
                disabled={exam.status === "scheduled"}
                className={styles.selectButton}
              >
                시험 선택
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
