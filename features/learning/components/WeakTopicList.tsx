import React from "react";
import { WeakTopic } from "../types";
import styles from "./WeakTopicList.module.css";

interface WeakTopicListProps {
  weakTopics: WeakTopic[];
}

export function WeakTopicList({ weakTopics }: WeakTopicListProps) {
  const hasChapterData = weakTopics.some((topic) => topic.basis === "CHAPTER");
  const title = hasChapterData ? "취약 단원 TOP 3" : "취약 과목 TOP 3";
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.list}>
        {weakTopics.slice(0, 3).map((item, idx) => (
          <div key={idx} className={styles.row}>
            <span className={styles.topic}>
              {idx + 1}. {item.topic}
            </span>
            <span className={styles.wrongCount}>오답 {item.wrongCount}회</span>
          </div>
        ))}
        {weakTopics.length === 0 && (
          <div className={styles.empty}>감지된 취약 단원이 없습니다.</div>
        )}
      </div>
      {weakTopics.length > 0 && (
        <div className={styles.tip}>
          실제 오답이 많이 누적된 영역부터 오답 노트를 확인해 보세요.
        </div>
      )}
    </div>
  );
}
