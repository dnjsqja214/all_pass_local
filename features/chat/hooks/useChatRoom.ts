"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatService, isChatMessage } from "../services/chatService";
import { useSocket } from "../../socket/SocketProvider";
import type { ChatMessage } from "../types/chat";

function mergeById(a: ChatMessage[], b: ChatMessage[]): ChatMessage[] {
  const merged = new Map<string, ChatMessage>();
  for (const message of a) merged.set(message.id, message);
  for (const message of b) merged.set(message.id, message);
  return Array.from(merged.values()).sort((x, y) => Number(x.id) - Number(y.id));
}

export type ConnectionState = "connecting" | "live" | "offline";

export function useChatRoom(
  roomId: string | null,
  onActivity?: () => void,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { state: connection, error: socketError, subscribe } = useSocket();
  const previousConnectionRef = useRef<ConnectionState>(connection);

  const [renderedRoomId, setRenderedRoomId] = useState(roomId);
  if (roomId !== renderedRoomId) {
    setRenderedRoomId(roomId);
    setMessages([]);
    setHasMore(true);
    setError(null);
  }

  const markRead = useCallback(async () => {
    if (!roomId) return;
    await chatService.markRead(roomId);
    onActivity?.();
  }, [roomId, onActivity]);

  const loadLatest = useCallback(async (signal?: AbortSignal) => {
    if (!roomId) return;
    try {
      const past = await chatService.findMessages(roomId, undefined, signal);
      if (signal?.aborted) return;
      setMessages((previous) => mergeById(previous, past));
      if (past.length === 0) setHasMore(false);
      await markRead();
    } catch (reason) {
      if (signal?.aborted) return;
      setError(reason instanceof Error ? reason.message : "대화를 불러오지 못했습니다.");
    }
  }, [roomId, markRead]);

  useEffect(() => {
    if (!roomId) return;
    const controller = new AbortController();
    const unsubscribe = subscribe(`/topic/chat.${roomId}`, (body) => {
      if (!isChatMessage(body)) return;
      setMessages((previous) => mergeById(previous, [body]));
      void markRead();
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLatest(controller.signal);

    return () => {
      unsubscribe();
      controller.abort();
    };
  }, [roomId, subscribe, loadLatest, markRead]);

  useEffect(() => {
    const previous = previousConnectionRef.current;
    previousConnectionRef.current = connection;
    if (previous === "offline" && connection === "live") void loadLatest();
  }, [connection, loadLatest]);

  const loadOlder = useCallback(async () => {
    if (!roomId || isLoadingMore || !hasMore || messages.length === 0) return;
    setIsLoadingMore(true);
    try {
      const older = await chatService.findMessages(roomId, messages[0].id);
      if (older.length === 0) setHasMore(false);
      else setMessages((previous) => mergeById(older, previous));
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
      const saved = await chatService.send(roomId, trimmed);
      setMessages((previous) => mergeById(previous, [saved]));
      setError(null);
      onActivity?.();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "메시지를 보내지 못했습니다.");
    }
  }, [roomId, onActivity]);

  return {
    messages,
    connection,
    error: error ?? socketError,
    send,
    loadOlder,
    isLoadingMore,
    hasMore,
  };
}
