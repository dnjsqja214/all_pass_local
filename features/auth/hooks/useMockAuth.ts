import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MockAccount } from "../types/auth";
import { mockAuthService } from "../services/mockAuthService";

export function useMockAuth() {
  const [currentUser, setCurrentUser] = useState<MockAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = mockAuthService.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = (account: MockAccount) => {
    mockAuthService.login(account);
    setCurrentUser(account);
    
    // 역할별 페이지 이동
    if (account.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    mockAuthService.logout();
    setCurrentUser(null);
    router.push("/login");
  };

  return {
    currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };
}
