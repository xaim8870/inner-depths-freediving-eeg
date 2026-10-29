import Link from "next/link";
import DiveRow from "@/components/dives/dive-row";
import Greeting from "@/components/home/greeting";
import { Icon } from "@/components/ui/icons";
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
  const feel = home.overallFeelSeries.map((point) => point.value);
  const insight = feel.length >= 3 ? deriveHomeInsight(feel) : null; // the "log more" placeholder adds nothing
  const showTrend = home.overallFeelSeries.length >= 2;
  const hasDives = dive.totalDives > 0;
  const goals = home.goals.map((g) => trainingGoals.find((t) => t.id === g.goal)?.label).filter((label): label is (typeof trainingGoals)[number]["label"] => Boolean(label));

  return (
    <div className="ui-page ui-page-wide">
      <section className="ui-hero">
        <div className="ui-head">
          <Greeting name={firstName(home.profile?.displayName ?? user.name)} />
          {/* the screen's one main action; with no dives yet, the empty state below carries it instead */}
          {hasDives ? <div className="ui-actions ui-hero-actions"><ButtonLink href="/app/log/new" icon="plus">Log a dive</ButtonLink></div> : null}
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

      {!hasDives ? (
        <Empty title="Your log starts here" action={<ButtonLink href="/app/log/new" icon="plus">Log your first dive</ButtonLink>}>
          Record a dive you completed with your buddy. Your trends and descriptive patterns build from real entries.
        </Empty>
      ) : null}

      {showTrend || insight ? <div className={showTrend && insight ? "ui-grid ui-grid-main" : "ui-grid"}>
        {showTrend ? <Section label="Performance progress">
          <TrendChart title="Overall feel" points={home.overallFeelSeries} min={1} max={5} ranges={false}
            caption="Your own overall-feel ratings from recent dives. Descriptive only — not a clinical score." />
        </Section> : null}
        {insight ? <Section label="Training insight">
          <article className="ui-card ui-card-dark ui-stack">
            <span className="ui-pill ui-pill-lumen">Descriptive insight</span>
            <h3 className="ui-h-lg">{insight.title}</h3>
            <p className="ui-on-dark">{insight.body}</p>
            <Link href="/app/progress" className="ui-link ui-link-lumen">See progress <Icon name="next" size={16} /></Link>
          </article>
        </Section> : null}
      </div> : null}

      <div className="ui-grid ui-grid-2">
        {hasDives ? <Section label="Recent dives" aside={<Link href="/app/log" className="ui-link">View log</Link>}>
          <div className="ui-card ui-card-list">
            {dive.recentDives.map((d) => <DiveRow key={d.id} dive={d} />)}
          </div>
        </Section> : null}
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
