import React from "react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  isAlert?: boolean;
}

export function MetricCard({ title, value, subtitle, isAlert = false }: MetricCardProps) {
  return (
    <div className={`${styles.card} ${isAlert ? styles.cardAlert : ""}`}>
      <span className={styles.title}>
        {title}
      </span>
      <span className={`${styles.value} ${isAlert ? styles.valueAlert : ""}`}>
        {value}
      </span>
      <span className={`${styles.subtitle} ${isAlert ? styles.subtitleAlert : ""}`}>
        {subtitle}
      </span>
    </div>
  );
}

