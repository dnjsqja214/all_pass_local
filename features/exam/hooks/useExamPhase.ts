"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/features/store/store";
import { queryErrorMessage } from "@/features/store/api/queryError";
import {
  examRegistrationApi,
  useGetRegistrationsQuery,
} from "../api/examRegistrationApi";
import type { ExamRegistration } from "../services/examRegistrationService";

/**
 * 지금 사용자가 시험의 어느 단계에 있는지 판정한다.
 *
 * 신청 목록은 RTK Query의 단일 캐시를 사용한다. 시각은 브라우저 시계가 아니라 서버
 * 응답의 Date 헤더를 기준으로 보정하며, 초 단위 카운트만 컴포넌트 로컬 상태로 둔다.
 */
export type ExamPhase = "waiting" | "running" | "closed" | null;

const WAITING_WINDOW_MILLIS = 10 * 60_000;

interface ExamPhaseValue {
  phase: ExamPhase;
  remainingSeconds: number;
  secondsUntilStart: number;
  registration: ExamRegistration | null;
  error: string | null;
  markRegistrationSubmitted: (registrationId: string) => void;
  refreshRegistrations: () => Promise<void>;
}

function endOf(registration: ExamRegistration): number {
  return Date.parse(registration.startsAt) +
    registration.durationMinutes * 60_000;
}

function pickCurrent(
  registrations: ExamRegistration[],
  now: number,
): ExamRegistration | null {
  return registrations
    .filter((item) => item.status === "applied" && endOf(item) > now)
    .sort((left, right) =>
      Date.parse(left.startsAt) - Date.parse(right.startsAt))[0] ?? null;
}

function decide(
  registration: ExamRegistration | null,
  now: number,
): { phase: ExamPhase; remainingSeconds: number } {
  if (!registration) return { phase: null, remainingSeconds: 0 };

  const startsAt = Date.parse(registration.startsAt);
  const entryClosesAt = Date.parse(registration.entryClosesAt);
  if (now < startsAt) {
    const untilStart = startsAt - now;
    if (untilStart > WAITING_WINDOW_MILLIS) {
      return { phase: null, remainingSeconds: 0 };
    }
    return {
      phase: "waiting",
      remainingSeconds: Math.ceil(untilStart / 1000),
    };
  }
  if (now > entryClosesAt) {
    return { phase: "closed", remainingSeconds: 0 };
  }
  return {
    phase: "running",
    remainingSeconds: Math.max(
      0,
      Math.ceil((endOf(registration) - now) / 1000),
    ),
  };
}

export function useExamPhase(): ExamPhaseValue {
  const dispatch = useDispatch<AppDispatch>();
  const [browserNow, setBrowserNow] = useState(0);

  const query = useGetRegistrationsQuery(undefined, {
    refetchOnReconnect: true,
  });
  const currentSnapshot = query.data;
  const offsetMillis = currentSnapshot
    ? currentSnapshot.serverNow - (query.fulfilledTimeStamp ?? browserNow)
    : 0;
  const currentNow = browserNow + offsetMillis;
  const currentRegistration = browserNow > 0 && currentSnapshot
    ? pickCurrent(currentSnapshot.registrations, currentNow)
    : null;
  const { phase, remainingSeconds } = decide(
    currentRegistration,
    currentNow,
  );
  const secondsUntilStart = currentRegistration
    ? Math.max(
        0,
        Math.ceil(
          (Date.parse(currentRegistration.startsAt) - currentNow) / 1000,
        ),
      )
    : 0;

  useEffect(() => {
    const readClock = () => setBrowserNow(Date.now());
    readClock();
    const timer = window.setInterval(readClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // 폴링 대신: 대기 화면에 진입할 때 한 번만 서버시각을 재보정한다(+막판 일정변경 반영).
  // 시작 판정은 서버(requireStartable)가 최종적으로 하므로 그 이상의 재보정은 불필요하다.
  const { refetch } = query;
  useEffect(() => {
    if (phase === "waiting") void refetch();
  }, [phase, refetch]);

  const markRegistrationSubmitted = useCallback((registrationId: string) => {
    dispatch(examRegistrationApi.util.updateQueryData(
      "getRegistrations",
      undefined,
      (draft) => {
        const registrationToUpdate = draft.registrations
          .find((item) => item.id === registrationId);
        if (registrationToUpdate) {
          registrationToUpdate.status = "completed";
        }
      },
    ));
  }, [dispatch]);

  const refreshRegistrations = useCallback(async () => {
    await query.refetch().unwrap();
  }, [query]);

  return {
    phase,
    remainingSeconds,
    secondsUntilStart,
    registration: currentRegistration,
    error: query.error
      ? queryErrorMessage(query.error, "시험 일정을 확인하지 못했습니다.")
      : null,
    markRegistrationSubmitted,
    refreshRegistrations,
  };
}
