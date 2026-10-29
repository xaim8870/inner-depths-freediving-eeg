"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, isFormRoute, primaryNav } from "@/components/shell/nav-items";
import { Icon } from "@/components/ui/icons";

// Phone/tablet bottom navigation; hidden on desktop by ui.css.
export default function TabBar() {
  const pathname = usePathname();
  // form screens are focus mode: their sticky Save bar replaces the tab bar, so neither covers the other
  if (isFormRoute(pathname)) return null;
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
