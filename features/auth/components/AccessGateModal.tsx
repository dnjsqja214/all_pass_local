"use client";

import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { accessGateDismissed } from "../store/accessGateSlice";
import { PermissionRequiredModal } from "./PermissionRequiredModal/PermissionRequiredModal";

/**
 * 서버가 MEMBERSHIP_REQUIRED 를 돌려줘 accessGate 가 켜지면 안내 모달을 띄운다.
 * 레이아웃에 한 번만 얹으면 모든 화면의 요청에 공통으로 적용된다.
 */
export function AccessGateModal() {
  const dispatch = useAppDispatch();
  const blocked = useAppSelector((state) => state.accessGate.blocked);
  const message = useAppSelector((state) => state.accessGate.message);

  return (
    <PermissionRequiredModal
      isOpen={blocked}
      description={message ?? undefined}
      onClose={() => dispatch(accessGateDismissed())}
    />
  );
}
