import SectionHeading from "./section-heading";
import { deriveHomeInsight } from "@/lib/home-insight";
export default function DescriptiveInsight({ values }: { values: number[] }) {
  const insight = deriveHomeInsight(values);
  return <section><SectionHeading>Training insight</SectionHeading><article className="home-insight"><span>Descriptive · logged data</span><h3>{insight.title}</h3><p>{insight.body}</p></article></section>;
}
