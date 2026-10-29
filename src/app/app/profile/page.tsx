import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";
import { PageHead } from "@/components/ui/page";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";
import { disciplineLabels } from "@/lib/profile-options";

export default async function ProfilePage() {
  const user = await requireCurrentUser();
  const profile = await getProfileForUser(user.id);
  const rows: Array<[string, string]> = [
    ["Display name", profile?.displayName ?? user.name],
    ["Email", user.email],
    ...(profile ? [["Experience", profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)] as [string, string], ["Primary discipline", disciplineLabels[profile.primaryDiscipline]] as [string, string]] : []),
  ];

  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Account" title="Profile" sub="Your Inner Depths account and onboarding profile." />
      <section className="ui-card ui-stack">
        <h2 className="ui-label">You</h2>
        <dl className="ui-dl">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </section>
      <div className="ui-actions">
        <Link className="ui-btn ui-btn-ghost ui-btn-sm" href="/app/account">Connections &amp; settings</Link>
        <Link className="ui-btn ui-btn-ghost ui-btn-sm" href="/app/performance-profile">Performance profile</Link>
        <Link className="ui-link" href="/privacy">Privacy policy</Link>
      </div>
      <div><SignOutButton /></div>
    </div>
  );
}
