import Link from "next/link";

// Optional/advanced fields stay folded until someone needs them. Opens by itself when it
// already holds a saved value or a validation error, so nothing important is hidden.
export function More({ summary, hint, open, plain, children }: { summary: string; hint?: string; open?: boolean; plain?: boolean; children: React.ReactNode }) {
  return (
    <details className={`ui-more${plain ? " ui-more-plain" : ""}`} open={open || undefined}>
      <summary>{summary}{hint ? <small>{hint}</small> : null}</summary>
      <div>{children}</div>
    </details>
  );
}

// A form's single main action, pinned to the bottom on phones. Cancel is a quiet link, never a second button.
export function FormActions({ cancelHref, children }: { cancelHref: string; children: React.ReactNode }) {
  return (
    <div className="ui-actionbar">
      <Link href={cancelHref} className="ui-link">Cancel</Link>
      {children}
    </div>
  );
}
