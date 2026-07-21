"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "../../features/admin/components/AdminSidebar";
import { AdminHeader } from "../../features/admin/components/AdminHeader";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { authService } from "../../features/auth/services/authService";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status: authStatus, user, error: authError } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const hasAdminRole = user?.roles.includes("ADMIN") ?? false;

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (authStatus === "authenticated" && !hasAdminRole) {
      router.replace("/");
    }
  }, [authStatus, hasAdminRole, router]);

  // 현재 활성화된 메뉴 식별
  const activeMenu = pathname.startsWith("/admin/members")
    ? "members"
    : pathname.startsWith("/admin/exam-schedules") ? "exam-schedules" : "today";

  // 데스크톱일 경우 기본적으로 사이드바를 열어두고, 로컬 스토리지에서 접힘 상태를 불러옵니다.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      const saved = localStorage.getItem("allpass-admin-sidebar-collapsed");
      if (saved !== null) setIsSidebarCollapsed(saved === "true");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleToggleCollapse = () => {
    const newVal = !isSidebarCollapsed;
    setIsSidebarCollapsed(newVal);
    localStorage.setItem("allpass-admin-sidebar-collapsed", String(newVal));
  };

  const handleLogout = () => {
    authService.redirectToLogout(`${window.location.origin}/login`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-page-background)] text-[var(--color-text-primary)] flex flex-col w-full font-sans overflow-x-hidden">
      {authStatus === "loading" || authStatus === "unauthenticated" ? (
        <div className="min-h-screen bg-[#F6F4F0] flex items-center justify-center font-bold text-[#817D76]">
          로그인 확인 중...
        </div>
      ) : authStatus === "error" ? (
        <div className="min-h-screen bg-[#F6F4F0] flex flex-col gap-2 items-center justify-center px-4 text-center">
          <p className="font-bold text-[#111111]">로그인 상태를 확인할 수 없습니다.</p>
          <p className="text-sm text-[#817D76]">{authError}</p>
        </div>
      ) : !hasAdminRole ? (
        <div className="min-h-screen bg-[#F6F4F0] flex items-center justify-center font-bold text-[#817D76]">
          일반 사용자 화면으로 이동 중...
        </div>
      ) : (
        <>
          {/* 1. 관리자 사이드바 (서랍 기능 활성화 및 접힘 접두사 연동) */}
          <AdminSidebar
            activeMenu={activeMenu}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
            onLogout={handleLogout}
          />

          {/* 2. 관리자 메인 영역 (사이드바 공간 확보 - 접힘 상태에 따라 동적 조절) */}
          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
              isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-60"
            }`}
          >
            <AdminHeader
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
              user={user}
              onLogout={handleLogout}
            />
            <main className="flex-1 p-4 lg:p-8 w-full max-w-[1440px] mx-auto">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
