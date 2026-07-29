"use client";

import { useState } from "react";
import { memberService } from "../services/memberService";
import { MEMBER_ROLES, type Member, type MemberRole } from "../types/member";
import styles from "./MemberRoleEditor.module.css";

interface MemberRoleEditorProps {
  member: Member;
  currentUserId: string;
  onUpdated: (member: Member) => void;
}

function normalizeRoles(roles: MemberRole[]): MemberRole[] {
  const selected = new Set<MemberRole>(roles);
  selected.add("USER");
  return MEMBER_ROLES.filter((role) => selected.has(role));
}

function sameRoles(left: MemberRole[], right: MemberRole[]): boolean {
  const normalizedLeft = normalizeRoles(left);
  const normalizedRight = normalizeRoles(right);
  return normalizedLeft.length === normalizedRight.length &&
    normalizedLeft.every((role) => normalizedRight.includes(role));
}

export function MemberRoleEditor({ member, currentUserId, onUpdated }: MemberRoleEditorProps) {
  const [roles, setRoles] = useState<MemberRole[]>(() => normalizeRoles(member.roles));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = member.id === currentUserId;
  const isDirty = !sameRoles(roles, member.roles);

  const isLocked = (role: MemberRole): boolean =>
    role === "USER" || (role === "ADMIN" && isSelf);

  const toggle = (role: MemberRole) => {
    if (isLocked(role) || isSaving) return;
    setError(null);
    setRoles((current) => normalizeRoles(
      current.includes(role)
        ? current.filter((selected) => selected !== role)
        : [...current, role],
    ));
  };

  const save = async () => {
    setIsSaving(true);
    setError(null);
    try {
      onUpdated(await memberService.updateRoles(member.id, normalizeRoles(roles)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "권한 변경에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setRoles(normalizeRoles(member.roles));
    setError(null);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.roles}>
        {MEMBER_ROLES.map((role) => {
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
      {isSelf && <p className={styles.hint}>본인의 ADMIN 권한은 해제할 수 없습니다.</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.save} disabled={!isDirty || isSaving} onClick={save}>
          {isSaving ? "저장 중" : "저장"}
        </button>
        {isDirty && (
          <button type="button" className={styles.reset} disabled={isSaving} onClick={reset}>
            취소
          </button>
        )}
      </div>
    </div>
  );
}
