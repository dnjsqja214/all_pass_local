"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, X } from "lucide-react";
import type { ChatRoom, ChatRoomDirectory } from "../../types/chat";
import { chatService } from "../../services/chatService";
import { Conversation } from "../Conversation/Conversation";
import { RoomActionDialog } from "../RoomActionDialog/RoomActionDialog";
import { RoomList } from "../RoomList/RoomList";
import styles from "./MessengerWidget.module.css";

const ROOM_POLL_MILLIS = 15_000;
const EMPTY_DIRECTORY: ChatRoomDirectory = {
  publicRooms: [],
  privateRooms: [],
  totalUnread: 0,
};

type RoomTab = "public" | "private";
type DialogMode = "create" | "invite" | null;

interface MessengerWidgetProps {
  currentUserId: string;
  roles: string[];
}

function badgeText(count: number): string {
  return count > 99 ? "99+" : String(count);
}

export function MessengerWidget({ currentUserId, roles }: MessengerWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RoomTab>("private");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [directory, setDirectory] = useState<ChatRoomDirectory>(EMPTY_DIRECTORY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const isAdmin = roles.includes("ADMIN");

  const refreshRooms = useCallback(async (signal?: AbortSignal) => {
    try {
      const rooms = await chatService.findRooms(signal);
      if (signal?.aborted) return;
      setDirectory(rooms);
      setError(null);
    } catch (reason) {
      if (signal?.aborted) return;
      setError(reason instanceof Error ? reason.message : "채팅방 목록을 불러오지 못했습니다.");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const initialTimer = window.setTimeout(
      () => void refreshRooms(controller.signal),
      0,
    );
    const timer = window.setInterval(() => void refreshRooms(), ROOM_POLL_MILLIS);
    return () => {
      controller.abort();
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refreshRooms]);

  const allRooms = useMemo(
    () => [...directory.publicRooms, ...directory.privateRooms],
    [directory],
  );
  const selectedRoom = allRooms.find((room) => room.id === selectedRoomId) ?? null;
  const visibleRooms = activeTab === "public" ? directory.publicRooms : directory.privateRooms;

  const handleSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setNotice(null);
  };

  const handleTabChange = (tab: RoomTab) => {
    setActiveTab(tab);
    setSelectedRoomId(null);
  };

  const handleDialogComplete = async (createdRoom?: ChatRoom) => {
    setDialogMode(null);
    if (createdRoom) {
      setActiveTab(createdRoom.isPublic ? "public" : "private");
      setSelectedRoomId(createdRoom.id);
      setNotice("채팅방을 만들었습니다.");
    } else {
      setNotice("사용자를 초대했습니다.");
    }
    await refreshRooms();
  };

  const handleLeave = async () => {
    if (!selectedRoom || selectedRoom.isPublic) return;
    if (!window.confirm(`"${selectedRoom.name}" 채팅방에서 나가시겠습니까?`)) return;
    try {
      await chatService.leave(selectedRoom.id);
      setSelectedRoomId(null);
      setNotice("채팅방에서 나갔습니다.");
      await refreshRooms();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "채팅방에서 나가지 못했습니다.");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    void refreshRooms();
  };

  return (
    <div className={styles.root}>
      {isOpen && (
        <section
          className={styles.panel}
          data-conversation-open={selectedRoom !== null}
          role="dialog"
          aria-label="메신저"
        >
          <header className={styles.panelHeader}>
            <div>
              <strong>메신저</strong>
              <span>공개방과 초대받은 비공개방</span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="메신저 닫기">
              <X aria-hidden />
            </button>
          </header>

          {(notice || error) && (
            <p className={styles.feedback} data-error={Boolean(error)}>
              {error ?? notice}
            </p>
          )}

          <div className={styles.body}>
            <aside className={styles.directory}>
              <div className={styles.tabs} role="tablist" aria-label="채팅방 분류">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "public"}
                  data-selected={activeTab === "public"}
                  onClick={() => handleTabChange("public")}
                >
                  공개방
                  <span>{directory.publicRooms.length}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "private"}
                  data-selected={activeTab === "private"}
                  onClick={() => handleTabChange("private")}
                >
                  비공개방
                  <span>{directory.privateRooms.length}</span>
                </button>
                <button
                  type="button"
                  className={styles.create}
                  onClick={() => setDialogMode("create")}
                  aria-label="채팅방 만들기"
                >
                  <Plus aria-hidden />
                </button>
              </div>

              {isLoading ? (
                <p className={styles.loading}>채팅방을 불러오는 중...</p>
              ) : (
                <RoomList
                  rooms={visibleRooms}
                  selectedRoomId={selectedRoomId}
                  emptyMessage={
                    activeTab === "public"
                      ? "아직 활성 공개방이 없습니다."
                      : "초대받았거나 직접 만든 비공개방이 없습니다."
                  }
                  onSelect={handleSelect}
                />
              )}
            </aside>

            <Conversation
              room={selectedRoom}
              currentUserId={currentUserId}
              onActivity={refreshRooms}
              onBack={() => setSelectedRoomId(null)}
              onInvite={() => setDialogMode("invite")}
              onLeave={() => void handleLeave()}
            />
          </div>
        </section>
      )}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        aria-label={isOpen ? "메신저 닫기" : "메신저 열기"}
      >
        {isOpen ? <X aria-hidden /> : <MessageCircle aria-hidden />}
        {!isOpen && directory.totalUnread > 0 && (
          <span className={styles.badge}>{badgeText(directory.totalUnread)}</span>
        )}
      </button>

      {dialogMode && (
        <RoomActionDialog
          mode={dialogMode}
          roomId={selectedRoom?.id}
          roomName={selectedRoom?.name}
          isAdmin={isAdmin}
          onClose={() => setDialogMode(null)}
          onComplete={(createdRoom) => void handleDialogComplete(createdRoom)}
        />
      )}
    </div>
  );
}
