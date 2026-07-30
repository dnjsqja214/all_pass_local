"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpenCheck, CalendarClock, Plus, Trash2, X } from "lucide-react";
import type {
  ExamRegistration,
  ExamSlot,
} from "../../../features/exam/services/examRegistrationService";
import {
  useCancelRegistrationMutation,
  useGetRegistrationsQuery,
  useLazyGetOpenExamSlotsQuery,
  useRegisterExamMutation,
} from "../../../features/exam/api/examRegistrationApi";
import { queryErrorMessage } from "../../../features/store/api/queryError";
import { WrongNoteModal } from "../../../features/exam/components/WrongNoteModal/WrongNoteModal";
import styles from "./page.module.css";

const dateTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", weekday: "short",
  hour: "2-digit", minute: "2-digit",
});

const seoulYearMonth = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul", year: "numeric", month: "numeric",
});

function getYearMonth(value: Date): { year: number; month: number } {
  const parts = seoulYearMonth.formatToParts(value);
  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
  };
}

const currentYearMonth = getYearMonth(new Date());
const YEAR_OPTIONS = [currentYearMonth.year - 1, currentYearMonth.year, currentYearMonth.year + 1];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
type RegistrationFilterStatus = "applied" | "cancelled" | "completed" | "missed";

function displayStatus(registration: ExamRegistration, now: number): RegistrationFilterStatus {
  if (registration.status === "cancelled") return "cancelled";
  if (registration.status === "completed") return "completed";
  if (new Date(registration.entryClosesAt).getTime() < now) return "missed";
  return "applied";
}

function statusLabel(status: RegistrationFilterStatus): string {
  if (status === "applied") return "신청 중";
  if (status === "cancelled") return "신청 취소";
  if (status === "completed") return "응시 완료";
  return "미응시";
}

function sortByLatestActivity(items: ExamRegistration[]): ExamRegistration[] {
  return [...items].sort((left, right) =>
    (right.updatedAt ?? right.appliedAt).localeCompare(left.updatedAt ?? left.appliedAt));
}

function findScheduleConflict(slot: ExamSlot, registrations: ExamRegistration[]): ExamRegistration | undefined {
  const slotStartsAt = new Date(slot.startsAt).getTime();
  const slotEndsAt = slotStartsAt + slot.durationMinutes * 60_000;
  return registrations.find((registration) => {
    if (registration.status !== "applied") return false;
    const registrationStartsAt = new Date(registration.startsAt).getTime();
    const registrationEndsAt = registrationStartsAt + registration.durationMinutes * 60_000;
    return registrationStartsAt < slotEndsAt && registrationEndsAt > slotStartsAt;
  });
}

