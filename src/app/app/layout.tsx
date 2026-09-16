import BottomNav from "@/components/app/bottom-nav";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();
  const profile = await getProfileForUser(user.id);
  if (!profile) redirect("/onboarding");

  return (
    <div className="mobile-app">
      <main className="app-screen">{children}</main>

      <BottomNav />
    </div>
  );
}
