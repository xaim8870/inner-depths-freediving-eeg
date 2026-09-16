"use client";

import SignOutButton from "@/components/auth/sign-out-button";

export default function AccountMenu() {
  return (
    <details className="account-menu">
      <summary className="avatar-button" aria-label="Account menu">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
        </svg>
      </summary>
      <div className="account-menu-panel">
        <SignOutButton />
      </div>
    </details>
  );
}
