import React from "react";
import { Member, MemberRole } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { MemberRoleEditor } from "./MemberRoleEditor";
import styles from "./MemberMobileCardList.module.css";

interface MemberMobileCardListProps {
  members: Member[];
  currentUserId: string;
  grantableRoles: MemberRole[];
  onMemberUpdated: (member: Member) => void;
}

function display(value: string | null): string {
  return value?.trim() || "-";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ko-KR");
}

export function MemberMobileCardList({ members, currentUserId, grantableRoles, onMemberUpdated }: MemberMobileCardListProps) {
  return (
    <div className={styles.list}>
      {members.map((member) => (
        <div key={member.id} className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h4 className={styles.name}>
                {display(member.name)}
                {member.id === currentUserId && <span className={styles.selfBadge}>나</span>}
              </h4>
              <p className={styles.email}>{display(member.email)}</p>
            </div>
            <MemberStatusBadge status={member.status} />
          </div>

          <dl className={styles.stats}>
            <div><dt className={styles.statLabel}>전화번호</dt><dd className={styles.statValue}>{display(member.phoneNumber)}</dd></div>
            <div><dt className={styles.statLabel}>가입 경로</dt><dd className={styles.statValue}>{display(member.provider)}</dd></div>
            <div><dt className={styles.statLabel}>가입일</dt><dd className={styles.statValue}>{formatDate(member.createdAt)}</dd></div>
          </dl>
          <MemberRoleEditor
            key={`${member.id}:${member.roles.join(",")}`}
            member={member}
            currentUserId={currentUserId}
            grantableRoles={grantableRoles}
            onUpdated={onMemberUpdated}
          />
        </div>
      ))}
      {members.length === 0 && (
        <div className={styles.empty}>검색 조건에 맞는 회원이 없습니다.</div>
      )}
    </div>
  );
}
