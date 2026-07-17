import { MockAccount } from "../types/auth";

const STORAGE_KEY = "allpass_user";

export const mockAuthService = {
  getCurrentUser(): MockAccount | null {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    try {
      return JSON.parse(item) as MockAccount;
    } catch {
      return null;
    }
  },

  login(account: MockAccount): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
};
