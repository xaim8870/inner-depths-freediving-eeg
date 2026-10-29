import { createTrainingSession } from "@/app/app/train/actions";
import TrainingForm from "@/components/training/training-form";
import { PageHead } from "@/components/ui/page";
import { trainingSessionTypes } from "@/lib/training-options";

export default async function NewTrainingSessionPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const defaultType = trainingSessionTypes.find((t) => t === type);
  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Training journal" title="Log a training session" sub="Record a training session you have already completed." />
      <TrainingForm action={createTrainingSession} defaultType={defaultType} submitLabel="Save session" />
    </div>
  );
}
