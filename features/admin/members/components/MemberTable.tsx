import React from "react";
import { Member } from "../types/member";
import { MemberStatusBadge } from "./MemberStatusBadge";
import styles from "./MemberTable.module.css";

interface MemberTableProps {
  members: Member[];
}

function display(value: string | null): string {
  return value?.trim() || "-";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ko-KR");
}

export function MemberTable({ members }: MemberTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scroller}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>인증 UUID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>상태</th>
              <th>가입 경로</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className={styles.identifier}>{member.id}</td>
                <td className={styles.identifier}>{member.authUuid}</td>
                <td className={styles.name}>{display(member.name)}</td>
                <td className={styles.email}>{display(member.email)}</td>
                <td className={styles.date}>{display(member.phoneNumber)}</td>
                <td>
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className={styles.date}>{display(member.provider)}</td>
                <td className={styles.date}>{formatDate(member.createdAt)}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyCell}>
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
