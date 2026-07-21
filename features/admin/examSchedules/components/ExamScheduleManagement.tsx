"use client";

import { FormEvent, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, Check, Pencil, Plus, Power, X } from "lucide-react";
import { examService } from "../../../exam/services/examService";
import { ExamListItem } from "../../../exam/types/exam";
import { examScheduleService, ExamSchedulePolicy } from "../services/examScheduleService";
import styles from "./ExamScheduleManagement.module.css";

const WEEKDAYS = [
  { value: 1, label: "월" }, { value: 2, label: "화" }, { value: 3, label: "수" },
  { value: 4, label: "목" }, { value: 5, label: "금" }, { value: 6, label: "토" },
  { value: 7, label: "일" },
];

const TIME_OPTIONS = Array.from({ length: 12 }, (_, index) => `${String(index + 9).padStart(2, "0")}:00`);
const PERIODS = [
  { key: "week", label: "1주일" },
  { key: "month", label: "1개월" },
  { key: "threeMonths", label: "3개월" },
  { key: "sixMonths", label: "6개월" },
  { key: "year", label: "1년" },
] as const;
type PeriodKey = typeof PERIODS[number]["key"];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addPeriod(dateValue: string, period: PeriodKey): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  if (period === "week") date.setDate(date.getDate() + 7);
  else {
    const months = period === "month" ? 1 : period === "threeMonths" ? 3 : period === "sixMonths" ? 6 : 12;
    const targetMonth = month - 1 + months;
    const lastDay = new Date(year, targetMonth + 1, 0).getDate();
    date.setFullYear(year, targetMonth, Math.min(day, lastDay));
  }
  return formatDate(date);
}

function createInitialForm(examIds: string[] = []) {
  const validFrom = formatDate(new Date());
  return {
    name: "", examIds, weekdays: [1, 2, 3, 4, 5] as number[],
    startTimes: ["10:00"], validFrom, validUntil: addPeriod(validFrom, "month"),
    durationMinutes: 40, entryWindowMinutes: 10, excludedDates: [] as string[],
  };
};

