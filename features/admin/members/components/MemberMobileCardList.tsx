import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import styles from "./MemberMobileCardList.module.css";

interface MemberMobileCardListProps {
  members: Member[];
}

function display(value: string | null): string {
  return value?.trim() || "-";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ko-KR");
}

export function MemberMobileCardList({ members }: MemberMobileCardListProps) {
  return (
    <div className={styles.list}>
      {members.map((member) => (
        <div key={member.id} className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h4 className={styles.name}>{display(member.name)}</h4>
              <p className={styles.email}>{display(member.email)}</p>
            </div>
            <MemberStatusBadge status={member.status} />
          </div>

          <dl className={styles.stats}>
            <div><dt className={styles.statLabel}>ID</dt><dd className={styles.statValue}>{member.id}</dd></div>
            <div><dt className={styles.statLabel}>인증 UUID</dt><dd className={styles.statValue}>{member.authUuid}</dd></div>
            <div><dt className={styles.statLabel}>전화번호</dt><dd className={styles.statValue}>{display(member.phoneNumber)}</dd></div>
            <div><dt className={styles.statLabel}>가입 경로</dt><dd className={styles.statValue}>{display(member.provider)}</dd></div>
            <div><dt className={styles.statLabel}>가입일</dt><dd className={styles.statValue}>{formatDate(member.createdAt)}</dd></div>
          </dl>
        </div>
      ))}
      {members.length === 0 && (
        <div className={styles.empty}>검색 조건에 맞는 회원이 없습니다.</div>
      )}
    </div>
  );
}
