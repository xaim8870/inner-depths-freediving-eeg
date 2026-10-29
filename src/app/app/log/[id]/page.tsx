import { notFound } from "next/navigation";
import { z } from "zod";
import { Icon } from "@/components/ui/icons";
import { ButtonLink, Info, PageHead, SafetyNote } from "@/components/ui/page";
import { getDiveForUser } from "@/db/dives";
import { requireCurrentUser } from "@/lib/auth-session";
import { formatDate, formatDepth, formatDuration } from "@/lib/format";
import { disciplineLabels } from "@/lib/profile-options";

// Dive summary. After a new save (?saved=new) it doubles as the design's "Dive saved" screen.
export default async function DiveDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const user = await requireCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [dive, query] = await Promise.all([getDiveForUser(user.id, id), searchParams]);
  if (!dive) notFound();
  const justSaved = query.saved === "new";

  const rows: Array<[string, string]> = [
    ["Discipline", disciplineLabels[dive.discipline]],
    ["Max depth", formatDepth(dive.depthMeters)],
    ["Dive time", formatDuration(dive.durationSeconds)],
    ["Where", dive.location ?? "—"],
    ["When", `${formatDate(dive.diveDate, true)}${dive.diveTime ? ` · ${dive.diveTime}` : ""}`],
    ...(dive.waterCondition ? [["Water", dive.waterCondition] as [string, string]] : []),
    ...(dive.visibility ? [["Visibility", dive.visibility] as [string, string]] : []),
    ...(dive.currentStrength ? [["Current", dive.currentStrength] as [string, string]] : []),
    ...(dive.equipment ? [["Equipment", dive.equipment] as [string, string]] : []),
    ...(dive.comfort ? [["Comfort", `${dive.comfort}/5`] as [string, string]] : []),
    ...(dive.perceivedEffort ? [["Effort", `${dive.perceivedEffort}/10`] as [string, string]] : []),
  ];
  const scores = ([["Calm at depth", dive.calmAtDepth], ["Focus", dive.focus], ["Overall feel", dive.overallFeel]] as const).filter(([, value]) => value !== null);
  const tags = [...(dive.mentalPreparation ?? []), ...(dive.notableEvent ? [dive.notableEvent] : [])];

  return (
    <div className="ui-page ui-page-narrow">
      {justSaved ? (
        <header className="ui-empty ui-saved-head">
          <span className="ui-check"><Icon name="check" size={36} strokeWidth={2.2} /></span>
          <h1 className="ui-title">Dive saved</h1>
          <p className="ui-sub">Nice work. It&apos;s in your log and counted in Progress.</p>
        </header>
      ) : (
        <PageHead eyebrow={`Dive · ${formatDate(dive.diveDate, true)}${dive.isPersonalBest ? " · Personal best" : ""}`} title={disciplineLabels[dive.discipline]}
          sub={`${formatDepth(dive.depthMeters)}${dive.location ? ` · ${dive.location}` : ""}`}
          actions={<ButtonLink href={`/app/log/${dive.id}/edit`} variant="ghost" size="sm">Edit dive</ButtonLink>} />
      )}
      {query.saved === "1" ? <p className="ui-banner" role="status">Dive changes saved.</p> : null}

      <section className="ui-card ui-stack">
        <h2 className="ui-label">This dive</h2>
        <dl className="ui-dl">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </section>

      {scores.length ? (
        <div className="ui-scores" role="list" aria-label="How it felt">
          {scores.map(([label, value]) => <div role="listitem" key={label}><b>{value}<small>/5</small></b><span>{label}</span></div>)}
        </div>
      ) : null}

      {tags.length || dive.notes ? (
        <section className="ui-card ui-stack">
          <h2 className="ui-label">Prep &amp; notes</h2>
          {tags.length ? <div className="ui-tags">{tags.map((t) => <span className="ui-tag" key={t}>{t}</span>)}</div> : null}
          {dive.notes ? <p className="ui-sub">{dive.notes}</p> : null}
        </section>
      ) : null}

      {justSaved ? (
        <>
          <Info>Patterns in Progress are descriptive and build as you log more dives.</Info>
          <ButtonLink href="/app/progress" icon="progress" block>View progress</ButtonLink>
          <div className="ui-fields-2">
            <ButtonLink href="/app/log/new" variant="ghost" icon="plus" block>Log another</ButtonLink>
            <ButtonLink href="/app/home" variant="ghost" icon="home" block>Home</ButtonLink>
          </div>
        </>
      ) : (
        <ButtonLink href="/app/log" variant="ghost" icon="back">Back to log</ButtonLink>
      )}
      <SafetyNote />
    </div>
  );
}
