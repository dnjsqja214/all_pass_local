"use client";

import { ChatPanel } from "../../../features/chat/components/ChatPanel";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import styles from "./page.module.css";

export default function ChatPage() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <ChatPanel myUserId={user?.id ?? null} />
    </div>
  );
}
