import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteTrainingSession, updateTrainingSession } from "@/app/app/train/actions";
import DeleteTrainingButton from "@/components/training/delete-training-button";
import TrainingForm from "@/components/training/training-form";
import { getTrainingSessionForUser } from "@/db/training-sessions";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function TrainingSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const session = await getTrainingSessionForUser(user.id, id);
  if (!session) notFound();

  return (
    <section className="training-editor-page">
      <header className="training-editor-header">
        <div className="training-eyebrow">Training journal</div>
        <h1>Edit session</h1>
        <p>Update the details saved with this completed session.</p>
      </header>

      <TrainingForm
        action={updateTrainingSession.bind(null, session.id)}
        initialValues={session}
        submitLabel="Save changes"
      />

      <div className="training-danger-zone">
        <div>
          <h2>Delete this session</h2>
          <p>This permanently removes it from your training history.</p>
        </div>
        <DeleteTrainingButton action={deleteTrainingSession.bind(null, session.id)} />
      </div>
    </section>
  );
}
