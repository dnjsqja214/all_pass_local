"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function SolvePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/exam-registration"); }, [router]);
  return <div className={styles.state}>신청한 시험 회차를 확인하는 중입니다.</div>;
}
