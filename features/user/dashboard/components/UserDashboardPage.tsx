"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveStudyCard } from "./ActiveStudyCard";
import { ExamDDayCard } from "./ExamDDayCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { ExamSolvingModal } from "../../exam/components/ExamSolvingModal";
import { ExamRegistration, examRegistrationService } from "../../exam/services/examRegistrationService";

export function UserDashboardPage() {
  const router = useRouter();
  const { examDDayInfo } = useDashboardData();
  const [closestRegistration, setClosestRegistration] = useState<ExamRegistration | null>(null);
  const [solving, setSolving] = useState<ExamRegistration | null>(null);

  useEffect(() => {
    let active = true;
    void examRegistrationService.getRegistrations().then((registrations) => {
      if (!active) return;
      const next = registrations.filter((item) => item.status === "applied")
        .sort((left, right) => left.startsAt.localeCompare(right.startsAt))[0] ?? null;
      setClosestRegistration(next);
    }).catch((reason: unknown) => console.error("시험 신청 내역 조회 실패", reason));
    return () => { active = false; };
  }, []);

  return (
    <div className="flex-1 px-5 pt-6 pb-6 md:px-8 xl:p-8 space-y-6 text-[var(--color-text-primary)]">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
        <div className="xl:col-span-7 space-y-6">
          <ActiveStudyCard
            closestRegistration={closestRegistration}
            onStart={setSolving}
            onApplyExamClick={() => router.push("/exam-registration?openForm=true")}
          />
          <section className="space-y-3">
            <h3 className="text-[14px] font-bold text-[var(--color-primary)] tracking-widest uppercase">
              회차별 성적 현황
            </h3>
            <div className="bg-[var(--color-card-background)] rounded-2xl border border-[var(--color-border)] p-10 text-center text-[13px] text-[var(--color-text-secondary)]">
              제출 완료된 시험 성적이 없습니다.
            </div>
          </section>
        </div>
        <div className="xl:col-span-5 space-y-6">
          <ExamDDayCard {...examDDayInfo} />
        </div>
      </div>
      {solving ? (
        <ExamSolvingModal
          registrationId={solving.id}
          isOpen
          onClose={() => setSolving(null)}
          onSubmitted={() => setClosestRegistration(null)}
        />
      ) : null}
    </div>
  );
}
