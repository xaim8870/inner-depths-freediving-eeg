import Link from "next/link";
import DiveCard from "@/components/dives/dive-card";
import DiveList from "@/components/dives/dive-list";
import SectionHeading from "@/components/home/section-heading";
import type { Dive } from "@/db/dives";

type RecentDivesProps = {
  latestDive: Dive | null;
  recentDives: Dive[];
};

export default function RecentDives({ latestDive, recentDives }: RecentDivesProps) {
  if (!latestDive) return null;
  const earlierDives = recentDives.filter((dive) => dive.id !== latestDive.id);

  return (
    <section aria-label="Recent dives" className="home-recent-dives">
      <SectionHeading
        accessory={<Link href="/app/log" className="home-view-log">View log</Link>}
      >
        Recent dives
      </SectionHeading>

      <div className="home-latest-dive">
        <span className="home-latest-label">Latest</span>
        <DiveCard dive={latestDive} />
      </div>

      {earlierDives.length > 0 ? <DiveList dives={earlierDives} /> : null}
    </section>
  );
}
