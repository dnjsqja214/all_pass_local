export interface NavigationItem {
  id: "today" | "exam" | "profile" | "apply-exam";
  label: string;
  path: string;
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
  },
  {
    id: "profile",
    label: "학습 관리",
    path: "/learning-management",
  },
];
