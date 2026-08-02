/**
 * 롤 → 상단 모드 스위치 연결표.
 *
 * 스위치는 로그인한 사용자가 가진 롤만큼 동적으로 뜬다. 아직 화면이 없는 롤은
 * `href`를 null 로 두면 스위치는 보이되 비활성으로 그려지고, 나중에 페이지가 생기면
 * 여기 `href`만 채우면 바로 연결된다(네비 링크만 걸면 됨).
 */
export interface RoleMode {
  role: string;
  label: string;
  /** 연결된 화면 경로. null 이면 아직 페이지가 없어 비활성으로 표시한다. */
  href: string | null;
}

export const ROLE_MODES: RoleMode[] = [
  { role: "USER", label: "유저 모드", href: "/" },
  { role: "ADMIN", label: "관리자 모드", href: "/admin" },
  { role: "MEMBER", label: "멤버 모드", href: null },
  { role: "MANAGER", label: "매니저 모드", href: null },
  { role: "DEVELOPER", label: "개발자 모드", href: null },
];

/**
 * 사용자가 가진 롤에 해당하는 모드 목록. 표 순서를 따르고, 표에 없는 롤도
 * 코드 그대로 라벨을 붙여 비활성으로 노출한다("권한 있는 만큼 다 보이게").
 */
export function modesForRoles(roles: string[]): RoleMode[] {
  const owned = new Set(roles);
  const known = ROLE_MODES.filter((mode) => owned.has(mode.role));
  const knownRoles = new Set(known.map((mode) => mode.role));
  const unknown: RoleMode[] = roles
    .filter((role) => !knownRoles.has(role))
    .map((role) => ({ role, label: role, href: null }));
  return [...known, ...unknown];
}
