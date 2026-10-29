import Link from "next/link";
import { BarList, MonthColumns } from "@/components/progress/bars";
import { Icon } from "@/components/ui/icons";
import { ButtonLink, Empty, PageHead, Section } from "@/components/ui/page";
import TrendChart from "@/components/ui/trend-chart";
import { getProgressDashboard } from "@/db/progress";
import { requireCurrentUser } from "@/lib/auth-session";
import { formatDate, formatDepth, formatDuration } from "@/lib/format";
import { disciplineLabels } from "@/lib/profile-options";

export default async function ProgressPage() {
  const user = await requireCurrentUser();
  const d = await getProgressDashboard(user.id);
  const hasDives = d.diveMetrics.totalDives > 0;
  const hasTraining = d.trainingMetrics.totalTrainingSessions > 0;
  const ratings = ([
    ["Overall feel", d.ratingAverages.overallFeel],
    ["Calm at depth", d.ratingAverages.calmAtDepth],
    ["Focus", d.ratingAverages.focus],
    ["Equalization", d.ratingAverages.equalization],
  ] as const).flatMap(([label, value]) => (value === null ? [] : [{ label, value, display: `${Number(value).toFixed(1)} / 5` }]));

  return (
    <div className="ui-page ui-page-wide">
      <PageHead eyebrow="Your data" title="Progress" sub="A factual view of the dives and training sessions you have logged."
        actions={hasDives || hasTraining ? <ButtonLink href="/app/log/new" icon="plus">Log a dive</ButtonLink> : undefined} />

      {!hasDives && !hasTraining ? (
        <Empty title="Nothing to chart yet" action={<ButtonLink href="/app/log/new" icon="plus">Log your first dive</ButtonLink>}>
          Progress fills in from your own dives and training sessions.
        </Empty>
      ) : (
        <>
          <div className="ui-metrics ui-metrics-4">
            <div className="ui-metric"><b>{d.diveMetrics.totalDives}</b><span>Dives logged</span></div>
            <div className="ui-metric"><b>{d.diveMetrics.deepestDive === null ? "–" : formatDepth(d.diveMetrics.deepestDive)}</b><span>Deepest</span></div>
            <div className="ui-metric"><b>{d.diveMetrics.averageOverallFeel === null ? "–" : d.diveMetrics.averageOverallFeel.toFixed(1)}</b><span>Avg overall feel</span></div>
            <div className="ui-metric ui-metric-hide-sm"><b>{d.trainingMetrics.totalTrainingSessions}</b><span>Training sessions</span></div>
          </div>

          {hasDives ? (
            <div className={ratings.length ? "ui-grid ui-grid-main" : "ui-grid"}>
              <TrendChart title="Overall feel" points={d.overallFeelSeries} min={1} max={5}
                caption="Your own 1–5 ratings after each dive. Higher is better — descriptive, not a clinical score." />
              {ratings.length ? <Section label="Dive experience" aside={<span className="ui-pill">Your averages</span>}>
                <div className="ui-card ui-stack">
                  <BarList rows={ratings} max={5} />
                  <p className="ui-info">From {d.ratingAverages.ratedDiveCount} rated dives. Averages describe your entries; they don&apos;t show cause and effect.</p>
                </div>
              </Section> : null}
            </div>
          ) : null}

          {hasDives ? (
            <div className={d.disciplineBreakdown.length > 1 ? "ui-grid ui-grid-2" : "ui-grid"}>
              <TrendChart title="Depth" unit="m" points={d.depthSeries} min={0} max={Math.max(10, Math.ceil((d.diveMetrics.deepestDive ?? 10) / 10) * 10)}
                caption={`${d.diveMetrics.divesLast30Days} dives in the last 30 days · average ${d.diveMetrics.averageDepth === null ? "–" : formatDepth(d.diveMetrics.averageDepth)} · ${formatDuration(d.diveMetrics.totalDiveTimeSeconds)} total dive time`} />
              {d.disciplineBreakdown.length > 1 ? <Section label="Disciplines">
                <div className="ui-card">
                  <BarList max={Math.max(...d.disciplineBreakdown.map((b) => b.count))}
                    rows={d.disciplineBreakdown.map((b) => ({ label: disciplineLabels[b.discipline], value: b.count, display: `${b.count} ${b.count === 1 ? "dive" : "dives"}` }))} />
                </div>
              </Section> : null}
            </div>
          ) : null}

          {hasTraining ? (
            <Section label="Training consistency" aside={<span className="ui-pill">{d.trainingMetrics.trainingSessionsLast30Days} in 30 days</span>}>
              <div className="ui-card ui-stack">
                <MonthColumns months={d.trainingFrequency} />
                <p className="ui-info">{d.trainingMetrics.totalTrainingMinutes} minutes logged{d.trainingMetrics.mostFrequentTrainingType ? ` · most often ${d.trainingMetrics.mostFrequentTrainingType}` : ""}.</p>
              </div>
            </Section>
          ) : null}

          <Section label="Recent activity">
            <div className="ui-card ui-card-list">
              {d.recentActivity.map((item) => {
                const isDive = item.kind === "dive";
                const href = isDive ? `/app/log/${item.id}` : item.sessionCategory === "training" ? `/app/train/${item.id}` : `/app/log/sessions/${item.id}`;
                return (
                  <Link href={href} className="ui-row" key={`${item.kind}-${item.id}`}>
                    <span className="ui-kind">{isDive ? "Dive" : "Train"}</span>
                    <span>
                      {isDive ? disciplineLabels[item.discipline] : item.sessionType}
                      <small>{formatDate(item.date, true)} · {isDive ? `${formatDepth(item.depthMeters)} · ${formatDuration(item.durationSeconds)}` : `${item.durationMinutes} min`}</small>
                    </span>
                    <Icon name="chevron" size={18} />
                  </Link>
                );
              })}
            </div>
          </Section>
        </>
      )}

      <Section label="Baseline · Performance profile">
        <div className="ui-card ui-head">
          <div>
            <h3>{d.performanceProfile ? d.performanceProfile.dominantLabel : "Not completed"}</h3>
            <p className="ui-sub">
              {d.performanceProfile
                ? `Completed ${d.performanceProfile.completedAt.toLocaleDateString("en-GB")}. Describes tendencies; it does not diagnose performance or health.`
                : "Complete the assessment to add your mental-training baseline here."}
            </p>
          </div>
          <Link href="/app/performance-profile" className="ui-link">{d.performanceProfile ? "View profile" : "Complete Performance Profile"} <Icon name="next" size={16} /></Link>
        </div>
      </Section>

      <p className="ui-note ui-note-box"><Icon name="info" size={16} /><span>Everything here is descriptive and exploratory — patterns from your own logs, not clinical conclusions.</span></p>
    </div>
  );
}
