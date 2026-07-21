"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Plus, Trash2, X } from "lucide-react";
import {
  ExamRegistration,
  ExamSlot,
  examRegistrationService,
} from "../../../features/exam/services/examRegistrationService";
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
  const [registrations, setRegistrations] = useState<ExamRegistration[]>([]);
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
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

  const loadRegistrations = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const nextRegistrations = await examRegistrationService.getRegistrations(signal);
      setRegistrations(sortByLatestActivity(nextRegistrations));
    } catch (reason: unknown) {
      if (!signal?.aborted) setError(reason instanceof Error ? reason.message : "시험 신청 내역을 불러오지 못했습니다.");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  const openRegistrationForm = useCallback(async (signal?: AbortSignal) => {
    setIsFormOpen(true);
    setIsSlotsLoading(true);
    setSlotError(null);
    setSelectionNotice(null);
    setSelectedSlotId(null);
    try {
      const nextSlots = await examRegistrationService.getOpenSlots(signal);
      setSlots(nextSlots);
      setSelectedExamId(nextSlots[0]?.examId ?? null);
    } catch (reason: unknown) {
      if (!signal?.aborted) setSlotError(reason instanceof Error ? reason.message : "신청 가능한 시험 회차를 불러오지 못했습니다.");
    } finally {
      if (!signal?.aborted) setIsSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void loadRegistrations(controller.signal);
      if (new URLSearchParams(window.location.search).get("openForm") === "true") {
        void openRegistrationForm(controller.signal);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }, 0);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [loadRegistrations, openRegistrationForm]);

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
      const created = await examRegistrationService.registerExam(selectedSlot);
      setRegistrations((current) => sortByLatestActivity([...current, created]));
      setSelectedExamId(null);
      setSelectedSlotId(null);
      setIsFormOpen(false);
    } catch (reason: unknown) {
      setSelectionNotice(reason instanceof Error ? reason.message : "시험 신청에 실패했습니다.");
    } finally {
      setPendingId(null);
    }
  };

  const cancel = async (registration: ExamRegistration) => {
    if (!window.confirm(`${registration.examTitle} 신청을 취소할까요?`)) return;
    setPendingId(registration.id);
    try {
      await examRegistrationService.cancelRegistration(registration.id);
      setRegistrations((current) => sortByLatestActivity(current.map((item) => item.id === registration.id
        ? { ...item, status: "cancelled", updatedAt: new Date().toISOString() }
        : item)));
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "시험 신청 취소에 실패했습니다.");
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
      {error ? <div className={styles.error}>{error}<button onClick={() => void loadRegistrations()}>다시 시도</button></div> : null}
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
            {displayStatus(registration, now) === "applied" ? <button className={styles.cancel} disabled={pendingId === registration.id} onClick={() => void cancel(registration)}><Trash2 /> {pendingId === registration.id ? "취소 중" : "신청 취소"}</button> : null}
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
    </section>
  );
}
