"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { chatService } from "../../services/chatService";
import type { ChatDirectoryUser } from "../../types/chat";
import styles from "./UserPicker.module.css";

interface UserPickerProps {
  selectedEmail: string;
  onSelect: (user: ChatDirectoryUser) => void;
}

export function UserPicker({ selectedEmail, onSelect }: UserPickerProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<ChatDirectoryUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const result = await chatService.searchUsers(query, controller.signal);
        if (!controller.signal.aborted) {
          setUsers(result);
          setError(null);
          setIsLoading(false);
        }
      } catch (reason) {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "사용자 목록을 불러오지 못했습니다.");
          setIsLoading(false);
        }
      }
    }, query ? 250 : 0);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className={styles.picker}>
      <label className={styles.search}>
        <span>초대할 사용자</span>
        <div>
          <Search aria-hidden />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsLoading(true);
            }}
            placeholder="이름 또는 이메일 검색"
            autoComplete="off"
            autoFocus
          />
        </div>
      </label>

      <div className={styles.results}>
        {isLoading ? (
          <p>사용자를 불러오는 중...</p>
        ) : error ? (
          <p data-error="true">{error}</p>
        ) : users.length === 0 ? (
          <p>검색된 활성 사용자가 없습니다.</p>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              type="button"
              data-selected={selectedEmail === user.email}
              data-online={user.online}
              onClick={() => onSelect(user)}
            >
              <span className={styles.dot} aria-hidden />
              <span className={styles.identity}>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </span>
              <span className={styles.status}>{user.online ? "온라인" : "오프라인"}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
