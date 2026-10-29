import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { Dive } from "@/db/dives";
import { formatDate, formatDepth, formatDuration } from "@/lib/format";
import { disciplineLabels } from "@/lib/profile-options";

// One dive in a list: overall feel (or comfort) as the score tile, then date and summary.
export default function DiveRow({ dive }: { dive: Dive }) {
  const score = dive.overallFeel ?? dive.comfort;
  return (
    <Link className="ui-row" href={`/app/log/${dive.id}`}>
      <span className="ui-score" aria-label={score ? `Feel ${score} of 5` : "No rating"}>{score ? `${score}/5` : "–"}</span>
      <span>
        {formatDate(dive.diveDate)}{dive.isPersonalBest ? " · PB" : ""}
        <small>{disciplineLabels[dive.discipline]} · {formatDepth(dive.depthMeters)} · {formatDuration(dive.durationSeconds)}{dive.location ? ` · ${dive.location}` : ""}</small>
      </span>
      <Icon name="chevron" size={18} />
    </Link>
  );
}
