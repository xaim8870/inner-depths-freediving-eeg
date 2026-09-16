import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteDive, updateDive } from "@/app/app/log/actions";
import DeleteDiveButton from "@/components/dives/delete-dive-button";
import DiveForm from "@/components/dives/dive-form";
import { getDiveForUser } from "@/db/dives";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function DiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const dive = await getDiveForUser(user.id, id);
  if (!dive) notFound();

  return (
    <section className="dive-editor-page">
      <header className="dive-editor-header">
        <div className="dive-eyebrow">Dive journal</div>
        <h1>Edit dive</h1>
        <p>Update the details and reflection saved with this dive.</p>
      </header>

      <DiveForm
        action={updateDive.bind(null, dive.id)}
        initialValues={dive}
        submitLabel="Save changes"
      />

      <div className="dive-danger-zone">
        <div>
          <h2>Delete this dive</h2>
          <p>This permanently removes it from your history.</p>
        </div>
        <DeleteDiveButton action={deleteDive.bind(null, dive.id)} />
      </div>
    </section>
  );
}
