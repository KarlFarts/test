import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Flag,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Vote,
  Users,
  ClipboardList,
  CalendarDays,
  UserCircle,
  File,
  X,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  hasSubmenu?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "Command Center",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/my-tasks", label: "My Tasks", icon: CheckSquare, badge: 3 },
      { href: "/my-events", label: "My Events", icon: Calendar },
    ],
  },
  {
    items: [
      { href: "/ballot-access", label: "Ballot Access HQ", icon: Vote, hasSubmenu: true },
      { href: "/volunteer-hub", label: "Volunteer Hub", icon: Users, hasSubmenu: true },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/tasks", label: "Tasks", icon: ClipboardList },
      { href: "/events", label: "Events", icon: CalendarDays },
      { href: "/people", label: "People", icon: UserCircle },
      { href: "/templates", label: "Lists & Templates", icon: File },
    ],
  },
];

export default function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleMobile, closeMobile } = useSidebar();
  const [location] = useLocation();

  const isActive = (href: string) => {
    return location === href || (href === "/dashboard" && location === "/");
  };

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

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar-transition fixed md:relative z-30 h-full bg-card border-r border-border shadow-sm",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64",
          "w-64"
        )}
        data-testid="sidebar"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Flag className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-lg text-foreground">Campaign Hub</h1>
                <p className="text-xs text-muted-foreground">Political Command Center</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleMobile}
            className="p-1 rounded-md hover:bg-secondary md:hidden"
            data-testid="button-close-sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && !isCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a
                          className={cn(
                            "menu-item flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium",
                            active && "active"
                          )}
                          onClick={closeMobile}
                          data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              {item.hasSubmenu && (
                                <ChevronRight className="w-4 h-4 ml-auto" />
                              )}
                            </>
                          )}
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Sarah Chen</p>
                <p className="text-xs text-muted-foreground truncate">Campaign Manager</p>
              </div>
              <button 
                className="p-1 hover:bg-secondary rounded-md"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
