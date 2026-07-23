"use client";

import { useCallback, useEffect, useState } from "react";
import { examRegistrationService, type ExamRegistration } from "../services/examRegistrationService";

/**
 * 지금 사용자가 시험의 어느 단계에 있는지 판정한다.
 *
 * <p>화면을 그리지 않고 값만 만든다. 이 값으로 `(user)/layout.tsx` 가
 * 대기 화면을 그릴지 평소 화면을 그릴지 결정한다.</p>
 *
 * <p>시각은 브라우저 시계가 아니라 <b>서버 시각</b>을 기준으로 삼는다. 사용자 PC 가
 * 틀어져 있어도 모두가 같은 순간에 시작하도록. 서버에는 가끔만 물어보고 그 차이(오프셋)를
 * 기억한 뒤, 초 단위 갱신은 브라우저에서 한다.</p>
 */

export type ExamPhase = "waiting" | "running" | "closed" | null;

/** 대기 화면을 언제부터 띄울지. 이보다 멀면 평소처럼 앱을 쓴다. */
const WAITING_WINDOW_MILLIS = 10 * 60_000;

/** 시험이 가까울수록 자주 다시 확인한다(관리자가 취소·변경했을 수 있으므로). */
const POLL_NEAR_MILLIS = 60_000;
const POLL_FAR_MILLIS = 5 * 60_000;
const NEAR_THRESHOLD_MILLIS = 30 * 60_000;

interface ExamPhaseValue {
  phase: ExamPhase;
  /** 대기 중이면 시작까지 남은 초, 응시 중이면 종료까지 남은 초. */
  remainingSeconds: number;
  registration: ExamRegistration | null;
  error: string | null;
  /** 제출 성공한 신청을 로컬에서 완료 처리해 카운트 대상에서 즉시 제외한다. */
  markRegistrationSubmitted: (registrationId: string) => void;
}

/** 조회 결과와 그때 잰 서버·브라우저 시각 차이. 둘은 항상 같이 움직인다. */
interface Snapshot {
  registrations: ExamRegistration[];
  offsetMillis: number;
}

function endOf(registration: ExamRegistration): number {
  return Date.parse(registration.startsAt) + registration.durationMinutes * 60_000;
}

/** 아직 끝나지 않은 신청 중 가장 이른 것. */
function pickCurrent(registrations: ExamRegistration[], now: number): ExamRegistration | null {
  return registrations
    .filter((item) => item.status === "applied" && endOf(item) > now)
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt))[0] ?? null;
}

function decide(registration: ExamRegistration | null, now: number): { phase: ExamPhase; remainingSeconds: number } {
  if (!registration) return { phase: null, remainingSeconds: 0 };

  const startsAt = Date.parse(registration.startsAt);
  const entryClosesAt = Date.parse(registration.entryClosesAt);

  if (now < startsAt) {
    const untilStart = startsAt - now;
    // 아직 한참 남았으면 앱을 평소처럼 쓰게 둔다.
    if (untilStart > WAITING_WINDOW_MILLIS) return { phase: null, remainingSeconds: 0 };
    return { phase: "waiting", remainingSeconds: Math.ceil(untilStart / 1000) };
  }
  // 시작은 했는데 입장 마감이 지났으면 들어갈 수 없다.
  if (now > entryClosesAt) return { phase: "closed", remainingSeconds: 0 };
  return { phase: "running", remainingSeconds: Math.max(0, Math.ceil((endOf(registration) - now) / 1000)) };
}

export function useExamPhase(): ExamPhaseValue {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  /**
   * 브라우저 현재 시각. 렌더 중에 {@code Date.now()} 를 부르면 렌더가 순수하지 않게 되므로
   * 시계는 효과에서 읽어 상태로 들여온다. 0 은 "아직 안 읽음".
   */
  const [browserNow, setBrowserNow] = useState(0);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const { registrations, serverNow } = await examRegistrationService.getRegistrationsWithServerTime(signal);
      if (signal?.aborted) return;
      setSnapshot({ registrations, offsetMillis: serverNow - Date.now() });
      setError(null);
    } catch (reason) {
      if (signal?.aborted) return;
      setError(reason instanceof Error ? reason.message : "시험 일정을 확인하지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    // 조회는 비동기라 상태 갱신이 렌더 이후에 일어난다. 규칙이 그걸 구분하지 못해 꺼둔다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  // 초 단위 갱신. 서버를 부르지 않고 기억해 둔 오프셋으로만 센다.
  useEffect(() => {
    const readClock = () => setBrowserNow(Date.now());
    readClock();
    const timer = window.setInterval(readClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const now = browserNow + (snapshot?.offsetMillis ?? 0);
  // 시각과 신청 목록이 둘 다 준비되기 전에는 판정하지 않는다.
  const ready = browserNow > 0 && snapshot !== null;
  const registration = ready ? pickCurrent(snapshot.registrations, now) : null;
  const { phase, remainingSeconds } = decide(registration, now);

  // 시험이 가까울수록 자주 다시 확인한다. 없으면 느리게.
  const startsAt = registration ? Date.parse(registration.startsAt) : null;
  useEffect(() => {
    const untilStart = startsAt === null ? Number.POSITIVE_INFINITY : startsAt - Date.now();
    const interval = untilStart < NEAR_THRESHOLD_MILLIS ? POLL_NEAR_MILLIS : POLL_FAR_MILLIS;
    const timer = window.setInterval(() => void load(), interval);
    return () => window.clearInterval(timer);
  }, [startsAt, load]);

  // 백그라운드 탭은 타이머가 느려져 시각이 밀린다. 돌아오면 즉시 맞춘다.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  const markRegistrationSubmitted = useCallback((registrationId: string) => {
    setSnapshot((previous) => previous === null
      ? previous
      : {
          ...previous,
          registrations: previous.registrations.map((item) =>
            item.id === registrationId
              ? { ...item, status: "completed" }
              : item,
          ),
        });
  }, []);

  return { phase, remainingSeconds, registration, error, markRegistrationSubmitted };
}
