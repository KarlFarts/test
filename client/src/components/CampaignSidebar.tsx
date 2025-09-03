import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Command,
  Menu,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Vote,
  Phone,
  FileText,
  Users,
  Building,
  Camera,
  Database,
  UserCheck,
  MessageSquare,
  Search as SearchIcon,
  List,
  FileText as FileTemplate,
  UserCircle,
  Bell,
  Settings,
  HelpCircle,
  Star,
  Clock,
  Filter
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  count?: number;
  children?: SidebarItem[];
  isActive?: boolean;
}

interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
  isCollapsed: boolean;
}

interface CampaignSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CampaignSidebar: React.FC<CampaignSidebarProps> = ({ 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'Staff' | 'Candidate' | 'Action'>('Staff');
  const [location] = useLocation();
  
  const [sections, setSections] = useState<SidebarSection[]>([
    {
      id: 'command-center',
      title: 'Command Center',
      isCollapsed: false,
      items: [
        { id: 'dashboard', label: 'My Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'my-tasks', label: 'My Tasks', path: '/my-tasks', icon: <CheckSquare size={16} />, count: 3 },
        { id: 'my-events', label: 'My Events', path: '/my-events', icon: <Calendar size={16} /> },
        { id: 'tasks', label: 'All Tasks', path: '/tasks', icon: <CheckSquare size={16} /> },
        { id: 'events', label: 'All Events', path: '/events', icon: <Calendar size={16} /> },
        { id: 'people', label: 'People', path: '/people', icon: <Users size={16} /> }
      ]
    },
    {
      id: 'ballot-access',
      title: 'Ballot Access HQ',
      isCollapsed: true,
      items: [
        { id: 'ballot-dashboard', label: 'Ballot Access Dashboard', path: '/ballot-access', icon: <Vote size={16} /> },
        { id: 'call-time', label: 'Call Time', path: '/call-time', icon: <Phone size={16} /> },
        { id: 'petitioning', label: 'Petitioning', path: '/petitioning', icon: <FileText size={16} /> },
        { id: 'coalitions', label: 'Coalitions', path: '/coalitions', icon: <Users size={16} /> }
      ]
    },
    {
      id: 'relationship-hub',
      title: 'Relationship Hub',
      isCollapsed: true,
      items: [
        { id: 'relationship-dashboard', label: 'Relationship Dashboard', path: '/relationship-hub', icon: <LayoutDashboard size={16} /> },
        { id: 'person-directory', label: 'Master Person Directory', path: '/people', icon: <Users size={16} /> },
        { id: 'org-directory', label: 'Master Organization Directory', path: '/organizations', icon: <Building size={16} /> },
        { id: 'media-contacts', label: 'Media Contacts', path: '/media', icon: <Camera size={16} /> },
        { id: 'vip-database', label: 'VIP Database', path: '/vip', icon: <Database size={16} /> },
        { id: 'volunteer-hub', label: 'Volunteer Hub', path: '/volunteer-hub', icon: <UserCheck size={16} /> },
        { id: 'volunteer-pipeline', label: 'Volunteer Pipeline', path: '/volunteer-pipeline', icon: <Users size={16} /> },
        { id: 'volunteer-assignments', label: 'Volunteer Assignments', path: '/volunteer-assignments', icon: <Calendar size={16} /> },
        { id: 'contact-log', label: 'Master Contact Log', path: '/contacts', icon: <MessageSquare size={16} /> },
        { id: 'relationship-search', label: 'Search', path: '/search', icon: <SearchIcon size={16} /> }
      ]
    },
    {
      id: 'lists-templates',
      title: 'Lists & Templates',
      isCollapsed: true,
      items: [
        { id: 'lists', label: 'Lists', path: '/lists', icon: <List size={16} /> },
        { id: 'templates', label: 'Templates', path: '/templates', icon: <FileTemplate size={16} /> },
        { id: 'active-volunteers', label: 'Active Volunteers', path: '/volunteers/active', icon: <UserCheck size={16} /> },
        { id: 'coalition-partners', label: 'Coalition Partners', path: '/coalitions', icon: <Users size={16} /> },
        { id: 'priority-outreach', label: 'Priority Outreach', path: '/outreach/priority', icon: <Star size={16} /> },
        { id: 'custom-lists', label: 'Custom Lists', path: '/lists/custom', icon: <List size={16} /> },
        { id: 'lists-search', label: 'Search', path: '/search/lists', icon: <SearchIcon size={16} /> }
      ]
    }
  ]);

  const [favorites] = useState([
    { id: 'fav-1', label: 'Recent Volunteers', path: '/volunteers/recent', icon: <Clock size={16} /> },
    { id: 'fav-2', label: 'High Priority Contacts', path: '/contacts/priority', icon: <Star size={16} /> },
    { id: 'fav-3', label: 'Saved Filter: Active Donors', path: '/donors/active', icon: <Filter size={16} /> }
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isCollapsed: !section.isCollapsed }
        : section
    ));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location === path || location.startsWith(`${path}/`);
  };

  const handleItemClick = (itemId: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        isActive: item.id === itemId
      }))
    })));
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('sidebar-search')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-60'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-lg font-semibold text-gray-900 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Campaign CRM
          </h1>
          <button 
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <Menu size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="sidebar-search"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Command size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">K</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Staff', 'Candidate', 'Action'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as typeof viewMode)}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Favorites Section */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorites</h3>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="space-y-1">
              {favorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={fav.path || '#'}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActive(fav.path)
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive(fav.path) ? 'text-primary' : 'text-gray-400'}>{fav.icon}</span>
                  <span className="truncate">{fav.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Sections */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} space-y-6`}>
          {sections.map((section) => (
            <div key={section.id}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between mb-3 group"
                >
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors duration-200">
                    {section.title}
                  </h3>
                  <div className="transform transition-transform duration-200">
                    {section.isCollapsed ? (
                      <ChevronRight size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </button>
              )}

              <div className={`space-y-1 transition-all duration-200 ease-in-out ${
                section.isCollapsed && !isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-96 opacity-100'
              }`}>
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path || '#'}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`${isActive(item.path) ? 'text-primary' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200 space-y-2`}>
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200`} title={isCollapsed ? 'Profile' : undefined}>
          <UserCircle size={16} className="text-gray-400" />
          {!isCollapsed && <span>Profile</span>}
        </button>
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2'} text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200`} title={isCollapsed ? 'Notifications' : undefined}>
          <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
            <Bell size={16} className="text-gray-400" />
            {!isCollapsed && <span>Notifications</span>}
          </div>
          {!isCollapsed && <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">2</span>}
        </button>
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200`} title={isCollapsed ? 'Settings' : undefined}>
          <Settings size={16} className="text-gray-400" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200`} title={isCollapsed ? 'Help' : undefined}>
          <HelpCircle size={16} className="text-gray-400" />
          {!isCollapsed && <span>Help</span>}
        </button>
      </div>
    </div>
  );
};

export default CampaignSidebar;
