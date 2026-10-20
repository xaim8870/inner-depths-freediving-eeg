import Link from "next/link";
import SectionHeading from "./section-heading";
export default function WhoopStatus({ connected }: { connected: boolean }) {
  return <section><SectionHeading>This morning</SectionHeading><div className="home-whoop-state"><span className={connected ? "connected" : ""} aria-hidden="true" /><div><strong>{connected ? "WHOOP connected" : "WHOOP not connected"}</strong><p>{connected ? "Your account connection is active. Live measurements are not enabled in Inner Depths yet." : "Connect your account when you want to prepare for future WHOOP features."}</p></div><Link href="/app/account">{connected ? "Manage" : "Connect WHOOP"}</Link></div></section>;
}

