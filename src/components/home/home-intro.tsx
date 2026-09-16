export default function HomeIntro({ displayName }: { displayName: string }) {
  const currentDate = new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  return (
    <>
      <h1 className="page-title">Welcome back, {displayName}.</h1>
      <p className="page-subtitle">Your dive dashboard · {currentDate}</p>
      <div className="home-wave" aria-hidden="true">
        <svg viewBox="0 0 360 20" preserveAspectRatio="none" fill="none">
          <path d="M0 10 q6 -7 12 0 t12 0 t12 0 t12 0 q18 0 30 -6 q30 -8 60 0 q40 6 80 -2 q50 -8 130 3" />
        </svg>
      </div>
    </>
  );
}
