import React from "react";
import { WeeklyStat } from "../hooks/useDashboardData";
import styles from "./StatSummaryCard.module.css";

interface StatSummaryCardProps {
  stats: WeeklyStat[];
}

export function StatSummaryCard({ stats }: StatSummaryCardProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={styles.item}
        >
          <span className={styles.value}>
            {stat.value}
          </span>
          <span className={styles.label}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

