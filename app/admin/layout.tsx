"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminSidebar } from "../../features/admin/components/AdminSidebar";
import { AdminHeader } from "../../features/admin/components/AdminHeader";

// useSearchParams 호출을 Suspense 경계로 감싸기 위해 서브 컴포넌트로 분리
function AdminAuthGuard({ onAuthorized }: { onAuthorized: (auth: boolean) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userRole = searchParams.get("role");
    
    if (userRole === "student") {
      alert("관리자 권한이 없습니다. 일반 사용자 페이지로 이동합니다.");
      router.replace("/");
      onAuthorized(false);
    } else {
      onAuthorized(true);
    }
  }, [router, searchParams, onAuthorized]);

  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // 데스크톱일 경우 기본적으로 사이드바를 열어둠
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex flex-col w-full font-sans overflow-x-hidden">
      {/* 쿼리 파라미터 체크 로직을 Suspense로 래핑하여 빌드 에러 방지 */}
      <Suspense fallback={null}>
        <AdminAuthGuard onAuthorized={setIsAuthorized} />
      </Suspense>

      {isAuthorized === null ? (
        <div className="min-h-screen bg-[#F6F4F0] flex items-center justify-center font-bold text-[#817D76]">
          권한 검증 중...
        </div>
      ) : isAuthorized ? (
        <>
          {/* 1. 관리자 사이드바 (서랍 기능 활성화) */}
          <AdminSidebar
            activeMenu="today"
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* 2. 관리자 메인 영역 (사이드바 공간 확보 lg:pl-60, 상태에 따라 동적 조절) */}
          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
              sidebarOpen ? "lg:pl-60" : "lg:pl-0"
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
