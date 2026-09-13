//src/components/home/biometric-card.tsx
import type { ReactNode } from "react";

type BiometricCardProps = {
  label: string;
  value: ReactNode;
  progress: number;
  status: string;
  icon: ReactNode;
  variant: "sleep" | "recovery" | "activity";
};

export default function BiometricCard({
  label,
  value,
  progress,
  status,
  icon,
  variant,
}: BiometricCardProps) {
  return (
    <article className="biometric-card">
      <div className="biometric-label">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icon}
        </svg>

        <span>{label}</span>
      </div>

      <div className="biometric-value">
        {value}
      </div>

      <div className="biometric-track">
        <div
          className={`biometric-progress ${variant}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="biometric-status">
        {status}
      </div>
    </article>
  );
}