export interface NavigationItem {
  id: "today" | "exam" | "incorrect" | "profile" | "apply-exam" | "chat";
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
    id: "apply-exam",
    label: "시험 신청",
    path: "/exam-registration",
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
  {
    id: "chat",
    label: "스터디 채팅",
    path: "/chat",
  },
];
