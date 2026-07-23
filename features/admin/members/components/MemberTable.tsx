import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { formatStudyTime } from "../../../learning/utils";
import styles from "./MemberTable.module.css";

interface MemberTableProps {
  members: Member[];
  onSelectMember: (memberId: string) => void;
}

// 점수 구간만 판정한다. 색은 CSS 가 정한다.
function scoreGrade(score: number) {
  if (score >= 180) return "high";
  if (score < 120) return "low";
  return "normal";
}

export function MemberTable({ members, onSelectMember }: MemberTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scroller}>
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>최근 접속일</th>
              <th>학습 상태</th>
              <th className={styles.center}>누적 공부 시간</th>
              <th className={styles.center}>최근 점수</th>
              <th className={styles.center}>누적 오답</th>
              <th className={styles.center}>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className={styles.name}>{member.name}</td>
                <td className={styles.email}>{member.email}</td>
                <td className={styles.date}>{member.joinedAt}</td>
                <td className={styles.date}>{member.lastLoginAt}</td>
                <td>
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className={styles.studyTime}>{formatStudyTime(member.studyMinutes)}</td>
                <td className={styles.score} data-grade={scoreGrade(member.recentScore)}>
                  {member.recentScore}점
                </td>
                <td className={styles.wrongCount}>{member.wrongAnswerCount}개</td>
                <td className={styles.actionCell}>
                  <button
                    onClick={() => onSelectMember(member.id)}
                    className={styles.detailButton}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.emptyCell}>
                  검색 조건에 맞는 회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
