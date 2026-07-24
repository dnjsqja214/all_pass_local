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
  isPublic: boolean;
  ownerUserId: string;
  name: string;
}

export interface ChatRoomSummary extends ChatRoom {
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

export interface ChatRoomDirectory {
  publicRooms: ChatRoomSummary[];
  privateRooms: ChatRoomSummary[];
  totalUnread: number;
}

export interface InvitedUser {
  id: string;
  email: string;
  name: string;
}
