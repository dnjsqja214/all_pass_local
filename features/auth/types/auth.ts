export interface CurrentUser {
  authUuid: string;
  name: string;
  email: string;
  roles: string[];
}

export type MeResponse = CurrentUser;
