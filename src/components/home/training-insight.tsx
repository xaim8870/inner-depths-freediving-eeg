import SectionHeading from "./section-heading";

export default function TrainingInsight() {
  return (
    <section aria-label="Training insight">
      <SectionHeading>Training insight</SectionHeading>
      <article className="training-insight-card">
        <svg
          className="training-insight-wave"
          viewBox="0 0 150 90"
          fill="none"
          stroke="#7FE6DE"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M0 45 q10 -12 20 0 t20 0 q20 0 35 -10 q40 -14 75 2" />
        </svg>
        <span className="exploratory-insight-pill">Exploratory insight</span>
        <h3>Relaxation training is showing up at depth</h3>
        <p>
          On dives following a relaxation session and 7+ hours of sleep, you
          reported feeling calmer at depth on 4 of your last 5 sessions. Worth
          keeping relaxation in the day before deep days.
        </p>
      </article>
    </section>
  );
}
