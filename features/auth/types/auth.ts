export interface CurrentUser {
  name: string | null;
  email: string | null;
  subject: string | null;
  authorities: string[];
  claims: Record<string, unknown>;
}

export interface AuthCheckResponse extends CurrentUser {
  authenticated: boolean;
}
