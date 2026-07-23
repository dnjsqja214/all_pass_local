import React from "react";
import { WeakTopic } from "../types";
import styles from "./WeakTopicList.module.css";

interface WeakTopicListProps {
  weakTopics: WeakTopic[];
}

export function WeakTopicList({ weakTopics }: WeakTopicListProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>취약 단원 TOP 3</h4>
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
          💡 상위 취약 단원에 대한 개념 오답 노트를 적극 활용하여 이론을 보강하세요.
        </div>
      )}
    </div>
  );
}
