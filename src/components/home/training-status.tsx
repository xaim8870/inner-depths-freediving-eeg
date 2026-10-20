import Link from "next/link";
import SectionHeading from "./section-heading";
import { trainingGoals, type TrainingGoalId } from "@/lib/training-goals";
export default function TrainingStatus({ goals, performanceProfile }: { goals: string[]; performanceProfile: { completedAt: Date; focus: string } | null }) {
  const labels = goals.map((id) => trainingGoals.find((goal) => goal.id === id as TrainingGoalId)?.label).filter(Boolean);
  return <section><SectionHeading accessory={<Link href="/app/train" className="home-view-log">Open Training</Link>}>Training status</SectionHeading><div className="home-training-status"><div><span>Performance Profile</span>{performanceProfile ? <><strong>{performanceProfile.focus}</strong><p>Completed {performanceProfile.completedAt.toLocaleDateString("en-GB")}. <Link href="/app/performance-profile">View profile</Link></p></> : <><strong>Not completed</strong><p><Link href="/app/performance-profile">Complete Performance Profile</Link> to establish your baseline.</p></>}</div><div><span>Current goals</span>{labels.length ? <ul>{labels.map((label) => <li key={label}>{label}</li>)}</ul> : <p>No training goals selected yet.</p>}</div></div></section>;
}

