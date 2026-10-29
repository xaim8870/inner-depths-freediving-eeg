import Sidebar from "@/components/shell/sidebar";
import TabBar from "@/components/shell/tab-bar";
import TopBar from "@/components/shell/top-bar";
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
  const name = profile.displayName || user.name;

  return (
    <div className="ui-app">
      <a className="ui-skip" href="#main">Skip to content</a>
      <Sidebar name={name} whoopConnected={Boolean(whoopConnection)} />
      <div className="ui-body">
        <TopBar name={name} />
        <main id="main" className="ui-main">{children}</main>
        <TabBar />
      </div>
    </div>
  );
}
