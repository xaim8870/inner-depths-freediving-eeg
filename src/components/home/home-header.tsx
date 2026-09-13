export default function HomeHeader() {
  return (
    <header className="topbar">
      <button type="button" className="menu-button" aria-label="Open menu">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </button>

      <div className="brand">
        <div className="brand-main">
          Inner <span>Depths</span>
        </div>
        <div className="brand-sub">Freediving</div>
      </div>

      <div className="spacer" />

      <button type="button" className="avatar-button" aria-label="Open profile">
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
      </button>
    </header>
  );
}
