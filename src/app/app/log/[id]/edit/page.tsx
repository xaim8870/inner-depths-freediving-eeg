import { notFound } from "next/navigation";
import { z } from "zod";
import { deleteDive, updateDive } from "@/app/app/log/actions";
import DeleteDiveButton from "@/components/dives/delete-dive-button";
import DiveForm from "@/components/dives/dive-form";
import DangerZone from "@/components/ui/danger-zone";
import { getDiveForUser } from "@/db/dives";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function EditDivePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const dive = await getDiveForUser(user.id, id);
  if (!dive) notFound();

  return (
    <div className="ui-page ui-page-wide">
      <DiveForm action={updateDive.bind(null, dive.id)} initialValues={dive} submitLabel="Save changes" cancelHref={`/app/log/${dive.id}`} />
      <DangerZone title="Delete this dive">
        <DeleteDiveButton action={deleteDive.bind(null, dive.id)} />
      </DangerZone>
    </div>
  );
}
