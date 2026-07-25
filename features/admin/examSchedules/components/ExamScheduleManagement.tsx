"use client";

import { FormEvent, Fragment, useState } from "react";
import { CalendarClock, CalendarDays, Check, Clock, Pencil, Plus, Power, X } from "lucide-react";
import { useGetExamsQuery } from "../../../exam/api/examApi";
import { queryErrorMessage } from "../../../store/api/queryError";
import {
  useActivateExamScheduleMutation,
  useCreateExamScheduleMutation,
  useDeactivateExamScheduleMutation,
  useGetExamSchedulesQuery,
  useUpdateExamScheduleMutation,
} from "../api/examScheduleApi";
import {
  type ExamSchedulePolicy,
  type VoiceReminderSetting,
} from "../services/examScheduleService";
import styles from "./ExamScheduleManagement.module.css";
import { ScheduleValuePickerModal } from "./ScheduleValuePickerModal";

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
type SchedulePickerKind = "time" | "date";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(time: string): string {
  const [hour = "00", minute = "00"] = time.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
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
    startReminders: [{
      enabled: false,
      minutesBefore: 10,
      message: "시험 시작 10분 전입니다.",
    }],
    endReminders: [{
      enabled: false,
      minutesBefore: 5,
      message: "시험 종료 5분 전입니다.",
    }],
  };
};

