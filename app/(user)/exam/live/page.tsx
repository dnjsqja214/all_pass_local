"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LiveExam() {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>응시할 시험을 선택해 주세요.</h1>
        <p className={styles.description}>
          시험을 선택하면 백엔드에서 응시 세션과 남은 시간을 불러옵니다.
        </p>
        <button
          type="button"
          onClick={() => router.push("/exams")}
          className={styles.selectButton}
        >
          시험 선택하기
        </button>
      </div>
    </div>
  );
}
