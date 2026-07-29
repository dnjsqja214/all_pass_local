import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { MemberRoleEditor } from "./MemberRoleEditor";
import styles from "./MemberTable.module.css";

interface MemberTableProps {
  members: Member[];
  currentUserId: string;
  onMemberUpdated: (member: Member) => void;
}

function display(value: string | null): string {
  return value?.trim() || "-";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ko-KR");
}

export function MemberTable({ members, currentUserId, onMemberUpdated }: MemberTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scroller}>
        <table>
          <thead>
            <tr>
              <th>회원</th>
              <th>전화번호</th>
              <th>상태</th>
              <th>가입 경로</th>
              <th>가입일</th>
              <th>권한</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className={styles.name}>
                    {display(member.name)}
                    {member.id === currentUserId && <span className={styles.selfBadge}>나</span>}
                  </div>
                  <div className={styles.email}>{display(member.email)}</div>
                </td>
                <td className={styles.date}>{display(member.phoneNumber)}</td>
                <td>
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className={styles.date}>{display(member.provider)}</td>
                <td className={styles.date}>{formatDate(member.createdAt)}</td>
                <td>
                  <MemberRoleEditor
                    key={`${member.id}:${member.roles.join(",")}`}
                    member={member}
                    currentUserId={currentUserId}
                    onUpdated={onMemberUpdated}
                  />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
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
