import Link from "next/link";
import { disciplineLabels } from "@/lib/profile-options";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";

export default async function ProfilePage() {
  const user = await requireCurrentUser(); const profile = await getProfileForUser(user.id);
  return <section className="account-page"><header className="account-page-header"><div className="account-eyebrow">User</div><h1>Profile</h1><p>Your Inner Depths account and onboarding profile.</p></header>
    <div className="profile-details-card"><div><span>Display name</span><strong>{profile?.displayName ?? user.name}</strong></div><div><span>Email</span><strong>{user.email}</strong></div>{profile ? <><div><span>Experience</span><strong>{profile.experienceLevel}</strong></div><div><span>Primary discipline</span><strong>{disciplineLabels[profile.primaryDiscipline]}</strong></div></> : null}</div>
    <div className="account-page-links"><Link className="account-back-link" href="/app/account">Connections &amp; settings</Link><Link className="account-privacy-link" href="/privacy">Privacy Policy</Link></div>
  </section>;
}

