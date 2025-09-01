import { SidebarProvider } from "@/hooks/useSidebar";
import Sidebar from "./Sidebar";
import FloatingQuickActions from "./FloatingQuickActions";
import { useHotkeys } from "@/hooks/useHotkeys";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  useHotkeys();
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-6">
              {children}
            </div>
          </main>
                <FloatingQuickActions />
        </div>
      </div>
    </SidebarProvider>
  );
}
