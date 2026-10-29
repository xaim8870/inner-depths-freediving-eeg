import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteCompletedSession, updateCompletedSession } from "@/app/app/log/sessions/actions";
import CompletedSessionForm from "@/components/log/completed-session-form";
import DeleteCompletedSessionButton from "@/components/log/delete-completed-session-button";
import DangerZone from "@/components/ui/danger-zone";
import { PageHead } from "@/components/ui/page";
import { getCompletedSessionForUser } from "@/db/completed-sessions";
import { requireCurrentUser } from "@/lib/auth-session";
import { completedSessionCategories, completedSessionLabels } from "@/lib/completed-session-options";

export default async function CompletedSessionDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const user = await requireCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const session = await getCompletedSessionForUser(user.id, id);
  if (!session || !completedSessionCategories.includes(session.sessionCategory as (typeof completedSessionCategories)[number])) notFound();
  const category = session.sessionCategory as (typeof completedSessionCategories)[number];
  const query = await searchParams;
  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Retrospective log" title={`Edit ${completedSessionLabels[category].toLowerCase()}`} sub="Update the record of this completed session." />
      {query.saved ? <p className="ui-banner" role="status">Session changes saved.</p> : null}
      <CompletedSessionForm category={category} action={updateCompletedSession.bind(null, session.id)} initialValues={session} />
      <DangerZone title="Delete this session">
        <DeleteCompletedSessionButton action={deleteCompletedSession.bind(null, session.id)} />
      </DangerZone>
    </div>
  );
}
