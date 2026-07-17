export interface NavigationItem {
  id: "today" | "exam" | "incorrect" | "profile";
  label: string;
  path: string;
}

export const USER_MENU_ITEMS: NavigationItem[] = [
  {
    id: "today",
    label: "오늘 학습",
    path: "/",
  },
  {
    id: "exam",
    label: "문제 풀이",
    path: "/exam/live",
  },
  {
    id: "incorrect",
    label: "오답 노트",
    path: "/wrong-notes",
  },
  {
    id: "profile",
    label: "학습 관리",
    path: "/learning-management",
  },
];
