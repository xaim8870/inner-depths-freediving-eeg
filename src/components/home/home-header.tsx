import AccountMenu from "./account-menu";

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

      <AccountMenu />
    </header>
  );
}
