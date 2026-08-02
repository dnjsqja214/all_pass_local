"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveStudyCard } from "@/features/dashboard/components/ActiveStudyCard";
import { DashboardContentCard } from "@/features/dashboard/components/DashboardContentCard/DashboardContentCard";
import { RecentResultPanel } from "@/features/dashboard/components/RecentResultPanel/RecentResultPanel";
import { useGetDashboardContentQuery } from "@/features/dashboard/api/dashboardContentApi";
import { ExamSolvingModal } from "@/features/exam/components/ExamSolvingModal";
import { WrongNoteModal } from "@/features/exam/components/WrongNoteModal/WrongNoteModal";
import { useGetOpenExamSlotsQuery, useGetRegistrationsQuery } from "@/features/exam/api/examRegistrationApi";
import type { ExamRegistration } from "@/features/exam/services/examRegistrationService";
import { PermissionRequiredModal } from "@/features/auth/components/PermissionRequiredModal/PermissionRequiredModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const isMember = (user?.roles ?? []).includes("MEMBER");
  const [solving, setSolving] = useState<ExamRegistration | null>(null);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [wrongNoteRegistrationId, setWrongNoteRegistrationId] = useState<string | null>(null);

  // 멤버 권한이 없으면 신청·응시로 넘어가지 않고 안내 모달만 띄운다.
  const handleApplyExam = () => {
    if (!isMember) { setPermissionOpen(true); return; }
    router.push("/exam-registration?openForm=true");
  };
  const handleStart = (registration: ExamRegistration) => {
    if (!isMember) { setPermissionOpen(true); return; }
    setSolving(registration);
  };
  const dashboardQuery = useGetDashboardContentQuery();
  const registrationsQuery = useGetRegistrationsQuery(undefined, {
    refetchOnReconnect: true,
  });
  const openSlotsQuery = useGetOpenExamSlotsQuery(undefined, {
    refetchOnReconnect: true,
  });
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
            registrations={registrationsQuery.data?.registrations ?? []}
            openSlots={openSlotsQuery.data ?? []}
            serverNow={registrationsQuery.data?.serverNow}
            isLoading={registrationsQuery.isLoading || openSlotsQuery.isLoading}
            onStart={handleStart}
            onApplyExamClick={handleApplyExam}
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
      <PermissionRequiredModal isOpen={permissionOpen} onClose={() => setPermissionOpen(false)} />
    </div>
  );
}
