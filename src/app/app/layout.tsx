import BottomNav from "@/components/app/bottom-nav";
import AppHeader from "@/components/app/app-header";
import { getWhoopConnectionStatus } from "@/db/whoop-connections";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();
  const [profile, whoopConnection] = await Promise.all([getProfileForUser(user.id), getWhoopConnectionStatus(user.id)]);
  if (!profile) redirect("/onboarding");

  return (
    <div className="mobile-app">
      <AppHeader name={profile.displayName || user.name} email={user.email} whoopConnected={Boolean(whoopConnection)} />
      <main className="app-screen">{children}</main>

      <BottomNav />
    </div>
  );
}
