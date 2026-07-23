"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatService, isChatMessage } from "../services/chatService";
import { useSocket } from "../../socket/SocketProvider";
import type { ChatMessage } from "../types/chat";

/** 메시지 id 기준으로 합치고 오름차순 정렬. 과거 로드와 실시간 수신이 겹쳐도 중복이 안 생긴다. */
function mergeById(a: ChatMessage[], b: ChatMessage[]): ChatMessage[] {
  const merged = new Map<string, ChatMessage>();
  for (const message of a) merged.set(message.id, message);
  for (const message of b) merged.set(message.id, message);
  return Array.from(merged.values()).sort((x, y) => Number(x.id) - Number(y.id));
}

export type ConnectionState = "connecting" | "live" | "offline";

export function useChatRoom(roomId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 연결은 SocketProvider 가 들고 있다. 이 훅은 방 하나를 구독할 뿐이다.
  const { state: connection, error: socketError, subscribe } = useSocket();
  const previousConnectionRef = useRef<ConnectionState>(connection);

  // 방이 바뀌면 렌더 중에 상태를 초기화한다.
  // 효과 안에서 초기화하면 이전 방의 메시지가 한 번 그려진 뒤 지워지고, 연쇄 렌더가 생긴다.
  const [renderedRoomId, setRenderedRoomId] = useState(roomId);
  if (roomId !== renderedRoomId) {
    setRenderedRoomId(roomId);
    setMessages([]);
    setHasMore(true);
    setError(null);
  }

  const loadLatest = useCallback(async (signal?: AbortSignal) => {
    if (!roomId) return;
    try {
      const past = await chatService.findMessages(roomId, undefined, signal);
      if (signal?.aborted) return;
      setMessages((prev) => mergeById(prev, past));
      if (past.length === 0) setHasMore(false);
      await chatService.markRead(roomId);
    } catch (reason) {
      if (signal?.aborted) return;
      setError(reason instanceof Error ? reason.message : "대화를 불러오지 못했습니다.");
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const controller = new AbortController();

    // 순서가 중요하다: 먼저 구독을 걸고 그 다음 과거를 불러온다.
    // 반대로 하면 그 사이에 도착한 메시지가 누락된다.
    const unsubscribe = subscribe(`/topic/chat.${roomId}`, (body) => {
      if (isChatMessage(body)) setMessages((prev) => mergeById(prev, [body]));
    });
    // 조회는 비동기라 상태 갱신이 렌더 이후에 일어난다. 규칙이 그걸 구분하지 못해 꺼둔다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLatest(controller.signal);

    return () => {
      unsubscribe();
      controller.abort();
    };
  }, [roomId, subscribe, loadLatest]);

  // 끊겼다 다시 붙으면 그 사이 놓친 구간을 과거 조회로 메운다.
  useEffect(() => {
    const previous = previousConnectionRef.current;
    previousConnectionRef.current = connection;
    if (previous === "offline" && connection === "live") void loadLatest();
  }, [connection, loadLatest]);

  /** 위로 스크롤 시 더 오래된 메시지를 커서로 불러온다. */
  const loadOlder = useCallback(async () => {
    if (!roomId || isLoadingMore || !hasMore || messages.length === 0) return;
    setIsLoadingMore(true);
    try {
      const older = await chatService.findMessages(roomId, messages[0].id);
      if (older.length === 0) setHasMore(false);
      else setMessages((prev) => mergeById(older, prev));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "이전 대화를 불러오지 못했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [roomId, isLoadingMore, hasMore, messages]);

  const send = useCallback(async (content: string) => {
    if (!roomId) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      // 전송 응답으로 바로 화면에 반영한다. 구독으로 같은 메시지가 또 와도 id 로 합쳐진다.
      const saved = await chatService.send(roomId, trimmed);
      setMessages((prev) => mergeById(prev, [saved]));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "메시지를 보내지 못했습니다.");
    }
  }, [roomId]);

  // 실시간 연결이 거절된 사유도 같은 자리에 보여 준다. 안 보이면 "왜 안 오는지" 알 수 없다.
  return { messages, connection, error: error ?? socketError, send, loadOlder, isLoadingMore, hasMore };
}
