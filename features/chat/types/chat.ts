export type ChatRoomType = "lounge" | "subject";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  deleted: boolean;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  name: string;
  subjectId: string | null;
  lastMessage: ChatMessage | null;
  unreadCount: number;
}
