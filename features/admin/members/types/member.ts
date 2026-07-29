export type MemberStatus = "ACTIVE" | "INACTIVE" | "DORMANT" | "DELETED";

export interface Member {
  id: string;
  authUuid: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: MemberStatus;
  createdAt: string;
  provider: string | null;
}
