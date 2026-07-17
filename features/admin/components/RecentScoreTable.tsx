import React from "react";
import { MemberScore } from "../hooks/adminData";
import cardStyles from "./AdminCard.module.css";
import styles from "./RecentScoreTable.module.css";

interface RecentScoreTableProps {
  scores: MemberScore[];
}

export function RecentScoreTable({ scores }: RecentScoreTableProps) {
  // 과목 점수 렌더러
  const renderScore = (score: number | "미제출") => {
    if (score === "미제출") {
      return <span className={styles.scoreUnsubmitted}>미제출</span>;
    }
    if (score < 40) {
      return <span className={styles.scoreFail}>{score}</span>;
    }
    if (score >= 60) {
      return <span className={styles.scorePass}>{score}</span>;
    }
    return <span className={styles.scoreNormal}>{score}</span>;
  };

  // 총점 합격 여부 렌더러
  const renderTotalScore = (total: number | "-", hasFail: boolean) => {
    if (total === "-") {
      return <span className={styles.totalUnsubmitted}>-</span>;
    }
    // 합격 기준: 총점 180점 이상 & 과목별 과락(40점 미만) 없음
    if (total >= 180 && !hasFail) {
      return <span className={styles.totalPass}>{total}</span>;
    }
    if (hasFail) {
      return <span className={styles.totalFail}>{total}</span>;
    }
    return <span className={styles.totalNormal}>{total}</span>;
  };

  // 추이 렌더러
  const renderTrend = (trend: "up" | "down" | "flat") => {
    switch (trend) {
      case "up":
        return <span className={styles.trendUp}>▲</span>;
      case "down":
        return <span className={styles.trendDown}>▼</span>;
      case "flat":
        return <span className={styles.trendFlat}>━</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cardStyles.card}>
      <div className={cardStyles.header}>
        <h4 className={cardStyles.title}>
          회원별 최근 점수
        </h4>
        <p className={cardStyles.subtitle}>
          회차별 정답지 채점 점수 및 최근 변동 추이 요약
        </p>
      </div>

      {/* 테이블 가로 스크롤 대응 */}
      <div className={styles.scrollWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              <th className={styles.th}>회원</th>
              <th className={styles.th}>최근 회차</th>
              <th className={styles.th}>중개</th>
              <th className={styles.th}>공법</th>
              <th className={styles.th}>세법</th>
              <th className={styles.thCenter}>총점</th>
              <th className={styles.thCenter}>추이</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E0D9] text-[13px]">
            {scores.map((score) => {
              // 과락(40점 미만) 여부 계산
              const hasFail = score.subjectScores.some(
                (s) => typeof s.score === "number" && s.score < 40
              );

              return (
                <tr key={score.id} className={styles.trBody}>
                  <td className={styles.td}>
                    <div className={styles.memberCell}>
                      <div className={styles.avatar}>
                        {score.avatarText}
                      </div>
                      <span className={styles.memberName}>{score.name}</span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.roundText}`}>{score.recentRound}</td>
                  <td className={styles.td}>{renderScore(score.subjectScores[0]?.score)}</td>
                  <td className={styles.td}>{renderScore(score.subjectScores[1]?.score)}</td>
                  <td className={styles.td}>{renderScore(score.subjectScores[2]?.score)}</td>
                  <td className={styles.tdCenter}>
                    {renderTotalScore(score.totalScore, hasFail)}
                  </td>
                  <td className={styles.tdCenter}>{renderTrend(score.trend)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

