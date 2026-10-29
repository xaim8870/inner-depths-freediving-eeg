import Link from "next/link";
import DiveRow from "@/components/dives/dive-row";
import Greeting from "@/components/home/greeting";
import { ButtonLink, Empty, Info, SafetyNote, Section } from "@/components/ui/page";
import TrendChart from "@/components/ui/trend-chart";
import { getHomeDashboard } from "@/db/home";
import { requireCurrentUser } from "@/lib/auth-session";
import { firstName, formatDate, formatDepth } from "@/lib/format";
import { deriveHomeInsight } from "@/lib/home-insight";
import { trainingGoals } from "@/lib/training-goals";

export default async function HomePage() {
  const user = await requireCurrentUser();
  const home = await getHomeDashboard(user.id);
  const dive = home.dive;
  const insight = deriveHomeInsight(home.overallFeelSeries.map((point) => point.value));
  const goals = home.goals.map((g) => trainingGoals.find((t) => t.id === g.goal)?.label).filter((label): label is (typeof trainingGoals)[number]["label"] => Boolean(label));

  return (
    <div className="ui-page ui-page-wide">
      <section className="ui-hero">
        <div className="ui-head">
          <Greeting name={firstName(home.profile?.displayName ?? user.name)} />
          <div className="ui-actions ui-hero-actions">
            <ButtonLink href="/app/train" variant="ghost" icon="train">Start training</ButtonLink>
            <ButtonLink href="/app/log/new" icon="plus">Log a dive</ButtonLink>
          </div>
        </div>
        <div className="ui-section">
          <div className="ui-section-head">
            <h2 className="ui-label">Your diving</h2>
            <Link href="/app/account" className="ui-pill">{home.whoopConnected ? "● WHOOP connected" : "Connect WHOOP"}</Link>
          </div>
          <div className="ui-metrics ui-metrics-4">
            <div className="ui-metric"><span>Dives logged</span><b>{dive.totalDives}</b></div>
            <div className="ui-metric"><span>Deepest</span><b>{dive.deepestDive === null ? "–" : <>{Number(dive.deepestDive).toFixed(0)}<small>m</small></>}</b></div>
            <div className="ui-metric"><span>Last 30 days</span><b>{dive.divesLast30Days}</b></div>
            <div className="ui-metric ui-metric-hide-sm"><span>Training · 30 days</span><b>{home.training.sessionsLast30Days}</b></div>
          </div>
        </div>
      </section>

      {dive.totalDives === 0 ? (
        <Empty title="Your log starts here" action={<ButtonLink href="/app/log/new" icon="plus">Log your first dive</ButtonLink>}>
          Record a dive you completed with your buddy. Your trends and descriptive patterns build from real entries.
        </Empty>
      ) : null}

      <div className="ui-grid ui-grid-main">
        <Section label="Performance progress">
          <TrendChart title="Overall feel" points={home.overallFeelSeries} min={1} max={5} ranges={false}
            caption="Your own overall-feel ratings from recent dives. Descriptive only — not a clinical score." />
        </Section>
        <Section label="Training insight">
          <article className="ui-card ui-card-dark ui-stack">
            <span className="ui-pill ui-pill-lumen">Descriptive insight</span>
            <h3 className="ui-h-lg">{insight.title}</h3>
            <p className="ui-on-dark">{insight.body}</p>
            <ButtonLink href="/app/progress" variant="accent" icon="next" size="sm">See progress</ButtonLink>
          </article>
        </Section>
      </div>

      <div className="ui-grid ui-grid-2">
        <Section label="Recent dives" aside={dive.totalDives ? <Link href="/app/log" className="ui-link">View log</Link> : null}>
          <div className="ui-card ui-card-list">
            {dive.recentDives.length ? dive.recentDives.map((d) => <DiveRow key={d.id} dive={d} />) : <p className="ui-sub ui-pad-y">No dives yet.</p>}
          </div>
        </Section>
        <Section label="Training status" aside={<Link href="/app/train" className="ui-link">Open training</Link>}>
          <div className="ui-card ui-stack">
            <div>
              <span className="ui-eyebrow">Performance profile</span>
              {home.performanceProfile ? (
                <p className="ui-sub"><strong>{home.performanceProfile.focus}</strong> · completed {home.performanceProfile.completedAt.toLocaleDateString("en-GB")}. <Link href="/app/performance-profile" className="ui-link">View</Link></p>
              ) : (
                <p className="ui-sub">Not completed yet. <Link href="/app/performance-profile" className="ui-link">Complete it</Link> to set your baseline.</p>
              )}
            </div>
            <div>
              <span className="ui-eyebrow">Current goals</span>
              {goals.length ? <div className="ui-tags ui-mt-8">{goals.map((g) => <span className="ui-tag" key={g}>{g}</span>)}</div> : <p className="ui-sub">No goals chosen yet.</p>}
            </div>
            {home.training.latestSession ? (
              <Info>Latest training: {home.training.latestSession.sessionType}, {home.training.latestSession.durationMinutes} min on {formatDate(home.training.latestSession.sessionDate)}.</Info>
            ) : null}
            {dive.latestDive ? <Info>Latest dive: {formatDepth(dive.latestDive.depthMeters)} on {formatDate(dive.latestDive.diveDate)}.</Info> : null}
          </div>
        </Section>
      </div>

      <SafetyNote>Supports dry training and pre-dive mental preparation only. <strong>Never dive alone.</strong> <Link href="/app/about" className="ui-link-inline">About &amp; safety</Link></SafetyNote>
    </div>
  );
}
