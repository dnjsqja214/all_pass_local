"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "../../features/admin/components/AdminSidebar";
import { AdminHeader } from "../../features/admin/components/AdminHeader";
import { mockAuthService } from "../../features/auth/services/mockAuthService";

function AdminAuthGuard({ onAuthorized }: { onAuthorized: (auth: boolean) => void }) {
  const router = useRouter();

  useEffect(() => {
    const user = mockAuthService.getCurrentUser();
    if (!user) {
      router.replace("/login");
      onAuthorized(false);
    } else if (user.role !== "admin") {
      alert("관리자 권한이 없습니다. 일반 사용자 페이지로 이동합니다.");
      router.replace("/");
      onAuthorized(false);
    } else {
      onAuthorized(true);
    }
  }, [router, onAuthorized]);

  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // 현재 활성화된 메뉴 식별
  const activeMenu = pathname.startsWith("/admin/members") ? "members" : "today";

  // 데스크톱일 경우 기본적으로 사이드바를 열어두고, 로컬 스토리지에서 접힘 상태를 불러옵니다.
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
    const saved = localStorage.getItem("allpass-admin-sidebar-collapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    const newVal = !isSidebarCollapsed;
    setIsSidebarCollapsed(newVal);
    localStorage.setItem("allpass-admin-sidebar-collapsed", String(newVal));
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex flex-col w-full font-sans overflow-x-hidden">
      <AdminAuthGuard onAuthorized={setIsAuthorized} />

      {isAuthorized === null ? (
        <div className="min-h-screen bg-[#F6F4F0] flex items-center justify-center font-bold text-[#817D76]">
          권한 검증 중...
        </div>
      ) : isAuthorized ? (
        <>
          {/* 1. 관리자 사이드바 (서랍 기능 활성화 및 접힘 접두사 연동) */}
          <AdminSidebar
            activeMenu={activeMenu}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />

          {/* 2. 관리자 메인 영역 (사이드바 공간 확보 - 접힘 상태에 따라 동적 조절) */}
          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
              isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-60"
            }`}
          >
            <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 p-4 lg:p-8 w-full max-w-[1440px] mx-auto">
              {children}
            </main>
          </div>
        </>
      ) : null}
    </div>
  );
}
