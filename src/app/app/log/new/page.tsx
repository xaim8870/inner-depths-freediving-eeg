import DiveForm from "@/components/dives/dive-form";
import { createDive } from "@/app/app/log/actions";

export default function NewDivePage() {
  return (
    <div className="ui-page ui-page-wide">
      <DiveForm action={createDive} submitLabel="Save dive" />
    </div>
  );
}
