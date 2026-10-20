"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SignOutButton from "@/components/auth/sign-out-button";
import { InnerDepthsLogo } from "@/components/brand/inner-depths-logo";

function FutureItem({ children, href, status = "Later" }: { children: React.ReactNode; href: string; status?: string }) {
  return <Link className="drawer-item future" href={href}><span>{children}</span><small>{status}</small></Link>;
}

export default function AppHeader({ name, email, whoopConnected }: { name: string; email: string; whoopConnected: boolean }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); } };
    const frame = window.requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus());
    document.addEventListener("keydown", close); document.body.style.overflow = "hidden";
    return () => { window.cancelAnimationFrame(frame); document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [open]);
  function closeDrawer() { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); }
  function trapFocus(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  return <>
    <header className="app-global-header">
      <button ref={triggerRef} className={`menu-button ${open ? "open" : ""}`} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="app-drawer" onClick={() => open ? closeDrawer() : setOpen(true)}><span /><span /><span /></button>
      <Link href="/app/home" className="header-brand"><InnerDepthsLogo showSubtitle /></Link>
      <Link href="/app/profile" className="avatar-button" aria-label="Open profile"><span>{name.slice(0, 1).toUpperCase()}</span></Link>
    </header>
    <button className={`drawer-scrim ${open ? "open" : ""}`} aria-label="Close menu" tabIndex={open ? 0 : -1} onClick={closeDrawer} />
    <aside ref={drawerRef} id="app-drawer" className={`app-drawer ${open ? "open" : ""}`} aria-hidden={!open} onKeyDown={trapFocus} onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
      <div className="drawer-user"><div className="drawer-avatar">{name.slice(0, 1).toUpperCase()}</div><div><strong>{name}</strong><span>{email}</span><small>{whoopConnected ? "WHOOP connected" : "WHOOP not connected"}</small></div></div>
      <nav className="drawer-nav" aria-label="Inner Depths menu">
        <div className="drawer-group"><span>User</span><Link className="drawer-item" href="/app/profile">Profile</Link><Link className="drawer-item" href="/app/performance-profile">Performance profile</Link></div>
        <div className="drawer-group"><span>Mind Development</span><FutureItem href="/app/coming-soon/cognitive-training">Cognitive training</FutureItem><FutureItem href="/app/coming-soon/neurofeedback" status="Device phase">Neurofeedback</FutureItem></div>
        <div className="drawer-group"><span>Connected devices</span><Link className="drawer-item" href="/app/account">WHOOP &amp; connections <small>{whoopConnected ? "Connected" : "Manage"}</small></Link></div>
        <div className="drawer-group"><span>Your body</span><FutureItem href="/app/coming-soon/labs">Labs</FutureItem><FutureItem href="/app/coming-soon/cycle-tracking">Cycle tracking</FutureItem></div>
        <div className="drawer-group"><span>Beyond training</span><FutureItem href="/app/coming-soon/research">Research</FutureItem><Link className="drawer-item" href="/app/about">Our mission &amp; impact</Link></div>
        <div className="drawer-group"><span>App</span><Link className="drawer-item" href="/app/account">Settings</Link><Link className="drawer-item" href="/app/about">About &amp; safety</Link><Link className="drawer-item" href="/privacy">Privacy policy</Link></div>
      </nav>
      <div className="drawer-footer"><SignOutButton /><InnerDepthsLogo showSubtitle={false} /></div>
    </aside>
  </>;
}
