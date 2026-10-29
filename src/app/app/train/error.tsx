"use client";
export default function TrainingError({ reset }: { reset: () => void }) { return <section className="page-state"><h1>Training could not be loaded</h1><p>Please try again.</p><button type="button" className="ui-btn ui-btn-primary" onClick={reset}>Try again</button></section>; }
