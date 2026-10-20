"use client";

export default function PerformanceProfileError({ reset }: { reset: () => void }) {
  return <section className="page-state" role="alert">
    <h1>We couldn’t load your profile</h1>
    <p>Your saved assessment has not been changed. Try loading it again.</p>
    <button type="button" className="assessment-primary" onClick={reset}>Try again</button>
  </section>;
}
