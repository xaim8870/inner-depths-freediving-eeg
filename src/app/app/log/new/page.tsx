import DiveForm from "@/components/dives/dive-form";
import { createDive } from "@/app/app/log/actions";

export default function NewDivePage() {
  return (
    <section className="dive-editor-page">
      <header className="dive-editor-header">
        <div className="dive-eyebrow">Dive journal</div>
        <h1>Log a dive</h1>
        <p>Record a dive you have already completed with your buddy and safety in place.</p>
      </header>
      <DiveForm action={createDive} submitLabel="Save dive" />
    </section>
  );
}
