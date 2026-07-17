export type MemberStatus = "active" | "inactive" | "risk";

export interface Member {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  lastLoginAt: string;
  status: MemberStatus;
  studyMinutes: number;
  recentScore: number;
  wrongAnswerCount: number;
}
