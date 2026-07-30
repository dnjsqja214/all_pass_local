export type MemberStatus = "ACTIVE" | "INACTIVE" | "DORMANT" | "DELETED";
export const MEMBER_ROLES = ["USER", "ADMIN"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

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
