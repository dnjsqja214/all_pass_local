"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveStudyCard } from "@/features/dashboard/components/ActiveStudyCard";
import { ExamDDayCard } from "@/features/dashboard/components/ExamDDayCard";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { ExamSolvingModal } from "@/features/exam/components/ExamSolvingModal";
import { useGetRegistrationsQuery } from "@/features/exam/api/examRegistrationApi";
import type { ExamRegistration } from "@/features/exam/services/examRegistrationService";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { examDDayInfo } = useDashboardData();
  const [solving, setSolving] = useState<ExamRegistration | null>(null);
  const registrationsQuery = useGetRegistrationsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const closestRegistration = useMemo(
    () => registrationsQuery.data?.registrations
      .filter((item) => item.status === "applied")
      .sort((left, right) =>
        left.startsAt.localeCompare(right.startsAt))[0] ?? null,
    [registrationsQuery.data],
  );

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <ActiveStudyCard
            closestRegistration={closestRegistration}
            onStart={setSolving}
            onApplyExamClick={() => router.push("/exam-registration?openForm=true")}
          />
          <section className={styles.scoreSection}>
            <h3 className={styles.sectionTitle}>회차별 성적 현황</h3>
            <div className={styles.emptyBox}>제출 완료된 시험 성적이 없습니다.</div>
          </section>
        </div>
        <div className={styles.sideColumn}>
          <ExamDDayCard {...examDDayInfo} />
        </div>
      </div>
      {solving ? (
        <ExamSolvingModal
          registrationId={solving.id}
          endReminders={solving.endReminders}
          isOpen
          onClose={() => setSolving(null)}
          onSubmitted={() => void registrationsQuery.refetch()}
        />
      ) : null}
    </div>
  );
}
