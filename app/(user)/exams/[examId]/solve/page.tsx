"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SolvePage() {
  const router = useRouter();
  useEffect(() => { router.replace("/exam-registration"); }, [router]);
  return <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)] font-bold">신청한 시험 회차를 확인하는 중입니다.</div>;
}