export function ExamScheduleManagement() {
  const policiesQuery = useGetExamSchedulesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const examsQuery = useGetExamsQuery({
    type: "all",
    subject: "all",
    round: "all",
  });
  const policies = policiesQuery.data ?? [];
  const exams = examsQuery.data ?? [];
  const [createPolicy] = useCreateExamScheduleMutation();
  const [updatePolicy] = useUpdateExamScheduleMutation();
  const [activatePolicy] = useActivateExamScheduleMutation();
  const [deactivatePolicy] = useDeactivateExamScheduleMutation();
  const [form, setForm] = useState(() => createInitialForm());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExamPickerOpen, setIsExamPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey | null>("month");
  const [schedulePicker, setSchedulePicker] = useState<SchedulePickerKind | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const allReminders = [
      { label: "시험 시작 전", items: form.startReminders },
      { label: "시험 종료 전", items: form.endReminders },
    ];
    for (const group of allReminders) {
      if (group.items.some((item) => item.minutesBefore < 0 || !item.message.trim())) {
        setError(`${group.label} 음성 알림의 분과 멘트를 모두 입력해 주세요.`);
        return;
      }
      if (new Set(group.items.map((item) => item.minutesBefore)).size !== group.items.length) {
        setError(`${group.label} 음성 알림에 같은 분을 중복해서 설정할 수 없습니다.`);
        return;
      }
    }
    if (form.endReminders.some(
      (item) => item.enabled && item.minutesBefore >= form.durationMinutes,
    )) {
      setError("시험 종료 전 음성 알림은 시험 시간보다 짧게 설정해 주세요.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const command = form;
      if (editingId) {
        await updatePolicy({ id: editingId, command }).unwrap();
      } else {
        await createPolicy(command).unwrap();
      }
      setForm(createInitialForm(exams.map((exam) => exam.id)));
      setEditingId(null);
      setSelectedPeriod("month");
      setIsFormOpen(false);
      setSchedulePicker(null);
    } catch (reason: unknown) {
      setError(queryErrorMessage(reason, "일정 생성에 실패했습니다."));
    } finally {
      setIsSaving(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(createInitialForm(exams.map((exam) => exam.id)));
    setSelectedPeriod("month");
    setSchedulePicker(null);
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
      startReminders: policy.startReminders.map((item) => ({ ...item })),
      endReminders: policy.endReminders.map((item) => ({ ...item })),
    });
    setSelectedPeriod(null);
    setSchedulePicker(null);
    setError(null);
    setIsFormOpen(true);
  };

  const deactivate = async (policy: ExamSchedulePolicy) => {
    if (!window.confirm(`'${policy.name}' 정책을 비활성화할까요? 신청된 회차는 유지됩니다.`)) return;
    try {
      await deactivatePolicy(policy.id).unwrap();
    } catch (reason: unknown) {
      setError(queryErrorMessage(reason, "정책 비활성화에 실패했습니다."));
    }
  };

  const activate = async (policy: ExamSchedulePolicy) => {
    if (!window.confirm(`'${policy.name}' 정책을 다시 활성화할까요? 미래 시험 회차가 다시 생성됩니다.`)) return;
    try {
      await activatePolicy(policy.id).unwrap();
    } catch (reason: unknown) {
      setError(queryErrorMessage(reason, "정책 활성화에 실패했습니다."));
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

  const addCustomStartTime = (time: string) => {
    if (form.startTimes.includes(time)) return;
    setForm((current) => ({ ...current, startTimes: [...current.startTimes, time].sort() }));
    setSchedulePicker(null);
  };

  const addExcludedDate = (date: string) => {
    if (form.excludedDates.includes(date)) return;
    setForm((current) => ({ ...current, excludedDates: [...current.excludedDates, date].sort() }));
    setSchedulePicker(null);
  };

  const applyPeriod = (period: PeriodKey) => {
    setSelectedPeriod(period);
    setForm((current) => ({ ...current, validUntil: addPeriod(current.validFrom, period) }));
  };

  type ReminderField = "startReminders" | "endReminders";

  const addReminder = (field: ReminderField) => {
    setForm((current) => {
      const currentItems = current[field];
      const candidates = field === "startReminders" ? [10, 5, 3, 1] : [5, 3, 1];
      const minutesBefore = candidates.find(
        (candidate) => !currentItems.some((item) => item.minutesBefore === candidate),
      ) ?? Math.max(0, ...currentItems.map((item) => item.minutesBefore)) + 1;
      const point = field === "startReminders" ? "시작" : "종료";
      return {
        ...current,
        [field]: [
          ...currentItems,
          {
            enabled: true,
            minutesBefore,
            message: `시험 ${point} ${minutesBefore}분 전입니다.`,
          },
        ].sort((left, right) => right.minutesBefore - left.minutesBefore),
      };
    });
  };

  const updateReminder = (
    field: ReminderField,
    index: number,
    patch: Partial<VoiceReminderSetting>,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (
        itemIndex === index ? { ...item, ...patch } : item
      )),
    }));
  };

  const removeReminder = (field: ReminderField, index: number) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const loadError = policiesQuery.error
    ? queryErrorMessage(policiesQuery.error, "시험 정책을 불러오지 못했습니다.")
    : examsQuery.error
      ? queryErrorMessage(examsQuery.error, "시험 목록을 불러오지 못했습니다.")
      : null;

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
        <button type="button" className={styles.pickerIconButton} onClick={() => setSchedulePicker("time")} aria-label="시간 추가" title="시간 추가">
          <Clock /> 시간 추가
        </button>
        <div className={styles.selectedTabs}>{form.startTimes.map((time) => <button key={time} type="button" onClick={() => toggleStartTime(time)}>{formatTime(time)}<X /></button>)}</div>
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
      <fieldset><legend>음성 알림</legend>
        <span className={styles.fieldHint}>각 구분에 여러 알림을 추가할 수 있으며, 활성화된 항목만 설정한 시점에 한 번 안내합니다.</span>
        <div className={styles.reminderGrid}>
          {([
            { field: "startReminders", label: "시험 시작 전" },
            { field: "endReminders", label: "시험 종료 전" },
          ] as const).map(({ field, label }) => (
            <section className={styles.reminderCard} key={field}>
              <div className={styles.reminderHeader}>
                <strong>{label}</strong>
                <button type="button" onClick={() => addReminder(field)}>
                  <Plus /> 알림 추가
                </button>
              </div>
              {form[field].length ? (
                <div className={styles.reminderList}>
                  {form[field].map((reminder, index) => (
                    <div
                      className={styles.reminderItem}
                      data-enabled={reminder.enabled}
                      key={`${field}-${index}`}
                    >
                      <label className={styles.reminderToggle}>
                        <input
                          type="checkbox"
                          checked={reminder.enabled}
                          onChange={(event) => updateReminder(
                            field,
                            index,
                            { enabled: event.target.checked },
                          )}
                        />
                        사용
                      </label>
                      <label className={styles.reminderMinute}>
                        <span>분</span>
                        <input
                          required
                          type="number"
                          min="0"
                          max={field === "endReminders"
                            ? Math.max(0, form.durationMinutes - 1)
                            : undefined}
                          value={reminder.minutesBefore}
                          onChange={(event) => updateReminder(
                            field,
                            index,
                            { minutesBefore: Number(event.target.value) },
                          )}
                        />
                      </label>
                      <label className={styles.reminderMessage}>
                        <span>멘트</span>
                        <input
                          required
                          maxLength={200}
                          value={reminder.message}
                          onChange={(event) => updateReminder(
                            field,
                            index,
                            { message: event.target.value },
                          )}
                          placeholder={`예: ${label} 5분입니다.`}
                        />
                      </label>
                      <button
                        type="button"
                        className={styles.removeReminder}
                        onClick={() => removeReminder(field, index)}
                        aria-label={`${label} 알림 삭제`}
                      >
                        <X />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noReminders}>등록된 알림이 없습니다.</p>
              )}
            </section>
          ))}
        </div>
      </fieldset>
      <fieldset><legend>제외 일자</legend>
        <button type="button" className={styles.pickerIconButton} onClick={() => setSchedulePicker("date")} aria-label="일자 추가" title="일자 추가">
          <CalendarDays /> 일자 추가
        </button>
        <div className={styles.selectedTabs}>{form.excludedDates.map((date) => <button key={date} type="button" onClick={() => setForm({ ...form, excludedDates: form.excludedDates.filter((value) => value !== date) })}>{date}<X /></button>)}</div>
      </fieldset>
      <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => { setIsFormOpen(false); setEditingId(null); setForm(createInitialForm(exams.map((exam) => exam.id))); setSelectedPeriod("month"); setSchedulePicker(null); }}>취소</button><button type="submit" disabled={isSaving}>{isSaving ? "저장 중" : editingId ? "변경 저장" : "정책 생성"}</button></div>
    </form>
  ) : null;

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div><h1>시험 관리</h1><p>반복 규칙을 만들면 실제 응시 회차가 자동 생성됩니다. 시간대는 Asia/Seoul입니다.</p></div>
        <button type="button" onClick={openCreate}><Plus /> 일정 정책 추가</button>
      </div>

      {(error || loadError) && !isFormOpen
        ? <div className={styles.error}>{error ?? loadError}</div>
        : null}

      {!editingId ? scheduleForm : null}

      {schedulePicker ? (
        <ScheduleValuePickerModal
          kind={schedulePicker}
          existingValues={schedulePicker === "time" ? form.startTimes : form.excludedDates}
          onConfirm={schedulePicker === "time" ? addCustomStartTime : addExcludedDate}
          onClose={() => setSchedulePicker(null)}
        />
      ) : null}

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
                <p>
                  {policy.validFrom} ~ {policy.validUntil} ·{" "}
                  <span className={styles.scheduleTimes}>
                    {policy.startTimes.map(formatTime).join(", ")}
                  </span>
                  {" · "}{policy.durationMinutes}분
                </p>
                <p>{policy.weekdays.map((value) => WEEKDAYS.find((day) => day.value === value)?.label).join("·")}요일 · 시험 {policy.examIds.length}개 · 실제 신청 일정 {policy.slotCount}개</p>
                <p className={styles.reminderSummary}>
                  음성 알림 · 시작 {policy.startReminders.filter((item) => item.enabled)
                    .map((item) => `${item.minutesBefore}분 전`).join("·") || "사용 안 함"}
                  {" · "}종료 {policy.endReminders.filter((item) => item.enabled)
                    .map((item) => `${item.minutesBefore}분 전`).join("·") || "사용 안 함"}
                </p>
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
