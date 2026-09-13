import SectionHeading from "./section-heading";

export default function PerformanceProgress() {
  return (
    <section aria-label="Performance progress">
      <SectionHeading>Performance progress</SectionHeading>
      <article className="progress-chart-card">
        <div className="progress-chart-heading">
          <h3>Dive comfort index</h3>
          <span className="exploratory-pill">Exploratory</span>
        </div>

        <div className="progress-chart-range" aria-label="Chart period: 8 weeks">
          <span className="active">8 wk</span>
          <span>3 mo</span>
          <span>1 yr</span>
        </div>

        <svg
          className="progress-chart-plot"
          viewBox="0 0 340 168"
          fill="none"
          role="img"
          aria-label="Illustrative dive comfort index rises from about 54 on 13 May to 72 now"
        >
          <defs>
            <linearGradient id="comfort-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7FE6DE" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#2E7D97" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <g stroke="#E3EFEC" strokeWidth="1">
            <line x1="30" y1="16" x2="322" y2="16" />
            <line x1="30" y1="49" x2="322" y2="49" />
            <line x1="30" y1="82" x2="322" y2="82" />
            <line x1="30" y1="115" x2="322" y2="115" />
          </g>
          <g fill="#9db8bf" fontSize="9" textAnchor="end">
            <text x="24" y="19">80</text>
            <text x="24" y="85">50</text>
            <text x="24" y="118">20</text>
          </g>
          <path
            d="M30 74 L71 67 L113 70 L155 60 L197 56 L238 61 L280 50 L322 44 L322 115 L30 115 Z"
            fill="url(#comfort-chart-fill)"
          />
          <polyline
            points="30,74 71,67 113,70 155,60 197,56 238,61 280,50 322,44"
            stroke="#2E7D97"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="322" cy="44" r="4.5" fill="#2E7D97" />
          <g fill="#9db8bf" fontSize="9" textAnchor="middle">
            <text x="30" y="134">13 May</text>
            <text x="155" y="134">3 Jun</text>
            <text x="315" y="134">Now</text>
          </g>
        </svg>

        <p className="progress-chart-caption">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <path d="M12 9v4M12 17h.01" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span>
            A blend of your reported calm, focus, and recovery around each dive.
            Higher is better — correlational, not a clinical score.
          </span>
        </p>
      </article>
    </section>
  );
}
