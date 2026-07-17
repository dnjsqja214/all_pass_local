import React from "react";

interface AdminSidebarProps {
  activeMenu: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ activeMenu, isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    { id: "today", label: "오늘 현황" },
    { id: "members", label: "회원 관리" },
    { id: "attendance", label: "출석 관리" },
    { id: "incorrect", label: "오답·위험군" },
    { id: "report", label: "리포트" },
  ];

  return (
    <>
      {/* 모바일 화면 백드롭 레이어 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-60 bg-[#1C1A17] text-white border-r border-[#2C2A27] z-40 flex flex-col justify-between p-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* 로고 영역 */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-[#ffffff0a]">
            <div className="w-8 h-8 rounded-lg bg-[#C93A35] flex items-center justify-center font-black text-white text-lg">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider uppercase text-white leading-none">
                ALLPASS
              </span>
              <span className="text-[10px] text-[#817D76] font-bold mt-1">Study OS Admin</span>
            </div>
          </div>

          {/* 메뉴 네비게이션 */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold tracking-tight transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#C93A35] text-white shadow-md shadow-[#C93A35]/15"
                      : "text-[#A8A7A5] hover:text-white hover:bg-[#ffffff0a]"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 운영자 프로필 */}
        <div className="bg-[#ffffff05] border border-[#ffffff0a] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white uppercase">
            OP
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[13px] font-bold text-white truncate">
              관리자(운영팀)
            </span>
            <span className="text-[10px] text-[#A8A7A5] truncate">
              admin@allpass.com
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