export function ExamScheduleManagement() {
  const [policies, setPolicies] = useState<ExamSchedulePolicy[]>([]);
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [form, setForm] = useState(() => createInitialForm());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExamPickerOpen, setIsExamPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey | null>("month");
  const [customStartTime, setCustomStartTime] = useState("");
  const [excludedDate, setExcludedDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const examDefaultsInitialized = useRef(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setError(null);
    try {
      const [nextPolicies, nextExams] = await Promise.all([
        examScheduleService.findAll(signal),
        examService.findExams({ type: "all", subject: "all", round: "all" }, signal),
      ]);
      setPolicies(nextPolicies);
      setExams(nextExams);
      if (!examDefaultsInitialized.current) {
        examDefaultsInitialized.current = true;
        setForm((current) => ({ ...current, examIds: nextExams.map((exam) => exam.id) }));
      }
    } catch (reason: unknown) {
      if (!signal?.aborted) setError(reason instanceof Error ? reason.message : "일정을 불러오지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void load(controller.signal), 0);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.examIds.length) {
      setError("대상 시험이 선택되지 않았습니다. 시험을 한 개 이상 선택해 주세요.");
      return;
    }
    if (!form.weekdays.length) {
      setError("시험을 진행할 요일을 한 개 이상 선택해 주세요.");
      return;
    }
    if (!form.startTimes.length) {
      setError("시험 시작 시각을 한 개 이상 선택해 주세요.");
      return;
    }
    if (!form.validFrom || !form.validUntil) {
      setError("적용 시작일과 종료일을 모두 입력해 주세요.");
      return;
    }
    if (form.validUntil < form.validFrom) {
      setError("적용 종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const command = form;
      const saved = editingId
        ? await examScheduleService.update(editingId, command)
        : await examScheduleService.create(command);
      setPolicies((current) => editingId
        ? current.map((item) => item.id === editingId ? saved : item)
        : [saved, ...current]);
      setForm(createInitialForm(exams.map((exam) => exam.id)));
      setEditingId(null);
      setSelectedPeriod("month");
      setIsFormOpen(false);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "일정 생성에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(createInitialForm(exams.map((exam) => exam.id)));
    setSelectedPeriod("month");
    setError(null);
    setIsFormOpen(true);
  };

  const openEdit = (policy: ExamSchedulePolicy) => {
    setEditingId(policy.id);
    setForm({
      name: policy.name,
      examIds: [...policy.examIds],
      weekdays: [...policy.weekdays],
      startTimes: [...policy.startTimes],
      validFrom: policy.validFrom,
      validUntil: policy.validUntil,
      durationMinutes: policy.durationMinutes,
      entryWindowMinutes: policy.entryWindowMinutes,
      excludedDates: [...policy.excludedDates],
    });
    setSelectedPeriod(null);
    setError(null);
    setIsFormOpen(true);
  };

  const deactivate = async (policy: ExamSchedulePolicy) => {
    if (!window.confirm(`'${policy.name}' 정책을 비활성화할까요? 신청된 회차는 유지됩니다.`)) return;
    try {
      await examScheduleService.deactivate(policy.id);
      setPolicies((current) => current.map((item) => item.id === policy.id ? { ...item, active: false } : item));
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "정책 비활성화에 실패했습니다.");
    }
  };

  const activate = async (policy: ExamSchedulePolicy) => {
    if (!window.confirm(`'${policy.name}' 정책을 다시 활성화할까요? 미래 시험 회차가 다시 생성됩니다.`)) return;
    try {
      const activated = await examScheduleService.activate(policy.id);
      setPolicies((current) => current.map((item) => item.id === policy.id ? activated : item));
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "정책 활성화에 실패했습니다.");
    }
  };

  const toggleStartTime = (time: string) => {
    setForm((current) => ({
      ...current,
      startTimes: current.startTimes.includes(time)
        ? current.startTimes.filter((value) => value !== time)
        : [...current.startTimes, time].sort(),
    }));
  };

  const addCustomStartTime = () => {
    if (!customStartTime || form.startTimes.includes(customStartTime)) return;
    setForm((current) => ({ ...current, startTimes: [...current.startTimes, customStartTime].sort() }));
    setCustomStartTime("");
  };

  const addExcludedDate = () => {
    if (!excludedDate || form.excludedDates.includes(excludedDate)) return;
    setForm((current) => ({ ...current, excludedDates: [...current.excludedDates, excludedDate].sort() }));
    setExcludedDate("");
  };

  const applyPeriod = (period: PeriodKey) => {
    setSelectedPeriod(period);
    setForm((current) => ({ ...current, validUntil: addPeriod(current.validFrom, period) }));
  };

  const scheduleForm = isFormOpen ? (
    <form className={styles.form} onSubmit={submit}>
      <h2>{editingId ? "일정 정책 수정" : "새 일정 정책"}</h2>
      {error ? <div className={styles.error}>{error}</div> : null}
      <label>정책 이름<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 평일 오전·오후 시험" /></label>
      <fieldset><legend>대상 시험</legend>
        <button type="button" className={styles.pickerButton} onClick={() => setIsExamPickerOpen(true)}>
          {form.examIds.length ? `${form.examIds.length}개 시험 선택됨` : "대상 시험 선택"}
        </button>
        <span className={styles.fieldHint}>신규 정책은 현재 조회되는 시험이 모두 선택됩니다.</span>
      </fieldset>
      <fieldset><legend>요일</legend><div className={styles.weekdays}>{WEEKDAYS.map((day) => (
        <label key={day.value} className={styles.check}><input type="checkbox" checked={form.weekdays.includes(day.value)} onChange={(e) => setForm({ ...form, weekdays: e.target.checked ? [...form.weekdays, day.value].sort() : form.weekdays.filter((value) => value !== day.value) })} />{day.label}</label>
      ))}</div></fieldset>
      <fieldset><legend>시작 시각</legend>
        <div className={styles.optionTabs}>{TIME_OPTIONS.map((time) => (
          <button key={time} type="button" data-selected={form.startTimes.includes(time)} onClick={() => toggleStartTime(time)}>{time}</button>
        ))}</div>
        <div className={styles.inlineInput}><input type="time" value={customStartTime} onChange={(e) => setCustomStartTime(e.target.value)} /><button type="button" onClick={addCustomStartTime}>시간 추가</button></div>
        <div className={styles.selectedTabs}>{form.startTimes.map((time) => <button key={time} type="button" onClick={() => toggleStartTime(time)}>{time}<X /></button>)}</div>
      </fieldset>
      <fieldset><legend>적용 기간</legend>
        <div className={styles.optionTabs}>{PERIODS.map((period) => <button key={period.key} type="button" data-selected={selectedPeriod === period.key} onClick={() => applyPeriod(period.key)}>{period.label}</button>)}</div>
      </fieldset>
      <div className={styles.grid}>
        <label>적용 시작일<input required type="date" value={form.validFrom} onChange={(e) => {
          const validFrom = e.target.value;
          setForm({ ...form, validFrom, validUntil: selectedPeriod ? addPeriod(validFrom, selectedPeriod) : form.validUntil });
        }} /></label>
        <label>적용 종료일<input required type="date" value={form.validUntil} onChange={(e) => { setSelectedPeriod(null); setForm({ ...form, validUntil: e.target.value }); }} /></label>
        <label>시험 시간 (분)<input required type="number" min="1" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></label>
        <label>입장 허용 (분)<input required type="number" min="1" value={form.entryWindowMinutes} onChange={(e) => setForm({ ...form, entryWindowMinutes: Number(e.target.value) })} /></label>
      </div>
      <fieldset><legend>제외 일자</legend>
        <div className={styles.inlineInput}><input type="date" value={excludedDate} onChange={(e) => setExcludedDate(e.target.value)} /><button type="button" onClick={addExcludedDate}>일자 추가</button></div>
        <div className={styles.selectedTabs}>{form.excludedDates.map((date) => <button key={date} type="button" onClick={() => setForm({ ...form, excludedDates: form.excludedDates.filter((value) => value !== date) })}>{date}<X /></button>)}</div>
      </fieldset>
      <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => { setIsFormOpen(false); setEditingId(null); setForm(createInitialForm(exams.map((exam) => exam.id))); setSelectedPeriod("month"); }}>취소</button><button type="submit" disabled={isSaving}>{isSaving ? "저장 중" : editingId ? "변경 저장" : "정책 생성"}</button></div>
    </form>
  ) : null;

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div><h1>시험 관리</h1><p>반복 규칙을 만들면 실제 응시 회차가 자동 생성됩니다. 시간대는 Asia/Seoul입니다.</p></div>
        <button type="button" onClick={openCreate}><Plus /> 일정 정책 추가</button>
      </div>

      {error && !isFormOpen ? <div className={styles.error}>{error}</div> : null}

      {!editingId ? scheduleForm : null}

      {isExamPickerOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setIsExamPickerOpen(false)}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="exam-picker-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}><div><h2 id="exam-picker-title">대상 시험 선택</h2><p>{form.examIds.length}개 선택됨</p></div><button type="button" className={styles.iconButton} onClick={() => setIsExamPickerOpen(false)} aria-label="닫기"><X /></button></div>
            <div className={styles.modalTools}><button type="button" onClick={() => setForm({ ...form, examIds: exams.map((exam) => exam.id) })}>전체 선택</button><button type="button" onClick={() => setForm({ ...form, examIds: [] })}>전체 해제</button></div>
            <div className={styles.examChoices}>{exams.map((exam) => (
              <label key={exam.id} className={styles.check}><input type="checkbox" checked={form.examIds.includes(exam.id)} onChange={(e) => setForm({ ...form, examIds: e.target.checked ? [...form.examIds, exam.id] : form.examIds.filter((id) => id !== exam.id) })} />{exam.title}</label>
            ))}</div>
            <div className={styles.modalActions}><button type="button" onClick={() => setIsExamPickerOpen(false)}><Check /> 선택 완료</button></div>
          </section>
        </div>
      ) : null}

      <div className={styles.list}>
        {policies.length ? policies.map((policy) => (
          <Fragment key={policy.id}>
            <article className={styles.card} data-editing={editingId === policy.id}>
              <div className={styles.cardIcon}><CalendarClock /></div>
              <div className={styles.cardBody}><div className={styles.cardTitle}><h2>{policy.name}</h2><span data-active={policy.active}>{policy.active ? "운영 중" : "비활성"}</span></div>
                <p>{policy.validFrom} ~ {policy.validUntil} · {policy.startTimes.join(", ")} · {policy.durationMinutes}분</p>
                <p>{policy.weekdays.map((value) => WEEKDAYS.find((day) => day.value === value)?.label).join("·")}요일 · 시험 {policy.examIds.length}개 · 실제 신청 일정 {policy.slotCount}개</p>
              </div>
              <div className={styles.cardActions}>
                <button type="button" className={styles.edit} onClick={() => openEdit(policy)}><Pencil /> 수정</button>
                {policy.active
                  ? <button type="button" className={styles.deactivate} onClick={() => void deactivate(policy)}><Power /> 비활성화</button>
                  : <button type="button" className={styles.activate} onClick={() => void activate(policy)}><Power /> 활성화</button>}
              </div>
            </article>
            {editingId === policy.id ? scheduleForm : null}
          </Fragment>
        )) : <div className={styles.empty}>등록된 시험 일정 정책이 없습니다.</div>}
      </div>
    </section>
  );
}
