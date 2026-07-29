import React from "react";
import type { MemberStatus } from "../types/member";
import styles from "./MemberStatusBadge.module.css";

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

const STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  DORMANT: "휴면",
  DELETED: "탈퇴",
};

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  return (
    <span className={styles.badge} data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  );
}