export default function ExamRegistrationPage() {
  const registrationsQuery = useGetRegistrationsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const registrations = useMemo(
    () => sortByLatestActivity(
      registrationsQuery.data?.registrations ?? [],
    ),
    [registrationsQuery.data],
  );
  const [getOpenSlots, openSlotsQuery] = useLazyGetOpenExamSlotsQuery();
  const slots = openSlotsQuery.data ?? [];
  const [registerExam] = useRegisterExamMutation();
  const [cancelRegistration] = useCancelRegistrationMutation();
  const isLoading = registrationsQuery.isLoading;
  const isSlotsLoading = openSlotsQuery.isFetching;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [selectionNotice, setSelectionNotice] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(currentYearMonth.year);
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth.month);
  const [selectedStatuses, setSelectedStatuses] = useState<RegistrationFilterStatus[]>([
    "applied", "cancelled", "completed", "missed",
  ]);
  const [now, setNow] = useState(() => Date.now());
  const [wrongNoteRegistrationId, setWrongNoteRegistrationId] = useState<string | null>(null);

  const openRegistrationForm = useCallback(async () => {
    setIsFormOpen(true);
    setSlotError(null);
    setSelectionNotice(null);
    setSelectedSlotId(null);
    try {
      const nextSlots = await getOpenSlots().unwrap();
      setSelectedExamId(nextSlots[0]?.examId ?? null);
    } catch (reason: unknown) {
      setSlotError(queryErrorMessage(
        reason,
        "신청 가능한 시험 회차를 불러오지 못했습니다.",
      ));
    }
  }, [
    getOpenSlots,
    setIsFormOpen,
    setSelectionNotice,
    setSelectedExamId,
    setSelectedSlotId,
    setSlotError,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("openForm") === "true") {
        void openRegistrationForm();
        window.history.replaceState({}, "", window.location.pathname);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [openRegistrationForm]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const availableExams = Array.from(slots.reduce((items, slot) => {
    const current = items.get(slot.examId);
    items.set(slot.examId, current
      ? { ...current, slotCount: current.slotCount + 1 }
      : { examId: slot.examId, title: slot.examTitle, subject: slot.subject, round: slot.round, slotCount: 1 });
    return items;
  }, new Map<string, { examId: string; title: string; subject: string; round: number; slotCount: number }>()).values());
  const effectiveSelectedExamId = selectedExamId && availableExams.some((exam) => exam.examId === selectedExamId)
    ? selectedExamId
    : availableExams[0]?.examId ?? null;
  const selectedExamSlots = effectiveSelectedExamId
    ? slots.filter((slot) => slot.examId === effectiveSelectedExamId)
    : [];

  const visibleRegistrations = registrations.filter((registration) => {
    const { year, month } = getYearMonth(new Date(registration.startsAt));
    return year === selectedYear && month === selectedMonth && selectedStatuses.includes(displayStatus(registration, now));
  });

  const toggleStatus = (status: RegistrationFilterStatus) => {
    setSelectedStatuses((current) => current.includes(status)
      ? current.filter((value) => value !== status)
      : [...current, status]);
  };

  const register = async () => {
    if (!selectedSlotId) return;
    const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
    if (!selectedSlot) {
      setError("선택한 시험 일정을 찾을 수 없습니다.");
      return;
    }
    setPendingId(selectedSlotId);
    try {
      await registerExam(selectedSlot).unwrap();
      setSelectedExamId(null);
      setSelectedSlotId(null);
      setIsFormOpen(false);
    } catch (reason: unknown) {
      setSelectionNotice(queryErrorMessage(reason, "시험 신청에 실패했습니다."));
    } finally {
      setPendingId(null);
    }
  };

  const cancel = async (registration: ExamRegistration) => {
    if (!window.confirm(`${registration.examTitle} 신청을 취소할까요?`)) return;
    setPendingId(registration.id);
    try {
      await cancelRegistration(registration.id).unwrap();
    } catch (reason: unknown) {
      setError(queryErrorMessage(reason, "시험 신청 취소에 실패했습니다."));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div><h1>시험 신청 목록</h1><p>관리자가 개설한 시험 회차 중 원하는 일정을 선택합니다.</p></div>
        <button type="button" onClick={() => void openRegistrationForm()}><Plus /> 신청 추가</button>
      </div>
      {error || registrationsQuery.error ? (
        <div className={styles.error}>
          {error ?? queryErrorMessage(
            registrationsQuery.error,
            "시험 신청 내역을 불러오지 못했습니다.",
          )}
          <button onClick={() => void registrationsQuery.refetch()}>다시 시도</button>
        </div>
      ) : null}
      <div className={styles.filters}>
        <div className={styles.filterGroup}><strong>연도</strong><div className={styles.filterTabs}>{YEAR_OPTIONS.map((year) => (
          <button key={year} type="button" data-selected={selectedYear === year} onClick={() => setSelectedYear(year)}>{year}년</button>
        ))}</div></div>
        <div className={styles.filterGroup}><strong>월</strong><div className={styles.filterTabs}>{MONTH_OPTIONS.map((month) => (
          <button key={month} type="button" data-selected={selectedMonth === month} onClick={() => setSelectedMonth(month)}>{month}월</button>
        ))}</div></div>
        <div className={styles.filterGroup}><strong>상태</strong><div className={styles.statusChecks}>
          <label><input type="checkbox" checked={selectedStatuses.includes("applied")} onChange={() => toggleStatus("applied")} /> 신청 중</label>
          <label><input type="checkbox" checked={selectedStatuses.includes("cancelled")} onChange={() => toggleStatus("cancelled")} /> 신청 취소</label>
          <label><input type="checkbox" checked={selectedStatuses.includes("completed")} onChange={() => toggleStatus("completed")} /> 응시 완료</label>
          <label><input type="checkbox" checked={selectedStatuses.includes("missed")} onChange={() => toggleStatus("missed")} /> 미응시</label>
          <span>{visibleRegistrations.length}건</span>
        </div></div>
      </div>
      {isLoading ? <div className={styles.empty}>시험 신청 내역을 불러오는 중입니다.</div> : visibleRegistrations.length ? (
        <div className={styles.list}>{visibleRegistrations.map((registration) => (
          <article key={registration.id} className={styles.card}>
            <div className={styles.icon}><CalendarClock /></div>
            <div className={styles.cardBody}>
              <div className={styles.tags}><span>{registration.round}회</span><span>{registration.durationMinutes}분</span><span className={styles.status} data-status={displayStatus(registration, now)}>{statusLabel(displayStatus(registration, now))}</span></div>
              <h2>{registration.examTitle}</h2>
              <p>{dateTime.format(new Date(registration.startsAt))} · {registration.subject}</p>
              <p className={styles.entry}>입장 마감 {dateTime.format(new Date(registration.entryClosesAt))}</p>
            </div>
            {displayStatus(registration, now) === "applied" ? (
              <button className={styles.cancel} disabled={pendingId === registration.id} onClick={() => void cancel(registration)}>
                <Trash2 /> {pendingId === registration.id ? "취소 중" : "신청 취소"}
              </button>
            ) : displayStatus(registration, now) === "completed" ? (
              <div className={styles.completedActions}>
                {registration.gradingStatus === "graded" ? (
                  <button
                    className={styles.wrongNotesButton}
                    type="button"
                    onClick={() => setWrongNoteRegistrationId(registration.id)}
                  >
                    <BookOpenCheck /> 오답 노트
                  </button>
                ) : (
                  <button className={styles.wrongNotesButton} type="button" disabled title="채점 완료 후 확인할 수 있습니다.">
                    <BookOpenCheck /> 오답 노트
                  </button>
                )}
                <div className={styles.score} data-pending={registration.gradingStatus === "pending"}>
                  <span>점수</span>
                  <strong>{registration.gradingStatus === "graded" && registration.score !== null
                    ? `${registration.score}점`
                    : "채점 대기"}</strong>
                </div>
              </div>
            ) : null}
          </article>
        ))}</div>
      ) : <div className={styles.empty}>선택한 연도·월·상태에 해당하는 신청 내역이 없습니다.</div>}

      {isFormOpen ? <div className={styles.backdrop} role="presentation">
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="slot-title">
          <div className={styles.modalHeader}><div><h2 id="slot-title">시험 회차 선택</h2><p>시험을 선택한 뒤 정책에 따라 개설된 응시 일자를 선택하세요.</p></div><button aria-label="닫기" onClick={() => setIsFormOpen(false)}><X /></button></div>
          {isSlotsLoading ? <div className={styles.empty}>신청 가능한 시험 회차를 불러오는 중입니다.</div> : slotError ? (
            <div className={styles.error}>{slotError}<button onClick={() => void openRegistrationForm()}>다시 시도</button></div>
          ) : slots.length ? <div className={styles.slotPicker}>
            <section className={styles.examPicker}><h3>시험 과목</h3><div className={styles.examOptions}>{availableExams.map((exam) => (
              <button key={exam.examId} type="button" data-selected={effectiveSelectedExamId === exam.examId} onClick={() => { setSelectedExamId(exam.examId); setSelectedSlotId(null); setSelectionNotice(null); }}>
                <strong>{exam.title}</strong><span>{exam.subject} · {exam.slotCount}개 일자</span>
              </button>
            ))}</div></section>
            <section className={styles.datePicker}><h3>응시 일자</h3><div className={styles.slotList}>{selectedExamSlots.map((slot) => {
              const conflict = findScheduleConflict(slot, registrations);
              return (
                <label key={slot.id} className={styles.slot} data-selected={selectedSlotId === slot.id} data-conflict={Boolean(conflict)}
                  aria-disabled={Boolean(conflict)} onClick={(event) => {
                    if (!conflict) return;
                    event.preventDefault();
                    setSelectedSlotId(null);
                    setSelectionNotice(`${conflict.examTitle} 응시 일정과 시간이 겹쳐 선택할 수 없습니다.`);
                  }}>
                  <input type="radio" name="slot" value={slot.id} disabled={Boolean(conflict)} checked={selectedSlotId === slot.id}
                    onChange={() => { setSelectedSlotId(slot.id); setSelectionNotice(null); }} />
                  <span><strong>{dateTime.format(new Date(slot.startsAt))}</strong><small>{slot.durationMinutes}분 · 입장 마감 {dateTime.format(new Date(slot.entryClosesAt))}</small></span>
                  {conflict ? <em className={styles.slotConflict}>{conflict.examTitle}<small>신청 중</small></em> : null}
                </label>
              );
            })}</div>{selectionNotice ? <p className={styles.selectionNotice} role="status">{selectionNotice}</p> : null}</section>
          </div> : <div className={styles.empty}>현재 신청 가능한 시험 회차가 없습니다.</div>}
          <div className={styles.modalActions}><button className={styles.secondary} onClick={() => setIsFormOpen(false)}>닫기</button><button disabled={isSlotsLoading || !selectedSlotId || pendingId !== null} onClick={() => void register()}>{pendingId ? "신청 중" : "선택한 회차 신청"}</button></div>
        </div>
      </div> : null}
      {wrongNoteRegistrationId ? (
        <WrongNoteModal
          registrationId={wrongNoteRegistrationId}
          onClose={() => setWrongNoteRegistrationId(null)}
        />
      ) : null}
    </section>
  );
}
