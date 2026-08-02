"use client";

import { useState } from "react";
import { memberService } from "../services/memberService";
import { BASE_ROLE, type Member, type MemberRole } from "../types/member";
import styles from "./MemberRoleEditor.module.css";

interface MemberRoleEditorProps {
  member: Member;
  currentUserId: string;
  /** 로그인한 관리자가 가진 역할. 이 목록으로 스위치를 그린다(가진 것만 부여 가능). */
  grantableRoles: MemberRole[];
  onUpdated: (member: Member) => void;
}

/** 항상 기본 역할(USER)을 포함하고 중복을 제거한다. */
function withBase(roles: MemberRole[]): MemberRole[] {
  return Array.from(new Set<MemberRole>([BASE_ROLE, ...roles]));
}

function sameRoles(left: MemberRole[], right: MemberRole[]): boolean {
  const a = new Set(withBase(left));
  const b = new Set(withBase(right));
  return a.size === b.size && [...a].every((role) => b.has(role));
}

/** 스위치 표시 순서: 기본 역할을 맨 앞, 나머지는 이름순. */
function orderRoles(roles: MemberRole[]): MemberRole[] {
  return [...new Set(roles)].sort((left, right) => {
    if (left === BASE_ROLE) return -1;
    if (right === BASE_ROLE) return 1;
    return left.localeCompare(right);
  });
}

export function MemberRoleEditor({
  member,
  currentUserId,
  grantableRoles,
  onUpdated,
}: MemberRoleEditorProps) {
  // 편집 대상의 전체 역할을 들고 있는다. 스위치가 없는 역할(내가 못 다루는 것)도 그대로 보존된다.
  const [roles, setRoles] = useState<MemberRole[]>(() => withBase(member.roles));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = member.id === currentUserId;
  const isDirty = !sameRoles(roles, member.roles);
  const switches = orderRoles(grantableRoles);

  const isLocked = (role: MemberRole): boolean =>
    role === BASE_ROLE || (role === "ADMIN" && isSelf);

  const toggle = (role: MemberRole) => {
    if (isLocked(role) || isSaving) return;
    setError(null);
    setRoles((current) => current.includes(role)
      ? withBase(current.filter((selected) => selected !== role))
      : withBase([...current, role]));
  };

  const save = async () => {
    setIsSaving(true);
    setError(null);
    try {
      onUpdated(await memberService.updateRoles(member.id, withBase(roles)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "권한 변경에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setRoles(withBase(member.roles));
    setError(null);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.controls}>
        <div className={styles.roles}>
          {switches.map((role) => {
            const locked = isLocked(role);
            return (
              <label key={role} className={styles.role} data-locked={locked}>
                <input
                  type="checkbox"
                  checked={roles.includes(role)}
                  disabled={locked || isSaving}
                  onChange={() => toggle(role)}
                  aria-label={`${member.email} ${role} 권한`}
                />
                <span>{role}</span>
              </label>
            );
          })}
        </div>
        <div className={styles.actions}>
          {isDirty && (
            <button type="button" className={styles.reset} disabled={isSaving} onClick={reset}>
              취소
            </button>
          )}
          <button type="button" className={styles.save} disabled={!isDirty || isSaving} onClick={save}>
            {isSaving ? "저장 중" : "저장"}
          </button>
        </div>
      </div>
      {isSelf && <p className={styles.hint}>본인의 ADMIN 권한은 해제할 수 없습니다.</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
