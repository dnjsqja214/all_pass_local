import Link from "next/link";

type AppMode = "user" | "admin";

interface ModeSwitcherProps {
  activeMode: AppMode;
  roles: string[];
  compact?: boolean;
}

const modes: Array<{ mode: AppMode; label: string; href: string }> = [
  { mode: "user", label: "유저 모드", href: "/" },
  { mode: "admin", label: "관리자 모드", href: "/admin" },
];

export function ModeSwitcher({
  activeMode,
  roles,
  compact = false,
}: ModeSwitcherProps) {
  const roleCount = new Set(roles.filter(Boolean)).size;

  if (roleCount < 2) {
    return null;
  }

  return (
    <nav
      aria-label="화면 모드 전환"
      className="inline-flex shrink-0 items-center rounded-lg border border-[#E4E0D9] bg-[#F6F4F0] p-1"
    >
      {modes.map(({ mode, label, href }) => {
        const isActive = activeMode === mode;

        return (
          <Link
            key={mode}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md font-bold transition-colors ${
              compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"
            } ${
              isActive
                ? "bg-[#151515] text-white shadow-sm"
                : "text-[#817D76] hover:bg-white hover:text-[#111111]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
