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
  result: "ABOVE_AVERAGE" | "BELOW_AVERAGE" | "CUTOFF_RISK";
  subjects: ExamSubjectScore[];
}

interface ExamHistoryListProps {
  history: ExamHistoryItem[];
}

// 점수 색 구분. 실제 색은 CSS 가 정한다.
function scoreTone(sub: ExamSubjectScore) {
  if (sub.isFailed) return "failed";
  if (sub.score >= 60) return "good";
  return "default";
}

export function ExamHistoryList({ history }: ExamHistoryListProps) {
  const renderSubjectScores = (subjects: ExamSubjectScore[]) => (
    <div className={styles.subjectScores}>
      {subjects.map((sub, idx) => (
        <span key={idx} className={styles.subject}>
          <span>{sub.name}</span>
          <span className={styles.subjectScore} data-tone={scoreTone(sub)}>
            {sub.score}
          </span>
          {idx < subjects.length - 1 && <span className={styles.separator}>·</span>}
        </span>
      ))}
    </div>
  );

  const resultLabel = (attempt: ExamHistoryItem) =>
    attempt.result === "ABOVE_AVERAGE"
      ? "60점 이상"
      : attempt.result === "CUTOFF_RISK" ? "40점 미만" : "40~59점";

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>회차별 응시 이력</h3>

      {/* 1. 모바일 및 태블릿 리스트 뷰 */}
      <div className={styles.mobileList}>
        {history.map((attempt) => (
          <div key={attempt.id} className={styles.item}>
            <div className={styles.itemHead}>
              <h4 className={styles.examTitle}>{attempt.examTitle}</h4>
              <span className={styles.attemptInfo}>
                {attempt.attemptTitle} · {attempt.date}
              </span>
            </div>

            {/* 과목별 점수 리스트 */}
            {renderSubjectScores(attempt.subjects)}

            <div className={styles.itemFoot}>
              <span className={styles.footLabel}>결과</span>
              <div className={styles.footRight}>
                <span className={styles.totalScore}>
                  총점 <strong>{attempt.totalScore}</strong>
                </span>
                <span className={styles.resultBadge} data-passed={attempt.result === "ABOVE_AVERAGE"}>
                  {resultLabel(attempt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className={styles.emptyText}>응시 이력이 존재하지 않습니다.</div>
        )}
      </div>

      {/* 2. 데스크톱 테이블 뷰 */}
      <div className={styles.desktopTable}>
        <table>
          <thead>
            <tr>
              <th>시험 회차</th>
              <th>응시 차수</th>
              <th>응시 날짜</th>
              <th>과목별 점수</th>
              <th className={styles.center}>총점</th>
              <th className={styles.center}>점수 상태</th>
            </tr>
          </thead>
          <tbody>
            {history.map((attempt) => (
              <tr key={attempt.id}>
                <td className={styles.cellExam}>{attempt.examTitle}</td>
                <td className={styles.cellMuted}>{attempt.attemptTitle}</td>
                <td className={styles.cellMuted}>{attempt.date}</td>
                <td>{renderSubjectScores(attempt.subjects)}</td>
                <td className={styles.cellTotal}>{attempt.totalScore}</td>
                <td className={styles.center}>
                  <span className={styles.resultBadge} data-passed={attempt.result === "ABOVE_AVERAGE"}>
                    {resultLabel(attempt)}
                  </span>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
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
