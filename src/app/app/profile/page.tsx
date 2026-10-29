import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";
import { Icon } from "@/components/ui/icons";
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
      <nav className="ui-card ui-card-list" aria-label="Account">
        {[["/app/account", "Connections & settings"], ["/app/performance-profile", "Performance profile"], ["/privacy", "Privacy policy"]].map(([href, label]) => (
          <Link key={href} className="ui-row" href={href}><span>{label}</span><Icon name="chevron" size={18} /></Link>
        ))}
      </nav>
      <div><SignOutButton quiet /></div>
    </div>
  );
}
