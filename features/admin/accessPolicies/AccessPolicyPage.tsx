"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { accessPolicyService, type FeaturePolicy } from "./services/accessPolicyService";
import styles from "./AccessPolicyPage.module.css";

export function AccessPolicyPage() {
  const { user } = useAuth();
  // 부여 가능한 롤 = 내가 가진 롤(회원 관리와 같은 위임 규칙).
  const roleOptions = [...(user?.roles ?? [])].sort();
  const [policies, setPolicies] = useState<FeaturePolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    accessPolicyService.findAll(controller.signal)
      .then(setPolicies)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "접근 정책을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const handleUpdated = (featureKey: string, requiredRole: string) => {
    setPolicies((current) => current.map((policy) =>
      policy.featureKey === featureKey ? { ...policy, requiredRole } : policy));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>권한 관리</h1>
        <p className={styles.description}>
          각 기능을 사용하려면 어떤 권한이 필요한지 정합니다.
          기능 목록은 코드(@RequiresFeature)에서 자동 등록되며, 여기서는 필요한 권한만 바꿉니다.
        </p>
      </div>

      {isLoading ? (
        <p className={styles.state}>불러오는 중입니다.</p>
      ) : error ? (
        <p className={styles.state} data-error>{error}</p>
      ) : policies.length === 0 ? (
        <p className={styles.state}>등록된 기능이 없습니다.</p>
      ) : (
        <div className={styles.list}>
          {policies.map((policy) => (
            <PolicyRow
              key={policy.featureKey}
              policy={policy}
              roleOptions={roleOptions}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PolicyRowProps {
  policy: FeaturePolicy;
  roleOptions: string[];
  onUpdated: (featureKey: string, requiredRole: string) => void;
}

function PolicyRow({ policy, roleOptions, onUpdated }: PolicyRowProps) {
  const [role, setRole] = useState(policy.requiredRole);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = role !== policy.requiredRole;
  // 현재 요구 롤이 내가 못 가진 것이어도 표시되도록 목록에 포함한다.
  const options = roleOptions.includes(policy.requiredRole)
    ? roleOptions
    : [policy.requiredRole, ...roleOptions];

  const save = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await accessPolicyService.updateRole(policy.featureKey, role);
      onUpdated(policy.featureKey, role);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <strong className={styles.feature}>{policy.description || policy.featureKey}</strong>
        <span className={styles.key}>{policy.featureKey}</span>
      </div>
      <div className={styles.control}>
        <select
          className={styles.select}
          value={role}
          disabled={isSaving}
          onChange={(event) => setRole(event.target.value)}
          aria-label={`${policy.featureKey} 필요 권한`}
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button type="button" className={styles.save} disabled={!isDirty || isSaving} onClick={save}>
          {isSaving ? "저장 중" : "저장"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
