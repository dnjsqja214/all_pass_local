"use client";

import React, { useState } from "react";
import { mockMembers } from "./data/mockMembers";
import { useMemberSearch } from "./hooks/useMemberSearch";
import { MemberSearchForm } from "./components/MemberSearchForm";
import { MemberTable } from "./components/MemberTable";
import { MemberMobileCardList } from "./components/MemberMobileCardList";
import { MemberDetailDialog } from "./components/MemberDetailDialog";
import { Member } from "./types/member";
import styles from "./AdminMembersPage.module.css";

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
    <div className={styles.page}>
      {/* 1. 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>회원 관리</h1>
          <p className={styles.description}>
            등록된 사용자를 검색하고 학습 현황을 확인할 수 있습니다.
          </p>
        </div>
        <div className={styles.countBadge}>전체 회원 {filteredMembers.length}명</div>
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
