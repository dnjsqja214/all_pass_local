"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatService, isChatMessage } from "../services/chatService";
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
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number | null>(null);

  useEffect(() => {
    if (!roomId) return;

    let disposed = false;
    const controller = new AbortController();

    setMessages([]);
    setHasMore(true);
    setError(null);
    setConnection("connecting");

    // 순서가 중요하다: 먼저 구독을 열고 그 다음 과거를 불러온다.
    // 반대로 하면 그 사이에 도착한 메시지가 누락된다.
    const connect = () => {
      if (disposed) return;
      const socket = new WebSocket(chatService.socketUrl(roomId));
      socketRef.current = socket;

      socket.onopen = () => {
        if (!disposed) setConnection("live");
      };
      socket.onmessage = (event) => {
        try {
          const parsed: unknown = JSON.parse(event.data as string);
          if (isChatMessage(parsed)) setMessages((prev) => mergeById(prev, [parsed]));
        } catch {
          // 형식이 안 맞는 프레임은 버린다.
        }
      };
      socket.onclose = () => {
        if (disposed) return;
        setConnection("offline");
        // 끊기면 다시 붙는다. 재연결 후 과거를 다시 불러와 빈 구간을 메운다.
        retryRef.current = window.setTimeout(() => {
          connect();
          void loadLatest();
        }, 3000);
      };
      socket.onerror = () => socket.close();
    };

    const loadLatest = async () => {
      try {
        const past = await chatService.findMessages(roomId, undefined, controller.signal);
        if (disposed) return;
        setMessages((prev) => mergeById(prev, past));
        if (past.length === 0) setHasMore(false);
        await chatService.markRead(roomId);
      } catch (reason) {
        if (disposed || controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : "대화를 불러오지 못했습니다.");
      }
    };

    connect();
    void loadLatest();

    return () => {
      disposed = true;
      controller.abort();
      if (retryRef.current !== null) window.clearTimeout(retryRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [roomId]);

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
      // 전송 응답으로 바로 화면에 반영한다. WebSocket 으로 같은 메시지가 또 와도 id 로 합쳐진다.
      const saved = await chatService.send(roomId, trimmed);
      setMessages((prev) => mergeById(prev, [saved]));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "메시지를 보내지 못했습니다.");
    }
  }, [roomId]);

  return { messages, connection, error, send, loadOlder, isLoadingMore, hasMore };
}
