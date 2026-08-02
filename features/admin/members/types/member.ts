export type MemberStatus = "ACTIVE" | "INACTIVE" | "DORMANT" | "DELETED";

/**
 * 역할 코드는 고정 목록이 아니라 서버가 내려주는 대로 다룬다.
 * (편집기에 그릴 스위치는 로그인한 관리자가 가진 권한에서 만든다 — 자기가 가진 것만 부여 가능)
 */
export type MemberRole = string;

/** 모든 회원이 기본으로 보유하는 역할. 편집기에서 해제할 수 없다. */
export const BASE_ROLE = "USER";

export interface Member {
  id: string;
  authUuid: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: MemberStatus;
  createdAt: string;
  provider: string | null;
  roles: MemberRole[];
}
