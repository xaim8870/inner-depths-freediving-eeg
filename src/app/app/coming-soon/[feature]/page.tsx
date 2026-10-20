import { notFound } from "next/navigation";
import FutureFeatureState from "@/components/app/future-feature-state";

const features = {
  "cognitive-training": { title: "Cognitive training", description: "Guided cognitive programs will be productionized after the Performance Profile foundation is complete.", dependency: "Performance Profile routing and program content" },
  neurofeedback: { title: "Neurofeedback", description: "Device-based neurofeedback is a later product phase. No EEG reading or training is available in this MVP.", dependency: "Validated device integration and neurofeedback engine" },
  labs: { title: "Labs", description: "Laboratory data is not connected to Inner Depths yet.", dependency: "A reviewed provider and data model" },
  "cycle-tracking": { title: "Cycle tracking", description: "Cycle tracking is not available, and no cycle stage is inferred or displayed.", dependency: "Privacy review and a dedicated cycle model" },
  research: { title: "Research", description: "Research participation workflows are not part of the current consumer MVP.", dependency: "Consent, protocol, and researcher workflow" },
} as const;

export default async function ComingSoonPage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  if (!(feature in features)) notFound();
  return <FutureFeatureState {...features[feature as keyof typeof features]} />;
}
