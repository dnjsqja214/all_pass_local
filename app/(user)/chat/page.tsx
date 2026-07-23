"use client";

import { ChatPanel } from "../../../features/chat/components/ChatPanel";
import { useAuth } from "../../../features/auth/hooks/useAuth";

export default function ChatPage() {
  const { user } = useAuth();

  return <ChatPanel myUserId={user?.id ?? null} />;
}
