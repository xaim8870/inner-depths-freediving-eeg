"use client";
export default function LogError({ reset }: { reset: () => void }) {
  return <section className="page-state"><h1>Your log could not be loaded</h1><p>Please try again.</p><button type="button" className="dive-button dive-button-primary" onClick={reset}>Try again</button></section>;
}
