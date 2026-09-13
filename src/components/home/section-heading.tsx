import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  accessory?: ReactNode;
};

export default function SectionHeading({ children, accessory }: SectionHeadingProps) {
  return (
    <div className="section-header">
      <h2>{children}</h2>
      {accessory}
    </div>
  );
}
