export type UserRole = "admin" | "user";

export interface MockAccount {
  id: string;
  name: string;
  role: UserRole;
}
