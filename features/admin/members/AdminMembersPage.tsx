"use client";

import React, { useEffect, useState } from "react";
import { useMemberSearch } from "./hooks/useMemberSearch";
import { MemberSearchForm } from "./components/MemberSearchForm";
import { MemberTable } from "./components/MemberTable";
import { MemberMobileCardList } from "./components/MemberMobileCardList";
import { memberService } from "./services/memberService";
import type { Member } from "./types/member";
import styles from "./AdminMembersPage.module.css";

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    searchName,
    setSearchName,
    filteredMembers,
    handleSearch,
    handleReset,
  } = useMemberSearch(members);

  useEffect(() => {
    const controller = new AbortController();
    memberService.findAll(controller.signal)
      .then(setMembers)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "회원 목록을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className={styles.page}>
      {/* 1. 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>회원 관리</h1>
          <p className={styles.description}>
            실제 사용자 테이블에 등록된 회원 정보를 확인할 수 있습니다.
          </p>
        </div>
        <div className={styles.countBadge}>전체 회원 {members.length}명</div>
      </div>

      {/* 2. 검색 필터 */}
      <MemberSearchForm
        searchName={searchName}
        setSearchName={setSearchName}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {isLoading ? (
        <p className={styles.state}>회원 목록을 불러오는 중입니다.</p>
      ) : error ? (
        <p className={styles.state} data-error>{error}</p>
      ) : (
        <>
          <MemberTable members={filteredMembers} />
          <MemberMobileCardList members={filteredMembers} />
        </>
      )}
    </div>
  );
}
