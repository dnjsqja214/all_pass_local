"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";

/**
 * 사용자당 STOMP 연결 하나를 들고 있는다.
 *
 * <p>채팅·공지·시험 신호·접속 현황이 이 연결 하나를 함께 쓰고, 갈래는 구독 주소로
 * 나뉜다. 그래서 이 컴포넌트는 시험 대기 게이트보다 <b>바깥</b>에 있어야 한다 —
 * 안쪽에 두면 대기 화면으로 바뀌는 순간 언마운트되면서 연결이 끊긴다.</p>
 */

export type SocketState = "connecting" | "live" | "offline";

interface SocketContextValue {
  state: SocketState;
  /** 서버가 보낸 거절 사유. 연결이 붙으면 지워진다. */
  error: string | null;
  /** 구독하고 해지 함수를 돌려준다. 연결 전에 불러도 되며 연결되면 자동으로 구독된다. */
  subscribe: (destination: string, onMessage: (body: unknown) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

/** 프레임 본문을 JSON 으로 풀어 준다. JSON 이 아니면 원문 그대로 넘긴다. */
function parseBody(frame: IMessage): unknown {
  try {
    return JSON.parse(frame.body);
  } catch {
    return frame.body;
  }
}

function socketUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  if (base) return `${base.replace(/^http/, "ws")}/ws`;
  return `${window.location.origin.replace(/^http/, "ws")}/ws`;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SocketState>("connecting");
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  /**
   * 구독 요청을 모아 둔다. 연결이 끊겼다 붙어도 여기 있는 것들을 다시 걸어 주므로
   * 각 화면은 재연결을 신경 쓰지 않아도 된다.
   */
  const pendingRef = useRef(new Map<string, Set<(body: unknown) => void>>());
  const activeRef = useRef(new Map<string, StompSubscription>());

  useEffect(() => {
    const active = activeRef.current;
    const pending = pendingRef.current;
    const client = new Client({
      brokerURL: socketUrl(),
      // 끊기면 알아서 다시 붙는다. 배포로 파드가 갈릴 때마다 필요하다.
      reconnectDelay: 3000,
      heartbeatIncoming: 25000,
      heartbeatOutgoing: 25000,
    });

    const bind = (destination: string) => {
      if (active.has(destination)) return;
      active.set(destination, client.subscribe(destination, (frame: IMessage) => {
        pending.get(destination)?.forEach((handler) => handler(parseBody(frame)));
      }));
    };

    client.onConnect = () => {
      setState("live");
      setError(null);
      // 재연결이면 이전 구독은 이미 무효다. 요청 목록을 보고 전부 다시 건다.
      active.clear();
      pending.forEach((_handlers, destination) => bind(destination));
    };
    client.onWebSocketClose = () => {
      setState("offline");
      active.clear();
    };
    // 서버가 거절하면 사유가 여기 실려 온다. 삼키면 "연결이 안 된다"는 것밖에 알 수 없다.
    client.onStompError = (frame) => {
      setState("offline");
      setError(frame.headers["message"] ?? "실시간 연결이 거절되었습니다.");
    };

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      active.clear();
      void client.deactivate();
    };
  }, []);

  const value = useMemo<SocketContextValue>(() => ({
    state,
    error,
    subscribe: (destination, onMessage) => {
      const handlers = pendingRef.current.get(destination) ?? new Set();
      handlers.add(onMessage);
      pendingRef.current.set(destination, handlers);

      // 이미 붙어 있으면 즉시 구독한다. 아직이면 onConnect 에서 한꺼번에 걸린다.
      const client = clientRef.current;
      if (client?.connected && !activeRef.current.has(destination)) {
        activeRef.current.set(destination, client.subscribe(destination, (frame: IMessage) => {
          pendingRef.current.get(destination)?.forEach((handler) => handler(parseBody(frame)));
        }));
      }

      return () => {
        const current = pendingRef.current.get(destination);
        current?.delete(onMessage);
        // 마지막 구독자가 떠나면 실제 구독도 해지한다.
        if (current && current.size === 0) {
          pendingRef.current.delete(destination);
          activeRef.current.get(destination)?.unsubscribe();
          activeRef.current.delete(destination);
        }
      };
    },
  }), [state, error]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket은 SocketProvider 안에서 사용해야 합니다.");
  return context;
}
