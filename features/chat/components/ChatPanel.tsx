"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { chatService } from "../services/chatService";
import { useChatRoom } from "../hooks/useChatRoom";
import type { ChatRoom } from "../types/chat";
import styles from "./ChatPanel.module.css";

const CONNECTION_LABEL = {
  connecting: "연결 중",
  live: "실시간",
  offline: "재연결 중",
} as const;

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
}

export function ChatPanel({ myUserId }: { myUserId: string | null }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(0);

  const { messages, connection, error, send, loadOlder, isLoadingMore, hasMore } = useChatRoom(roomId);

  useEffect(() => {
    const controller = new AbortController();
    chatService
      .findRooms(controller.signal)
      .then((loaded) => {
        setRooms(loaded);
        setRoomId((current) => current ?? loaded[0]?.id ?? null);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setRoomsError(reason instanceof Error ? reason.message : "채팅방을 불러오지 못했습니다.");
      });
    return () => controller.abort();
  }, []);

  // 새 메시지가 오면 맨 아래로. 위로 스크롤해 과거를 불러온 경우엔 위치를 유지한다.
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    const appended = messages.length - previousCount.current;
    previousCount.current = messages.length;
    if (appended > 0 && !isLoadingMore) element.scrollTop = element.scrollHeight;
  }, [messages, isLoadingMore]);

  // 방을 보고 있는 동안 온 메시지는 읽은 것으로 처리해 뱃지를 지운다.
  useEffect(() => {
    if (!roomId || messages.length === 0) return;
    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, unreadCount: 0 } : room)));
  }, [roomId, messages.length]);

  const activeRoom = useMemo(() => rooms.find((room) => room.id === roomId) ?? null, [rooms, roomId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft;
    setDraft("");
    await send(content);
  };

  const handleSelect = (nextRoomId: string) => {
    setRoomId(nextRoomId);
    void chatService.markRead(nextRoomId).catch(() => undefined);
    setRooms((prev) => prev.map((room) => (room.id === nextRoomId ? { ...room, unreadCount: 0 } : room)));
  };

  return (
    <div className={styles.chat}>
      <aside>
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            data-selected={room.id === roomId}
            onClick={() => handleSelect(room.id)}
          >
            <strong>{room.name}</strong>
            {room.unreadCount > 0 && <span data-unread>{room.unreadCount}</span>}
            <small>{room.lastMessage ? room.lastMessage.content : "대화가 없습니다"}</small>
          </button>
        ))}
      </aside>

      <section>
        <header>
          <h2>{activeRoom ? activeRoom.name : "채팅"}</h2>
          <span data-state={connection}>{CONNECTION_LABEL[connection]}</span>
        </header>

        <div ref={listRef} data-list>
          {hasMore && messages.length > 0 && (
            <button type="button" data-more onClick={() => void loadOlder()} disabled={isLoadingMore}>
              {isLoadingMore ? "불러오는 중" : "이전 대화 더 보기"}
            </button>
          )}

          {messages.length === 0 ? (
            <p data-empty>{roomsError ?? "대화를 시작해 보세요"}</p>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                data-mine={message.senderId === myUserId}
                data-deleted={message.deleted}
              >
                <span data-sender>{message.senderName}</span>
                <p>{message.content}</p>
                <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
              </article>
            ))
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={(event) => void handleSubmit(event)}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="메시지를 입력하세요"
            maxLength={1000}
            disabled={!roomId}
          />
          <button type="submit" disabled={!roomId || draft.trim().length === 0}>
            전송
          </button>
        </form>
      </section>
    </div>
  );
}
