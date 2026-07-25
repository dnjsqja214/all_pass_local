"use client";

import { useEffect, useRef } from "react";

interface VoiceReminder {
  enabled: boolean;
  minutesBefore: number;
  message: string;
}

interface UseVoiceRemindersOptions {
  notificationKey: string | null;
  reminders: readonly VoiceReminder[];
  remainingSeconds: number;
  active?: boolean;
}

interface ReminderState {
  key: string | null;
  previousSeconds: number | null;
  announced: Set<string>;
}

/** 1초 타이머가 잠깐 밀려도 경계 통과로 인정하되, 수십 초 늦은 안내는 재생하지 않는다. */
const ANNOUNCEMENT_DELAY_TOLERANCE_SECONDS = 5;

/**
 * 남은 시간이 설정 시점을 통과할 때 브라우저 음성 합성으로 한 번 안내한다.
 *
 * 처음 관찰했을 때 이미 지난 알림은 재생하지 않는다.
 * 같은 화면이 유지되는 동안에는 notificationKey별로 한 번만 재생한다.
 */
export function useVoiceReminders({
  notificationKey,
  reminders,
  remainingSeconds,
  active = true,
}: UseVoiceRemindersOptions): void {
  const stateRef = useRef<ReminderState>({
    key: null,
    previousSeconds: null,
    announced: new Set(),
  });

  useEffect(() => {
    const state = stateRef.current;
    if (state.key !== notificationKey) {
      state.key = notificationKey;
      state.previousSeconds = null;
      state.announced = new Set();
    }

    if (!notificationKey || !active || remainingSeconds < 0) {
      state.previousSeconds = null;
      return;
    }

    const previousSeconds = state.previousSeconds;
    state.previousSeconds = remainingSeconds;

    if (previousSeconds === null) {
      reminders.forEach((reminder) => {
        if (reminder.enabled && remainingSeconds <= reminder.minutesBefore * 60) {
          state.announced.add(`${reminder.minutesBefore}:${reminder.message}`);
        }
      });
      return;
    }

    const crossedReminders = reminders.filter((reminder) => {
      const reminderKey = `${reminder.minutesBefore}:${reminder.message}`;
      if (!reminder.enabled || state.announced.has(reminderKey)) return false;
      const thresholdSeconds = reminder.minutesBefore * 60;
      return previousSeconds > thresholdSeconds && remainingSeconds <= thresholdSeconds;
    });
    if (!crossedReminders.length) return;

    crossedReminders.forEach((reminder) => {
      state.announced.add(`${reminder.minutesBefore}:${reminder.message}`);
    });

    const dueReminders = crossedReminders.filter((reminder) => {
      const thresholdSeconds = reminder.minutesBefore * 60;
      return thresholdSeconds - remainingSeconds <= ANNOUNCEMENT_DELAY_TOLERANCE_SECONDS;
    });
    if (!dueReminders.length) return;

    const reminder = dueReminders.toSorted(
      (left, right) => left.minutesBefore - right.minutesBefore,
    )[0];
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    // 첫 음절이 잘리는 브라우저·스피커를 위해 짧은 예고 음성을 먼저 큐에 넣는다.
    // 예고 음성이 출력 장치를 깨운 뒤 실제 멘트가 같은 큐에서 순서대로 재생된다.
    const preamble = new SpeechSynthesisUtterance("알림");
    preamble.lang = "ko-KR";
    preamble.rate = 1;
    preamble.volume = 0.75;

    const utterance = new SpeechSynthesisUtterance(reminder.message);
    utterance.lang = "ko-KR";
    utterance.rate = 0.92;
    utterance.volume = 1;

    window.speechSynthesis.speak(preamble);
    window.speechSynthesis.speak(utterance);
  }, [active, notificationKey, remainingSeconds, reminders]);
}
