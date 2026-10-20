"use client";
export default function HomeError({ reset }: { reset: () => void }) { return <section className="page-state"><h1>Your dashboard could not be loaded</h1><p>Please try again.</p><button type="button" className="dive-button dive-button-primary" onClick={reset}>Try again</button></section>; }
