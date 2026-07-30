"use client";

import styles from "./BrandRefreshButton.module.css";

interface BrandRefreshButtonProps {
  className?: string;
  badgeClassName?: string;
  textClassName?: string;
  brandClassName?: string;
  subtitleClassName?: string;
  brand: string;
  subtitle?: string;
}

export function BrandRefreshButton({
  className,
  badgeClassName,
  textClassName,
  brandClassName,
  subtitleClassName,
  brand,
  subtitle,
}: BrandRefreshButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`.trim()}
      onClick={() => window.location.reload()}
      aria-label="올패스 새로고침"
    >
      <span className={badgeClassName}>A</span>
      <span className={textClassName}>
        <span className={brandClassName}>{brand}</span>
        {subtitle ? (
          <span className={subtitleClassName}>{subtitle}</span>
        ) : null}
      </span>
    </button>
  );
}
