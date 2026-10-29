import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteTrainingSession, updateTrainingSession } from "@/app/app/train/actions";
import DeleteTrainingButton from "@/components/training/delete-training-button";
import TrainingForm from "@/components/training/training-form";
import DangerZone from "@/components/ui/danger-zone";
import { PageHead } from "@/components/ui/page";
import { getTrainingSessionForUser } from "@/db/training-sessions";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function TrainingSessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const session = await getTrainingSessionForUser(user.id, id);
  if (!session) notFound();

  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Training journal" title="Edit session" sub="Update the details saved with this completed session." />
      <TrainingForm action={updateTrainingSession.bind(null, session.id)} initialValues={session} submitLabel="Save changes" />
      <DangerZone title="Delete this session">
        <DeleteTrainingButton action={deleteTrainingSession.bind(null, session.id)} />
      </DangerZone>
    </div>
  );
}
