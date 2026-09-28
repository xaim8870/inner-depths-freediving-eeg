import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  title: string;
  description: string;
  footerText?: string;
  footerHref?: string;
  footerLinkText?: string;
  children: ReactNode;
};

export default function AuthShell({
  title,
  description,
  footerText,
  footerHref,
  footerLinkText,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">Inner <span>Depths</span></div>
        <div className="auth-brand-sub">Freediving</div>
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {children}
        {footerHref && footerLinkText && (
          <p className="auth-footer">
            {footerText} <Link href={footerHref}>{footerLinkText}</Link>
          </p>
        )}
        <p className="auth-privacy-link">
          <Link href="/privacy">Privacy</Link>
        </p>
      </div>
    </main>
  );
}
