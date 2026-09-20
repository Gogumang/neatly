import Link from "next/link";
import { cx } from "@/shared/lib/cx";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./IconButton.module.css";

/** 아이콘 모양의 페이지 이동 링크 (서버 컴포넌트에서도 쓸 수 있다) */
export function IconLink({
  href,
  icon,
  label,
  className,
}: {
  href: string;
  icon: IconName;
  label: string;
  className?: string;
}) {
  return (
    <Link href={href} aria-label={label} title={label} className={cx(styles.button, styles.medium, className)}>
      <Icon name={icon} />
    </Link>
  );
}
