import React from "react";
import { X } from "lucide-react";
import { StudyContributionItem } from "../types";
import { formatMinutesToHoursAndMinutes } from "../services/studyService";
import styles from "./StudyDayDetailModal.module.css";

interface StudyDayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StudyContributionItem | null;
}

export function StudyDayDetailModal({
  isOpen,
  onClose,
  item,
}: StudyDayDetailModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const formatDateString = (dateStr: string): string => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return `${year}년 ${month}월 ${day}일`;
  };

  const formattedDate = formatDateString(item.studyDate);
  const hasStudy = item.studyMinutes > 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modal} animate-in fade-in zoom-in-95 duration-200`}>
        <header className={styles.header}>
          <h3 className={styles.title}>{formattedDate}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {hasStudy ? (
          <div className={styles.body}>
            {/* Total Study Time */}
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>총 공부 시간</h4>
              <p className={styles.mainValue}>
                {formatMinutesToHoursAndMinutes(item.studyMinutes)}
              </p>
            </section>

            {/* Subject Breakdown */}
            {item.subjects && item.subjects.length > 0 && (
              <section className={styles.section}>
                <h4 className={styles.sectionTitle}>학습 과목</h4>
                <ul className={styles.subjectList}>
                  {item.subjects.map((sub, idx) => (
                    <li key={idx} className={styles.subjectItem}>
                      <span className={styles.subjectName}>{sub.subjectName}</span>
                      <span className={styles.subjectTime}>
                        {formatMinutesToHoursAndMinutes(sub.studyMinutes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Questions Solved */}
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>문제 풀이</h4>
              <p className={styles.mainValue}>{item.questionCount}문제</p>
            </section>

            {/* Exams Solved (학습한 시험 정보) */}
            {item.exams && item.exams.length > 0 && (
              <section className={styles.section}>
                <h4 className={styles.sectionTitle}>학습한 시험 정보</h4>
                <ul className={styles.examList}>
                  {item.exams.map((ex, idx) => (
                    <li key={idx} className={styles.examItem}>
                      <div className={styles.examHeader}>
                        <span className={styles.examTitleText}>{ex.examTitle}</span>
                        <span className={`${styles.examBadge} ${ex.isPassed ? styles.badgePassed : styles.badgeFailed}`}>
                          {ex.isPassed ? "합격" : "불합격"}
                        </span>
                      </div>
                      <div className={styles.examScore}>
                        총점: <strong>{ex.score}점</strong>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⏳</div>
            <p className={styles.emptyText}>해당 날짜의 학습 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
