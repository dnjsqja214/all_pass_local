"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modesForRoles } from "../../roleModes";
import styles from "./ModeSwitcher.module.css";

interface ModeSwitcherProps {
  roles: string[];
  compact?: boolean;
}

/** href 가 현재 경로와 맞으면 활성. "/" 는 정확히 루트일 때만. */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ModeSwitcher({ roles, compact = false }: ModeSwitcherProps) {
  const pathname = usePathname();
  // 스위처는 관리자에게만 보인다. 일반 사용자는 유저/멤버 모드뿐이라 전환할 화면 구분이 없다.
  if (!roles.includes("ADMIN")) return null;
  const modes = modesForRoles(roles);

  return (
    <nav aria-label="화면 모드 전환" className={styles.switcher} data-compact={compact}>
      {modes.map(({ role, label, href }) => {
        if (!href) {
          // 아직 페이지가 없는 롤: 보이되 비활성. roleModes 에 href 를 채우면 활성화된다.
          return (
            <span
              key={role}
              className={styles.link}
              data-disabled="true"
              aria-disabled="true"
              title="준비 중인 화면입니다"
            >
              {label}
            </span>
          );
        }
        return (
          <Link
            key={role}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={styles.link}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
