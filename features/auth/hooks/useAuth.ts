"use client";

import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { CurrentUser } from "../types/auth";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    authService
      .getCurrentUser(controller.signal)
      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setStatus("authenticated");
          return;
        }

        setUser(null);
        setStatus("unauthenticated");
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          reason instanceof Error
            ? reason.message
            : "인증 상태를 확인할 수 없습니다.",
        );
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  return { status, user, error };
}
