import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-16 flex-1 p-6 lg:ml-56 lg:p-8">
        {children}
      </main>
    </div>
  );
}
