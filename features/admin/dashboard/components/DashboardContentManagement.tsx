"use client";

import { type FormEvent, useState } from "react";
import { BellRing, CalendarRange, Pencil, Plus, Power, X } from "lucide-react";
import { queryErrorMessage } from "../../../store/api/queryError";
import {
  useActivateDashboardContentMutation,
  useCreateDashboardContentMutation,
  useDeactivateDashboardContentMutation,
  useGetAdminDashboardContentsQuery,
  useUpdateDashboardContentMutation,
} from "../../../dashboard/api/dashboardContentApi";
import type {
  DashboardContent,
  DashboardContentCommand,
  DashboardContentType,
} from "../../../dashboard/services/dashboardContentService";
import styles from "./DashboardContentManagement.module.css";

interface ContentForm {
  type: DashboardContentType;
  eyebrow: string;
  title: string;
  body: string;
  examRound: string;
  examDate: string;
  registrationStart: string;
  registrationEnd: string;
  announcementDate: string;
  subjectSummary: string;
  visibleFrom: string;
  visibleUntil: string;
}

function localDateTime(value: string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function initialForm(): ContentForm {
  return {
    type: "EXAM",
    eyebrow: "",
    title: "",
    body: "",
    examRound: "",
    examDate: "",
    registrationStart: "",
    registrationEnd: "",
    announcementDate: "",
    subjectSummary: "",
    visibleFrom: localDateTime(new Date().toISOString()),
    visibleUntil: "",
  };
}

function formOf(content: DashboardContent): ContentForm {
  return {
    type: content.type,
    eyebrow: content.eyebrow ?? "",
    title: content.title,
    body: content.body ?? "",
    examRound: content.examRound?.toString() ?? "",
    examDate: content.examDate ?? "",
    registrationStart: content.registrationStart ?? "",
    registrationEnd: content.registrationEnd ?? "",
    announcementDate: content.announcementDate ?? "",
    subjectSummary: content.subjectSummary ?? "",
    visibleFrom: localDateTime(content.visibleFrom),
    visibleUntil: content.visibleUntil ? localDateTime(content.visibleUntil) : "",
  };
}

function nullable(value: string): string | null {
  return value.trim() || null;
}

function commandOf(form: ContentForm): DashboardContentCommand {
  const exam = form.type === "EXAM";
  return {
    type: form.type,
    eyebrow: nullable(form.eyebrow),
    title: form.title.trim(),
    body: nullable(form.body),
    examRound: exam && form.examRound ? Number(form.examRound) : null,
    examDate: exam ? nullable(form.examDate) : null,
    registrationStart: exam ? nullable(form.registrationStart) : null,
    registrationEnd: exam ? nullable(form.registrationEnd) : null,
    announcementDate: exam ? nullable(form.announcementDate) : null,
    subjectSummary: exam ? nullable(form.subjectSummary) : null,
    visibleFrom: new Date(form.visibleFrom).toISOString(),
    visibleUntil: form.visibleUntil ? new Date(form.visibleUntil).toISOString() : null,
  };
}

const displayDateTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit",
});

