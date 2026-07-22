import React from "react";
import styles from "./ExamHistoryList.module.css";

interface ExamSubjectScore {
  name: string;
  score: number;
  isFailed: boolean;
}

interface ExamHistoryItem {
  id: string;
  examTitle: string;
  attemptTitle: string;
  date: string;
  totalScore: number;
  isPassed: boolean;
  subjects: ExamSubjectScore[];
}

interface ExamHistoryListProps {
  history: ExamHistoryItem[];
  className?: string;
}

export function ExamHistoryList({ history, className = "" }: ExamHistoryListProps) {
  const renderSubjectScores = (subjects: ExamSubjectScore[]) => {
    return (
      <div className={styles.subjectScores}>
        {subjects.map((sub, idx) => {
          let scoreClass = styles.scoreNormal;
          if (sub.isFailed) {
            scoreClass = styles.scoreFailed;
          } else if (sub.score >= 60) {
            scoreClass = styles.scorePassed;
          }
          return (
            <span key={idx} className={styles.subjectItem}>
              <span>{sub.name}</span>
              <span className={`ml-1 ${scoreClass}`}>{sub.score}</span>
              {idx < subjects.length - 1 && <span className={styles.dot}>·</span>}
            </span>
          );
        })}
      </div>
    );
  };

  const hasCutoffFail = (subjects: ExamSubjectScore[]) => {
    return subjects.some((sub) => sub.isFailed);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Card Header unified with study calendar style */}
      <div className={styles.header}>
        <h3 className={styles.title}>회차별 응시 이력</h3>
        <p className={styles.subtitle}>최근 모의고사 응시 결과 및 과목별 점수 상세</p>
      </div>

      {/* 1. 모바일 및 태블릿 리스트 뷰 (xl:hidden) */}
      <div className={styles.mobileContainer}>
        {history.map((attempt) => {
          const hasFail = hasCutoffFail(attempt.subjects);
          return (
            <div key={attempt.id} className={styles.mobileItem}>
              <div className={styles.mobileHeader}>
                <h4 className={styles.mobileExamTitle}>
                  {attempt.examTitle}
                </h4>
                <span className={styles.mobileMeta}>
                  {attempt.attemptTitle} · {attempt.date}
                </span>
              </div>

              {/* 과목별 점수 리스트 */}
              {renderSubjectScores(attempt.subjects)}

              <div className={styles.mobileResultWrapper}>
                <span className={styles.mobileResultLabel}>결과</span>
                <div className={styles.mobileResultValue}>
                  <span className={styles.mobileResultScore}>
                    총점 <strong className="text-[#111111]">{attempt.totalScore}</strong>
                  </span>
                  <span className={attempt.isPassed ? styles.badgePassed : styles.badgeFailed}>
                    {attempt.isPassed ? "합격" : hasFail ? "불합격 (과락)" : "불합격"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {history.length === 0 && (
          <div className={styles.empty}>
            응시 이력이 존재하지 않습니다.
          </div>
        )}
      </div>

      {/* 2. 데스크톱 테이블 뷰 (hidden xl:block) */}
      <div className={styles.desktopContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.td}>시험 회차</th>
              <th className={styles.td}>응시 차수</th>
              <th className={styles.td}>응시 날짜</th>
              <th className={styles.td}>과목별 점수</th>
              <th className={`${styles.td} ${styles.tdCenter}`}>총점</th>
              <th className={`${styles.td} ${styles.tdCenter}`}>합격 여부</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {history.map((attempt) => {
              const hasFail = hasCutoffFail(attempt.subjects);
              return (
                <tr key={attempt.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdTextBold}`}>{attempt.examTitle}</td>
                  <td className={`${styles.td} ${styles.tdTextSecondary}`}>{attempt.attemptTitle}</td>
                  <td className={`${styles.td} ${styles.tdTextSecondary}`}>{attempt.date}</td>
                  <td className={styles.td}>{renderSubjectScores(attempt.subjects)}</td>
                  <td className={`${styles.td} ${styles.tdCenterBold}`}>{attempt.totalScore}</td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>
                    <span className={attempt.isPassed ? styles.badgePassedDesktop : styles.badgeFailedDesktop}>
                      {attempt.isPassed ? "합격" : hasFail ? "불합격 (과락)" : "불합격"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyDesktop}>
                  응시 이력이 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
