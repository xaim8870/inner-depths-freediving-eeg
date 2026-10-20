import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteCompletedSession, updateCompletedSession } from "@/app/app/log/sessions/actions";
import CompletedSessionForm from "@/components/log/completed-session-form";
import DeleteCompletedSessionButton from "@/components/log/delete-completed-session-button";
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
  return <section className="training-editor-page">
    <header className="training-editor-header"><div className="dive-eyebrow">Retrospective log</div><h1>Edit {completedSessionLabels[category].toLowerCase()}</h1><p>Update the record of this completed session.</p></header>
    {query.saved ? <p className="save-success save-banner" role="status">Session changes saved.</p> : null}
    <CompletedSessionForm category={category} action={updateCompletedSession.bind(null, session.id)} initialValues={session} />
    <div className="dive-danger-zone"><div><h2>Delete this session</h2><p>This permanently removes it from your history.</p></div><DeleteCompletedSessionButton action={deleteCompletedSession.bind(null, session.id)} /></div>
  </section>;
}
