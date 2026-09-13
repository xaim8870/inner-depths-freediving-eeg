export default function CycleSummary() {
  return (
    <article className="cycle-summary">
      <span className="cycle-summary-dot" aria-hidden="true" />
      <div className="cycle-summary-meta">
        <div className="cycle-summary-primary">Ovulatory · Day 14</div>
        <div className="cycle-summary-secondary">Cycle · estimated · private</div>
      </div>
      <svg
        className="cycle-summary-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </article>
  );
}
