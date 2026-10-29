import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icons";

export function PageHead({ eyebrow, title, sub, actions }: { eyebrow?: string; title: React.ReactNode; sub?: string; actions?: React.ReactNode }) {
  return (
    <header className="ui-head">
      <div>
        {eyebrow ? <span className="ui-eyebrow">{eyebrow}</span> : null}
        <h1 className="ui-title">{title}</h1>
        {sub ? <p className="ui-sub">{sub}</p> : null}
      </div>
      {actions ? <div className="ui-actions">{actions}</div> : null}
    </header>
  );
}

export function Section({ label, aside, children, className = "", id }: { label: string; aside?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section className={`ui-section ${className}`} id={id}>
      <div className="ui-section-head">
        <h2 className="ui-label">{label}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function ButtonLink({ href, children, variant = "primary", icon, size, block }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" | "accent"; icon?: IconName; size?: "sm"; block?: boolean }) {
  return (
    <Link href={href} className={`ui-btn ui-btn-${variant}${size ? " ui-btn-sm" : ""}${block ? " ui-btn-block" : ""}`}>
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </Link>
  );
}

export function SafetyNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="ui-note">
      <Icon name="shield" size={16} />
      <span>{children ?? <>Supports dry training and pre-dive mental preparation only. <strong>Never dive alone.</strong></>}</span>
    </p>
  );
}

export function Info({ children }: { children: React.ReactNode }) {
  return <p className="ui-info"><Icon name="info" size={16} /><span>{children}</span></p>;
}

export function Empty({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="ui-card ui-empty">
      <h2>{title}</h2>
      <p className="ui-sub">{children}</p>
      {action}
    </div>
  );
}
