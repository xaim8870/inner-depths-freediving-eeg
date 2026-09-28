import Image from "next/image";
import styles from "./inner-depths-logo.module.css";

type InnerDepthsLogoProps = {
  className?: string;
  showSubtitle?: boolean;
  priority?: boolean;
};

export function InnerDepthsLogo({
  className = "",
  showSubtitle = true,
  priority = false,
}: InnerDepthsLogoProps) {
  return (
    <span
      className={`${styles.brand} ${className}`.trim()}
      aria-label="Inner Depths Freediving"
    >
      <Image
        src="/brand/inner-depths-mark.png"
        alt=""
        width={116}
        height={200}
        className={styles.brandmark}
        priority={priority}
      />

      <span className={styles.brandtext} aria-hidden="true">
        <span className={styles.bt1}>
          Inner&nbsp;<span>Depths</span>
        </span>

        {showSubtitle ? (
          <span className={styles.bt2}>Freediving</span>
        ) : null}
      </span>
    </span>
  );
}

export function InnerDepthsMark({
  className = "",
  priority = false,
}: Omit<InnerDepthsLogoProps, "showSubtitle">) {
  return (
    <Image
      src="/brand/inner-depths-mark.png"
      alt="Inner Depths"
      width={116}
      height={200}
      className={className}
      priority={priority}
    />
  );
}
