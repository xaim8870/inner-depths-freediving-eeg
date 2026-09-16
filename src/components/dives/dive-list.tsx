import type { Dive } from "@/db/dives";
import DiveCard from "@/components/dives/dive-card";

export default function DiveList({ dives }: { dives: Dive[] }) {
  return (
    <div className="dive-list">
      {dives.map((dive) => <DiveCard key={dive.id} dive={dive} />)}
    </div>
  );
}
