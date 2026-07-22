import React from "react";
import { TodoItem } from "../hooks/useDashboardData";
import styles from "./TodoItemCard.module.css";

interface TodoItemCardProps {
  todo: TodoItem;
}

export function TodoItemCard({ todo }: TodoItemCardProps) {
  // 상태에 따른 배지 스타일 지정
  const statusStyles = {
    wait: styles.statusWait,
    delayed: styles.statusDelayed,
    completed: styles.statusCompleted,
  };

  const styleClass = statusStyles[todo.status] || statusStyles.wait;

  return (
    <div className={styles.card}>
      <div className={styles.textGroup}>
        <h3 className={styles.title}>
          {todo.title}
        </h3>
        <p className={styles.subtitle}>
          {todo.subtitle}
        </p>
      </div>
      <span
        className={`${styles.statusBadge} ${styleClass}`}
      >
        {todo.statusText}
      </span>
    </div>
  );
}

