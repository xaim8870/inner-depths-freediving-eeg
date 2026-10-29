import { notFound } from "next/navigation";
import CompletedSessionForm from "@/components/log/completed-session-form";
import { createCompletedSession } from "@/app/app/log/sessions/actions";
import { PageHead } from "@/components/ui/page";
import { completedSessionCategories, completedSessionLabels } from "@/lib/completed-session-options";

export default async function NewCompletedSessionPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  if (!completedSessionCategories.includes(type as (typeof completedSessionCategories)[number])) notFound();
  const category = type as (typeof completedSessionCategories)[number];
  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Retrospective log" title={`Log ${completedSessionLabels[category].toLowerCase()}`} sub="Record a session you already completed with supervision in place." />
      <CompletedSessionForm category={category} action={createCompletedSession} />
    </div>
  );
}
