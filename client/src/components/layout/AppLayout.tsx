import { SidebarProvider, useSidebar } from "@/hooks/useSidebar";
import CampaignSidebar from "@/components/CampaignSidebar";
import FloatingQuickActions from "./FloatingQuickActions";
import { useHotkeys } from "@/hooks/useHotkeys";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: AppLayoutProps) {
  const { isCollapsed, toggleMobile } = useSidebar();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${isCollapsed ? 'md:w-16' : 'md:w-60'} transition-all duration-300 flex-shrink-0`}>
        <CampaignSidebar 
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleMobile}
        />
      </div>
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
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  useHotkeys();
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
