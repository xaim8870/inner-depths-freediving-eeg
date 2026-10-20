import { notFound } from "next/navigation";
import CompletedSessionForm from "@/components/log/completed-session-form";
import { createCompletedSession } from "@/app/app/log/sessions/actions";
import { completedSessionCategories, completedSessionLabels } from "@/lib/completed-session-options";

export default async function NewCompletedSessionPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  if (!completedSessionCategories.includes(type as (typeof completedSessionCategories)[number])) notFound();
  const category = type as (typeof completedSessionCategories)[number];
  return <section className="training-editor-page">
    <header className="training-editor-header"><div className="dive-eyebrow">Retrospective log</div><h1>Log {completedSessionLabels[category].toLowerCase()}</h1><p>Record a session you already completed with supervision in place.</p></header>
    <CompletedSessionForm category={category} action={createCompletedSession} />
  </section>;
}

