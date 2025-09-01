import { useLocation } from "wouter";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Menu,
  PanelLeft,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const routeTitles: Record<string, { breadcrumb: string; section: string }> = {
  "/": { breadcrumb: "Dashboard", section: "Command Center" },
  "/dashboard": { breadcrumb: "Dashboard", section: "Command Center" },
  "/my-tasks": { breadcrumb: "My Tasks", section: "Command Center" },
  "/my-events": { breadcrumb: "My Events", section: "Command Center" },
  "/ballot-access": { breadcrumb: "Ballot Access HQ", section: "Main" },
  "/volunteer-hub": { breadcrumb: "Volunteer Hub", section: "Main" },
  "/tasks": { breadcrumb: "Tasks", section: "Resources" },
  "/events": { breadcrumb: "Events", section: "Resources" },
  "/people": { breadcrumb: "People", section: "Resources" },
  "/templates": { breadcrumb: "Lists & Templates", section: "Resources" },
};

export default function Header() {
  const { toggleCollapse, toggleMobile } = useSidebar();
  const [location] = useLocation();
  
  const currentPage = routeTitles[location] || { breadcrumb: "Dashboard", section: "Command Center" };

  return (
    <header className="bg-card border-b border-border shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobile}
            className="p-2 rounded-md hover:bg-secondary md:hidden"
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-2 rounded-md hover:bg-secondary"
            data-testid="button-toggle-sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">{currentPage.section}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{currentPage.breadcrumb}</span>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Notifications */}
          <button 
            className="relative p-2 rounded-md hover:bg-secondary"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
              data-testid="button-user-menu"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">SC</span>
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
