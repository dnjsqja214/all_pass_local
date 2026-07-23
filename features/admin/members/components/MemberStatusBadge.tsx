import React from "react";
import type { MemberStatus } from "../types/member";
import styles from "./MemberStatusBadge.module.css";

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

const STATUS_LABELS: Record<MemberStatus, string> = {
  active: "정상",
  inactive: "비활성",
  risk: "위험군",
};

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  return (
    <span className={styles.badge} data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  );
}
