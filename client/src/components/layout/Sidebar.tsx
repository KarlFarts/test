import { useSidebar } from "@/hooks/useSidebar";
import CampaignSidebar from "@/components/CampaignSidebar";

export default function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleMobile, closeMobile, toggleCollapse } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 sidebar-overlay md:hidden"
          onClick={closeMobile}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Use the new CampaignSidebar component */}
      <div className={`${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:relative z-30 transition-transform duration-300 md:transition-none`}>
        <CampaignSidebar 
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>
    </>
  );
}
