import BottomNav from "@/components/app/bottom-nav";

export default function UserAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-app">
      <main className="app-screen">{children}</main>

      <BottomNav />
    </div>
  );
}