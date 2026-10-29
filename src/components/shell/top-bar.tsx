"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignOutButton from "@/components/auth/sign-out-button";
import Brand from "@/components/shell/brand";
import { isActive, primaryNav, secondaryNav } from "@/components/shell/nav-items";
import { Icon } from "@/components/ui/icons";

// Phone/tablet header with the menu drawer; hidden on desktop by ui.css.
export default function TopBar({ name }: { name: string }) {
  const pathname = usePathname();
  const dark = pathname === "/app/home"; // Home's hero continues the dark header
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  }
  function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return (
    <>
      <header className={`ui-top${dark ? " ui-top-dark" : ""}`}>
        <button ref={trigger} type="button" className="ui-icon-btn" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
          <Icon name="menu" />
        </button>
        <Brand tone={dark ? "light" : "dark"} />
        <Link href="/app/profile" className="ui-avatar" aria-label="Profile">{name.charAt(0).toUpperCase()}</Link>
      </header>
      <div className="ui-drawer" hidden={!open}>
        <button type="button" className="ui-scrim" aria-label="Close menu" tabIndex={-1} onClick={close} />
        <div ref={panel} className="ui-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapFocus} onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
          <button type="button" className="ui-icon-btn" aria-label="Close menu" onClick={close}><Icon name="close" /></button>
          <nav className="ui-side-nav" aria-label="Menu">
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
          <div className="ui-side-group">
            <span>ACCOUNT</span>
            <Link href="/app/profile">Profile</Link>
            <Link href="/privacy">Privacy policy</Link>
            <SignOutButton />
          </div>
        </div>
      </div>
    </>
  );
}
