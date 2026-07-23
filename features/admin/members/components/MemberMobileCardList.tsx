import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { formatStudyTime } from "../../../learning/utils";
import styles from "./MemberMobileCardList.module.css";

interface MemberMobileCardListProps {
  members: Member[];
  onSelectMember: (memberId: string) => void;
}

// 점수 구간만 판정한다. 색은 CSS 가 정한다.
function scoreGrade(score: number) {
  if (score >= 180) return "high";
  if (score < 120) return "low";
  return "normal";
}

export function MemberMobileCardList({
  members,
  onSelectMember,
}: MemberMobileCardListProps) {
  return (
    <div className={styles.list}>
      {members.map((member) => (
        <div key={member.id} className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h4 className={styles.name}>{member.name}</h4>
              <p className={styles.email}>{member.email}</p>
            </div>
            <MemberStatusBadge status={member.status} />
          </div>

          <div className={styles.stats}>
            <div>
              <span className={styles.statLabel}>최근 점수</span>
              <strong className={styles.statValue} data-grade={scoreGrade(member.recentScore)}>
                {member.recentScore}점
              </strong>
            </div>
            <div>
              <span className={styles.statLabel}>공부 시간</span>
              <strong className={styles.statValue}>{formatStudyTime(member.studyMinutes)}</strong>
            </div>
          </div>

          <button onClick={() => onSelectMember(member.id)} className={styles.detailButton}>
            상세보기
          </button>
        </div>
      ))}
      {members.length === 0 && (
        <div className={styles.empty}>검색 조건에 맞는 회원이 없습니다.</div>
      )}
    </div>
  );
}