export function DashboardContentManagement() {
  const contentsQuery = useGetAdminDashboardContentsQuery(undefined, {
    refetchOnFocus: true, refetchOnReconnect: true,
  });
  const [createContent] = useCreateDashboardContentMutation();
  const [updateContent] = useUpdateDashboardContentMutation();
  const [activateContent] = useActivateDashboardContentMutation();
  const [deactivateContent] = useDeactivateDashboardContentMutation();
  const [form, setForm] = useState<ContentForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm());
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (content: DashboardContent) => {
    setEditingId(content.id);
    setForm(formOf(content));
    setError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setFormOpen(false);
    setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.visibleFrom) {
      setError("제목과 노출 시작 일시는 필수입니다.");
      return;
    }
    if (form.type === "EXAM" && (!form.examRound || !form.examDate)) {
      setError("시험 안내는 시험 회차와 시험일을 입력해야 합니다.");
      return;
    }
    if ((form.registrationStart && !form.registrationEnd) ||
        (!form.registrationStart && form.registrationEnd)) {
      setError("접수 시작일과 종료일을 함께 입력해 주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const command = commandOf(form);
      if (editingId) await updateContent({ id: editingId, command }).unwrap();
      else await createContent(command).unwrap();
      closeForm();
    } catch (reason: unknown) {
      setError(queryErrorMessage(reason, "대시보드 콘텐츠 저장에 실패했습니다."));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (content: DashboardContent) => {
    setError(null);
    try {
      if (content.active) await deactivateContent(content.id).unwrap();
      else await activateContent(content.id).unwrap();
    } catch (reason: unknown) {
      setError(queryErrorMessage(reason, "노출 상태 변경에 실패했습니다."));
    }
  };

  const loadError = contentsQuery.error
    ? queryErrorMessage(contentsQuery.error, "대시보드 콘텐츠를 불러오지 못했습니다.")
    : null;

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <div>
          <span>Dashboard contents</span>
          <h1>대시보드 관리</h1>
          <p>시험 안내와 공지를 노출 기간에 맞춰 미리 예약할 수 있습니다.</p>
        </div>
        <button type="button" onClick={openCreate}><Plus /> 콘텐츠 추가</button>
      </header>

      {loadError || (!formOpen && error) ? <div className={styles.error}>{loadError ?? error}</div> : null}

      {formOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={closeForm}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="dashboard-content-form-title" onMouseDown={(event) => event.stopPropagation()}>
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formHeading}>
            <div><h2 id="dashboard-content-form-title">{editingId ? "콘텐츠 수정" : "새 콘텐츠"}</h2><p>시험 안내와 일반 공지는 각각 가장 최근에 시작한 콘텐츠가 표시됩니다.</p></div>
            <div className={styles.formTools}><div className={styles.typeTabs}>
              {(["EXAM", "NOTICE"] as const).map((type) => (
                <button key={type} type="button" data-active={form.type === type}
                  onClick={() => setForm((current) => ({ ...current, type }))}>
                  {type === "EXAM" ? "시험 안내" : "일반 공지"}
                </button>
              ))}
            </div><button type="button" className={styles.modalClose} onClick={closeForm} aria-label="모달 닫기"><X /></button></div>
          </div>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.grid}>
            <label>상단 문구<input value={form.eyebrow} maxLength={100} onChange={(event) => setForm({ ...form, eyebrow: event.target.value })} placeholder="예: 37TH LICENSE EXAM" /></label>
            <label>제목<input required value={form.title} maxLength={160} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          </div>
          <label>본문<textarea value={form.body} maxLength={2000} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="사용자에게 전달할 안내를 입력하세요." /></label>
          {form.type === "EXAM" ? (
            <fieldset>
              <legend>시험 정보</legend>
              <div className={styles.examGrid}>
                <label>시험 회차<input required type="number" min="1" value={form.examRound} onChange={(event) => setForm({ ...form, examRound: event.target.value })} /></label>
                <label>시험일<input required type="date" value={form.examDate} onChange={(event) => setForm({ ...form, examDate: event.target.value })} /></label>
                <label>접수 시작일<input type="date" value={form.registrationStart} onChange={(event) => setForm({ ...form, registrationStart: event.target.value })} /></label>
                <label>접수 종료일<input type="date" value={form.registrationEnd} onChange={(event) => setForm({ ...form, registrationEnd: event.target.value })} /></label>
                <label>합격자 발표일<input type="date" value={form.announcementDate} onChange={(event) => setForm({ ...form, announcementDate: event.target.value })} /></label>
              </div>
              <label>시험 과목 안내<textarea value={form.subjectSummary} maxLength={2000} onChange={(event) => setForm({ ...form, subjectSummary: event.target.value })} placeholder="줄바꿈으로 항목을 구분할 수 있습니다." /></label>
            </fieldset>
          ) : null}
          <fieldset>
            <legend>노출 예약</legend>
            <div className={styles.grid}>
              <label>노출 시작<input required type="datetime-local" value={form.visibleFrom} onChange={(event) => setForm({ ...form, visibleFrom: event.target.value })} /></label>
              <label>노출 종료 (비우면 계속 노출)<input type="datetime-local" value={form.visibleUntil} onChange={(event) => setForm({ ...form, visibleUntil: event.target.value })} /></label>
            </div>
          </fieldset>
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={closeForm}>취소</button>
            <button type="submit" disabled={saving}>{saving ? "저장 중..." : editingId ? "변경 저장" : "콘텐츠 생성"}</button>
          </div>
        </form>
          </div>
        </div>
      ) : null}

      <div className={styles.list}>
        {(contentsQuery.data ?? []).map((content) => (
          <article key={content.id} className={styles.card} data-active={content.active}>
            <div className={styles.icon}>{content.type === "EXAM" ? <CalendarRange /> : <BellRing />}</div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>
                <span>{content.type === "EXAM" ? "시험 안내" : "일반 공지"}</span>
                <h2>{content.title}</h2>
                <em>{content.active ? "활성" : "비활성"}</em>
              </div>
              <p>{displayDateTime.format(new Date(content.visibleFrom))} ~ {content.visibleUntil ? displayDateTime.format(new Date(content.visibleUntil)) : "종료 없음"}</p>
            </div>
            <div className={styles.cardActions}>
              <button type="button" onClick={() => openEdit(content)}><Pencil /> 수정</button>
              <button type="button" data-power="true" onClick={() => void toggleActive(content)}><Power /> {content.active ? "비활성화" : "활성화"}</button>
            </div>
          </article>
        ))}
        {!contentsQuery.isLoading && !(contentsQuery.data?.length)
          ? <div className={styles.empty}>등록된 대시보드 콘텐츠가 없습니다.</div>
          : null}
      </div>
    </section>
  );
}
