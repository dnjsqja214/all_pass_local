"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveStudyCard } from "@/features/dashboard/components/ActiveStudyCard";
import { DashboardContentCard } from "@/features/dashboard/components/DashboardContentCard/DashboardContentCard";
import { RecentResultPanel } from "@/features/dashboard/components/RecentResultPanel/RecentResultPanel";
import { useGetDashboardContentQuery } from "@/features/dashboard/api/dashboardContentApi";
import { ExamSolvingModal } from "@/features/exam/components/ExamSolvingModal";
import { WrongNoteModal } from "@/features/exam/components/WrongNoteModal/WrongNoteModal";
import { useGetRegistrationsQuery } from "@/features/exam/api/examRegistrationApi";
import type { ExamRegistration } from "@/features/exam/services/examRegistrationService";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [solving, setSolving] = useState<ExamRegistration | null>(null);
  const [wrongNoteRegistrationId, setWrongNoteRegistrationId] = useState<string | null>(null);
  const dashboardQuery = useGetDashboardContentQuery();
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
  const completedRegistrations = useMemo(
    () => (registrationsQuery.data?.registrations ?? [])
      .filter((item) => item.status === "completed" && item.gradingStatus === "graded")
      .sort((left, right) => (right.updatedAt ?? right.appliedAt)
        .localeCompare(left.updatedAt ?? left.appliedAt))
      .slice(0, 3),
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
          <RecentResultPanel registrations={completedRegistrations} onOpenWrongNote={setWrongNoteRegistrationId} />
        </div>
        <div className={styles.sideColumn}>
          <DashboardContentCard
            content={dashboardQuery.data}
            isLoading={dashboardQuery.isLoading}
            error={dashboardQuery.error ? "대시보드 안내를 불러오지 못했습니다." : null}
          />
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
      {wrongNoteRegistrationId ? (
        <WrongNoteModal registrationId={wrongNoteRegistrationId} onClose={() => setWrongNoteRegistrationId(null)} />
      ) : null}
    </div>
  );
}
