"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/app/home",
    icon: (
      <>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
      </>
    ),
  },
  {
    label: "Log",
    href: "/app/log",
    icon: (
      <>
        <path d="M12 4c3 3.4 5 6 5 8.5a5 5 0 0 1-10 0C7 10 9 7.4 12 4Z" />
        <path d="M12 10v5M9.5 12.5h5" />
      </>
    ),
  },
  {
    label: "Train",
    href: "/app/train",
    icon: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  },
  {
    label: "Progress",
    href: "/app/progress",
    icon: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M7 15l4-5 3 3 5-7" />
      </>
    ),
  },
  {
    label: "Community",
    href: "/app/community",
    icon: (
      <>
        <circle cx="8" cy="9" r="3" />
        <circle cx="17" cy="11" r="2.5" />
        <path d="M2.5 19c.8-3 2.7-4.5 5.5-4.5S12.7 16 13.5 19" />
        <path d="M14 15c2.8 0 4.8 1.3 5.5 4" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${active ? "active" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {item.icon}
            </svg>

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
