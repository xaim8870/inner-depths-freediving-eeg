"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, primaryNav } from "@/components/shell/nav-items";
import { Icon } from "@/components/ui/icons";

// Phone/tablet bottom navigation; hidden on desktop by ui.css.
export default function TabBar() {
  const pathname = usePathname();
  // the multi-step dive flow has its own sticky action bar instead (as in the design)
  if (pathname === "/app/log/new" || /^\/app\/log\/[^/]+\/edit$/.test(pathname)) return null;
  return (
    <nav className="ui-tabbar" aria-label="Primary">
      {primaryNav.map((item) => (
        <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
          <Icon name={item.icon} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
