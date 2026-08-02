export interface NavigationItem {
  id: "today" | "exam" | "profile" | "apply-exam";
  label: string;
  path: string;
  /** 이 롤이 없으면 메뉴에서 숨긴다. 없으면 누구에게나 보인다. */
  requiredRole?: string;
}

export const USER_MENU_ITEMS: NavigationItem[] = [
  {
    id: "today",
    label: "대시보드",
    path: "/",
  },
  {
    id: "apply-exam",
    label: "시험 신청",
    path: "/exam-registration",
    requiredRole: "MEMBER",
  },
  {
    id: "profile",
    label: "학습 관리",
    path: "/learning-management",
  },
];

/** 사용자가 가진 롤로 접근 가능한 메뉴만 남긴다. */
export function visibleMenuItems(roles: string[]): NavigationItem[] {
  return USER_MENU_ITEMS.filter(
    (item) => !item.requiredRole || roles.includes(item.requiredRole),
  );
}
