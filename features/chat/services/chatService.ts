import { getCsrfToken } from "../../shared/api/csrf";
import type { ChatMessage, ChatRoom, ChatRoomType } from "../types/chat";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRoomType(value: unknown): value is ChatRoomType {
  return value === "lounge" || value === "subject";
}

export function isChatMessage(value: unknown): value is ChatMessage {
  return isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.roomId === "string" &&
    typeof value.senderId === "string" &&
    typeof value.senderName === "string" &&
    typeof value.content === "string" &&
    typeof value.deleted === "boolean" &&
    typeof value.createdAt === "string";
}

function isChatRoom(value: unknown): value is ChatRoom {
  return isRecord(value) &&
    typeof value.id === "string" &&
    isRoomType(value.type) &&
    typeof value.name === "string" &&
    (value.subjectId === null || typeof value.subjectId === "string") &&
    (value.lastMessage === null || isChatMessage(value.lastMessage)) &&
    typeof value.unreadCount === "number";
}

async function parseBody(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function errorMessage(body: unknown, status: number): string {
  return isRecord(body) && typeof body.message === "string"
    ? body.message
    : `채팅 요청에 실패했습니다. (${status})`;
}

async function get<T>(path: string, isValid: (value: unknown) => value is T, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    cache: "no-store",
    signal,
  });
  const body = (await parseBody(response)) as ApiResponse<unknown> | null;
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  if (!isRecord(body) || !isValid(body.data)) throw new Error("채팅 응답 형식이 올바르지 않습니다.");
  return body.data;
}

/** 쓰기 요청은 세션 쿠키와 CSRF 토큰을 함께 보낸다. */
async function post(path: string, payload?: unknown): Promise<unknown> {
  const csrf = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const body = (await parseBody(response)) as ApiResponse<unknown> | null;
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  return isRecord(body) ? body.data : null;
}

function isChatRoomList(value: unknown): value is ChatRoom[] {
  return Array.isArray(value) && value.every(isChatRoom);
}

function isChatMessageList(value: unknown): value is ChatMessage[] {
  return Array.isArray(value) && value.every(isChatMessage);
}

export const chatService = {
  async findRooms(signal?: AbortSignal): Promise<ChatRoom[]> {
    return get("/api/v1/chat/rooms", isChatRoomList, signal);
  },

  /** before 를 주면 그보다 오래된 메시지를 가져온다(위로 스크롤). */
  async findMessages(roomId: string, before?: string, signal?: AbortSignal): Promise<ChatMessage[]> {
    const query = before ? `?before=${encodeURIComponent(before)}` : "";
    return get(`/api/v1/chat/rooms/${roomId}/messages${query}`, isChatMessageList, signal);
  },

  async send(roomId: string, content: string): Promise<ChatMessage> {
    const data = await post(`/api/v1/chat/rooms/${roomId}/messages`, { content });
    if (!isChatMessage(data)) throw new Error("메시지 전송 응답 형식이 올바르지 않습니다.");
    return data;
  },

  async markRead(roomId: string): Promise<void> {
    await post(`/api/v1/chat/rooms/${roomId}/read`);
  },
};
