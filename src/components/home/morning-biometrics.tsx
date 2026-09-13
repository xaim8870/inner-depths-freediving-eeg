import BiometricCard from "./biometric-card";
import SectionHeading from "./section-heading";

export default function MorningBiometrics() {
  return (
    <section aria-label="This morning">
      <SectionHeading
        accessory={
          <span className="data-source">
            <span className="source-dot" />
            via Whoop
          </span>
        }
      >
        This morning
      </SectionHeading>

      <div className="biometric-grid">
        <BiometricCard
          label="Sleep"
          value={<>7<small>h</small> 42<small>m</small></>}
          progress={86}
          status="Solid"
          variant="sleep"
          icon={<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />}
        />
        <BiometricCard
          label="Recovery"
          value={<>68<small>%</small></>}
          progress={68}
          status="Moderate"
          variant="recovery"
          icon={<path d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.6 12 20 12 20Z" />}
        />
        <BiometricCard
          label="Activity"
          value="9.4"
          progress={45}
          status="Light strain"
          variant="activity"
          icon={<path d="M3 12h4l2-6 4 12 2-6h6" />}
        />
      </div>
    </section>
  );
}
