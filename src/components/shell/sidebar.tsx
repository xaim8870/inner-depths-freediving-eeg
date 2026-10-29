"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/shell/brand";
import { isActive, primaryNav, secondaryNav } from "@/components/shell/nav-items";
import { Icon } from "@/components/ui/icons";

// Desktop (≥1024px) navigation; hidden on smaller screens by ui.css.
export default function Sidebar({ name, whoopConnected }: { name: string; whoopConnected: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="ui-side" aria-label="Inner Depths">
      <Brand tone="light" />
      <nav className="ui-side-nav" aria-label="Primary">
        {primaryNav.map((item) => (
          <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      {secondaryNav.map((group) => (
        <div className="ui-side-group" key={group.title}>
          <span>{group.title.toUpperCase()}</span>
          {group.items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
              {item.later ? <span className="ui-badge-new">SOON</span> : null}
            </Link>
          ))}
        </div>
      ))}
      <div className="ui-side-user">
        <Link href="/app/profile" className="ui-avatar" aria-label="Profile">{name.charAt(0).toUpperCase()}</Link>
        <span>
          {name}
          <small>{whoopConnected ? "WHOOP connected" : "No wearable connected"}</small>
        </span>
        <Link href="/app/account" aria-label="Settings and connections"><Icon name="settings" /></Link>
      </div>
    </aside>
  );
}
