export default function HomeIntro() {
  return (
    <>
      <h1 className="page-title">Good morning, Mara.</h1>
      <p className="page-subtitle">Your daily check-in · Tue 1 Jul</p>
      <div className="home-wave" aria-hidden="true">
        <svg viewBox="0 0 360 20" preserveAspectRatio="none" fill="none">
          <path d="M0 10 q6 -7 12 0 t12 0 t12 0 t12 0 q18 0 30 -6 q30 -8 60 0 q40 6 80 -2 q50 -8 130 3" />
        </svg>
      </div>
    </>
  );
}
