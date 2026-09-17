import TrainingCard from "@/components/training/training-card";
import type { TrainingSession } from "@/db/training-sessions";

export default function TrainingList({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <div className="training-list">
      {sessions.map((session) => <TrainingCard key={session.id} session={session} />)}
    </div>
  );
}
