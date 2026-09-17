import { createTrainingSession } from "@/app/app/train/actions";
import TrainingForm from "@/components/training/training-form";

export default function NewTrainingSessionPage() {
  return (
    <section className="training-editor-page">
      <header className="training-editor-header">
        <div className="training-eyebrow">Training journal</div>
        <h1>Log a session</h1>
        <p>Record a training session you have already completed.</p>
      </header>
      <TrainingForm action={createTrainingSession} submitLabel="Save session" />
    </section>
  );
}
