"use client";

import React, { useState } from "react";
import { mockMembers } from "../data/mockMembers";
import { useMemberSearch } from "../hooks/useMemberSearch";
import { MemberSearchForm } from "./MemberSearchForm";
import { MemberTable } from "./MemberTable";
import { MemberMobileCardList } from "./MemberMobileCardList";
import { MemberDetailDialog } from "./MemberDetailDialog";
import { Member } from "../types/member";

export function AdminMembersPage() {
  const {
    searchName,
    setSearchName,
    filteredMembers,
    handleSearch,
    handleReset,
  } = useMemberSearch(mockMembers);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleSelectMember = (memberId: string) => {
    const found = mockMembers.find((m) => m.id === memberId) || null;
    setSelectedMember(found);
  };

  return (
    <div className="space-y-6">
      {/* 1. 헤더 영역 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-[26px] font-black text-[#111111] tracking-tight">
            회원 관리
          </h1>
          <p className="text-[13px] text-[#817D76] font-semibold">
            등록된 사용자를 검색하고 학습 현황을 확인할 수 있습니다.
          </p>
        </div>
        <div className="bg-[#111111] text-white text-[12px] font-extrabold px-4 py-2 rounded-full tracking-wide shrink-0 self-start sm:self-center">
          전체 회원 {filteredMembers.length}명
        </div>
      </div>

      {/* 2. 검색 필터 */}
      <MemberSearchForm
        searchName={searchName}
        setSearchName={setSearchName}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 3. 회원 목록 - 데스크톱용 테이블 */}
      <MemberTable
        members={filteredMembers}
        onSelectMember={handleSelectMember}
      />

      {/* 4. 회원 목록 - 모바일용 카드 리스트 */}
      <MemberMobileCardList
        members={filteredMembers}
        onSelectMember={handleSelectMember}
      />

      {/* 5. 회원 상세 다이얼로그 팝업 */}
      <MemberDetailDialog
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
