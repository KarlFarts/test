import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { memo, useMemo, useCallback, useState } from "react";
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  Command, 
  Vote, 
  Network, 
  Plus,
  Search,
  Activity,
  Palette,
  Target,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  CalendarCheck,
  Clock
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const quickActions = [
  { icon: Plus, label: "Add Person", href: "/people", action: "create" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Calendar, label: "New Event", href: "/events", action: "create" },
  { icon: CheckSquare, label: "New Task", href: "/tasks", action: "create" }
];

const mainSections = [
  {
    title: "Command Center",
    description: "Your personal dashboard and tasks",
    icon: Command,
    color: "bg-blue-500",
    items: [
      { label: "My Dashboard", href: "/dashboard", badge: "3 updates" },
      { label: "My Tasks", href: "/my-tasks", badge: "5 pending" },
      { label: "My Events", href: "/my-events", badge: "2 today" }
    ]
  },
  {
    title: "People & Relationships",
    description: "Manage contacts and relationships",
    icon: Users,
    color: "bg-green-500",
    items: [
      { label: "People Directory", href: "/people", badge: "1,247 contacts" },
      { label: "Volunteer Hub", href: "/volunteer-hub", badge: "89 active" },
      { label: "Volunteer Pipeline", href: "/volunteer-pipeline", badge: "12 new" },
      { label: "Volunteer Assignments", href: "/volunteer-assignments" }
    ]
  },
  {
    title: "Campaign Operations",
    description: "Tasks, events, and coordination",
    icon: Target,
    color: "bg-purple-500",
    items: [
      { label: "All Tasks", href: "/tasks", badge: "23 open" },
      { label: "All Events", href: "/events", badge: "8 upcoming" },
      { label: "Templates", href: "/templates", badge: "15 saved" }
    ]
  },
  {
    title: "Ballot Access HQ",
    description: "Ballot access and petitioning",
    icon: Vote,
    color: "bg-orange-500",
    items: [
      { label: "Ballot Access Dashboard", href: "/ballot-access" },
      { label: "Call Time", href: "/call-time" },
      { label: "Petitioning", href: "/petitioning" },
      { label: "Coalitions", href: "/coalitions" }
    ]
  }
];

const recentActivity = [
  { action: "New volunteer registered", time: "2 minutes ago", type: "volunteer" },
  { action: "Task completed: Call donors", time: "1 hour ago", type: "task" },
  { action: "Event created: Town Hall", time: "3 hours ago", type: "event" },
  { action: "5 new contacts added", time: "5 hours ago", type: "contact" }
];

type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  background: string;
  gradient: string;
  overlay: string;
};

const colorPalettes: Record<string, ColorPalette> = {
  "Forest Depth": {
    primary: "#2D5016",
    secondary: "#9BC4A0", 
    accent: "#D4E4BC",
    highlight: "#F0E68C",
    background: "#FAFDF6",
    gradient: "radial-gradient(ellipse at top left, rgba(45, 80, 22, 0.3) 0%, rgba(155, 196, 160, 0.2) 40%, transparent 70%), conic-gradient(from 45deg at 80% 20%, rgba(212, 228, 188, 0.4), rgba(240, 230, 140, 0.3), rgba(45, 80, 22, 0.2))",
    overlay: "bg-gradient-to-br from-green-900/20 via-green-600/15 to-lime-200/25"
  },
  "Trust Authority": {
    primary: "#121C50",
    secondary: "#CBA16E",
    accent: "#E8F4FD", 
    highlight: "#4DAF9E",
    background: "#F7F6F2",
    gradient: "linear-gradient(45deg, rgba(18, 28, 80, 0.25) 0%, rgba(203, 161, 110, 0.2) 50%, rgba(232, 244, 253, 0.3) 100%), radial-gradient(circle at 70% 30%, rgba(77, 175, 158, 0.2) 0%, transparent 50%)",
    overlay: "bg-gradient-to-br from-blue-900/25 via-amber-600/20 to-cyan-200/30"
  },
  "Steel Corporate": {
    primary: "#374151",
    secondary: "#6B7280",
    accent: "#E5E7EB",
    highlight: "#3B82F6", 
    background: "#F9FAFB",
    gradient: "conic-gradient(from 180deg at 50% 50%, rgba(55, 65, 81, 0.3) 0deg, rgba(107, 114, 128, 0.25) 120deg, rgba(59, 130, 246, 0.2) 240deg, rgba(229, 231, 235, 0.3) 360deg), linear-gradient(135deg, rgba(55, 65, 81, 0.15) 0%, transparent 100%)",
    overlay: "bg-gradient-to-br from-gray-700/20 via-gray-500/15 to-blue-200/25"
  },
  "Deep Teal": {
    primary: "#008B8B",
    secondary: "#20B2AA",
    accent: "#5F9EA0",
    highlight: "#FFE4B5",
    background: "#F0FFFF",
    gradient: "radial-gradient(ellipse at bottom right, rgba(0, 139, 139, 0.4) 0%, rgba(32, 178, 170, 0.3) 30%, transparent 70%), linear-gradient(45deg, rgba(95, 158, 160, 0.2) 0%, rgba(255, 228, 181, 0.25) 100%)",
    overlay: "bg-gradient-to-br from-teal-700/25 via-teal-500/20 to-orange-200/30"
  },
  "Sky Blue": {
    primary: "#87CEEB",
    secondary: "#B0E0E6",
    accent: "#ADD8E6",
    highlight: "#FFA500",
    background: "#F0FFFF",
    gradient: "radial-gradient(circle at top center, rgba(135, 206, 235, 0.4) 0%, rgba(176, 224, 230, 0.3) 40%, transparent 80%), conic-gradient(from 270deg at 30% 70%, rgba(173, 216, 230, 0.3), rgba(255, 165, 0, 0.2))",
    overlay: "bg-gradient-to-br from-sky-400/30 via-sky-300/25 to-orange-200/35"
  },
  "Charcoal Modern": {
    primary: "#36454F",
    secondary: "#708090",
    accent: "#B0C4DE",
    highlight: "#FFA500",
    background: "#F5F5F5",
    gradient: "linear-gradient(135deg, rgba(54, 69, 79, 0.3) 0%, rgba(112, 128, 144, 0.25) 50%, rgba(176, 196, 222, 0.2) 100%), radial-gradient(ellipse at center, rgba(255, 165, 0, 0.15) 0%, transparent 60%)",
    overlay: "bg-gradient-to-br from-slate-600/25 via-slate-500/20 to-orange-200/30"
  },
  "Peacock Vibrant": {
    primary: "#005F73",
    secondary: "#0A9396",
    accent: "#94D2BD",
    highlight: "#EE9B00",
    background: "#F1FAEE",
    gradient: "conic-gradient(from 90deg at 25% 25%, rgba(0, 95, 115, 0.4) 0deg, rgba(10, 147, 150, 0.3) 90deg, rgba(148, 210, 189, 0.25) 180deg, rgba(238, 155, 0, 0.3) 270deg, rgba(0, 95, 115, 0.4) 360deg), radial-gradient(ellipse at 80% 80%, rgba(238, 155, 0, 0.2) 0%, transparent 50%)",
    overlay: "bg-gradient-to-br from-teal-800/30 via-teal-600/25 to-amber-200/35"
  },
  "Terracotta Warm": {
    primary: "#CC5500",
    secondary: "#E07A5F",
    accent: "#F2CC8F",
    highlight: "#81B29A",
    background: "#FFF8F3",
    gradient: "radial-gradient(ellipse at top left, rgba(204, 85, 0, 0.4) 0%, rgba(224, 122, 95, 0.3) 40%, transparent 80%), linear-gradient(225deg, rgba(242, 204, 143, 0.3) 0%, rgba(129, 178, 154, 0.25) 100%)",
    overlay: "bg-gradient-to-br from-orange-700/30 via-orange-500/25 to-emerald-200/35"
  },
  "Lavender Calm": {
    primary: "#967BB6",
    secondary: "#C8BFE7",
    accent: "#E6E6FA",
    highlight: "#98FB98",
    background: "#FAF5FF",
    gradient: "conic-gradient(from 0deg at 60% 40%, rgba(150, 123, 182, 0.3) 0deg, rgba(200, 191, 231, 0.25) 120deg, rgba(230, 230, 250, 0.2) 240deg, rgba(152, 251, 152, 0.3) 360deg), radial-gradient(circle at bottom left, rgba(152, 251, 152, 0.2) 0%, transparent 60%)",
    overlay: "bg-gradient-to-br from-purple-500/25 via-purple-300/20 to-green-200/30"
  },
  "Emerald Leadership": {
    primary: "#50C878",
    secondary: "#00A86B",
    accent: "#228B22",
    highlight: "#FFD700",
    background: "#F0FFF0",
    gradient: "radial-gradient(ellipse at center, rgba(80, 200, 120, 0.4) 0%, rgba(0, 168, 107, 0.3) 30%, transparent 70%), conic-gradient(from 135deg at 20% 80%, rgba(34, 139, 34, 0.3), rgba(255, 215, 0, 0.25), rgba(80, 200, 120, 0.2))",
    overlay: "bg-gradient-to-br from-emerald-500/30 via-emerald-600/25 to-yellow-200/35"
  }
};

const ThemeSelector = memo(({ 
  selectedPalette,
  onSelectPalette,
  isOpen,
}: {
  selectedPalette: string;
  isOpen: boolean;
  onSelectPalette: (palette: string) => void;
}) => {
  const paletteNames = useMemo(() => Object.keys(colorPalettes), []);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          className="grid grid-cols-2 gap-2 mt-2 overflow-hidden"
        >
          {paletteNames.map((paletteName) => (
            <button
              key={paletteName}
              onClick={() => onSelectPalette(paletteName)}
              className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 ${selectedPalette === paletteName ? 'scale-105' : 'hover:scale-105'}`}
              style={{
                backgroundColor: `${colorPalettes[paletteName].primary}20`,
                color: colorPalettes[paletteName].primary,
                borderColor: selectedPalette === paletteName ? colorPalettes[paletteName].primary : 'transparent'
              }}
            >
              {paletteName.split(' ')[0]}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const QuickAction = memo(({ action, currentPalette }: { action: any; currentPalette: ColorPalette }) => (
  <Link 
    href={action.href}
    className="quick-action-card flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105"
    style={{ backgroundColor: currentPalette.primary + '10' }}
  >
    <div className="icon-glass-subtle" style={{ backgroundColor: currentPalette.primary + '15' }}>
      <action.icon className="h-5 w-5" style={{ color: currentPalette.primary }} />
    </div>
    <span className="text-body font-medium" style={{ color: currentPalette.primary }}>{action.label}</span>
  </Link>
));

const DayAtAGlance = memo(({ currentPalette }: { currentPalette: ColorPalette }) => {
  const weather = { temp: '68°', condition: 'Sunny', icon: Sun };
  const date = new Date();
  const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="day-glance-card mb-12">
      <div className="flex items-center gap-4">
        <weather.icon className="h-8 w-8" style={{ color: currentPalette.primary }} />
        <div>
          <p className="text-hierarchy-3 font-bold" style={{ color: currentPalette.primary }}>{weather.temp}</p>
          <p className="text-caption" style={{ color: currentPalette.secondary }}>{weather.condition}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-hierarchy-3 font-bold flex items-center justify-end gap-2" style={{ color: currentPalette.primary }}><CalendarCheck className="h-5 w-5"/> {formattedDate}</p>
        <p className="text-caption flex items-center justify-end gap-2" style={{ color: currentPalette.secondary }}><Clock className="h-4 w-4"/> {formattedTime}</p>
      </div>
    </div>
  );
});

const GradientBackground = memo(({ gradient, overlay }: { gradient: string; overlay: string }) => (
  <div 
    className="fixed inset-0 -z-10 h-screen w-screen opacity-90" 
    style={{ 
      background: `${overlay}, ${gradient}`, 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundAttachment: "fixed", 
      backdropFilter: "blur(80px) saturate(180%)", 
      WebkitBackdropFilter: "blur(80px) saturate(180%)", 
    }} 
  />
));
const SectionCard = memo(({ section, currentPalette }: { section: any; currentPalette: ColorPalette }) => (
  <div className="glass-card p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="icon-glass" style={{ backgroundColor: currentPalette.primary + '20' }}>
        <section.icon className="h-6 w-6" style={{ color: currentPalette.primary }} />
      </div>
      <div>
        <h3 className="text-hierarchy-3 font-bold" style={{ color: currentPalette.primary }}>{section.title}</h3>
        <p className="text-caption" style={{ color: currentPalette.secondary }}>{section.description}</p>
      </div>
    </div>
    <div className="space-y-2">
      {section.items.map((item: any) => (
        <Link 
          href={item.href} 
          key={item.label}
          className="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-sm block"
          style={{ backgroundColor: currentPalette.accent + '20', color: currentPalette.primary }}
        >
          <span className="text-sm font-medium">{item.label}</span>
          {item.badge && <span className="badge-glass text-xs">{item.badge}</span>}
        </Link>
      ))}
    </div>
  </div>
));

export default function Landing() {
  const [selectedPalette, setSelectedPalette] = useState("Steel Corporate");
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
  const currentPalette = useMemo(() => colorPalettes[selectedPalette], [selectedPalette]);

  const handlePaletteChange = useCallback((paletteName: string) => {
    setSelectedPalette(paletteName);
  }, []);

  const toggleThemeSelector = useCallback(() => {
    setIsThemeSelectorOpen(prev => !prev);
  }, []);

  const toggleQuickActions = useCallback(() => {
    setIsQuickActionsOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Quick Actions Sidebar */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-4">
          {/* Quick Actions Button */}
          <div className="relative">
            <button 
              onClick={toggleQuickActions} 
              className="glass-card p-3 cursor-pointer group hover:scale-105 transition-transform" 
              aria-label="Quick actions"
            >
              <div className="icon-glass" style={{ backgroundColor: currentPalette.accent + '40' }}> 
                <Users className="h-5 w-5" style={{ color: currentPalette.primary }} />
              </div>
            </button>
          </div>
          
          {/* Theme Selector Button */}
          <div className="relative">
            <button 
              onClick={toggleThemeSelector} 
              className="glass-card p-3 cursor-pointer group hover:scale-105 transition-transform" 
              aria-label="Theme selector"
            >
              <div className="icon-glass" style={{ backgroundColor: currentPalette.accent + '40' }}> 
                <Palette className="h-5 w-5" style={{ color: currentPalette.primary }} /> 
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DayAtAGlance currentPalette={currentPalette} />
        {/* Top cards removed per design feedback */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center mb-16"
        >
          {/* Center Header */}
          <div className="text-center relative">
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 -inset-y-6 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl w-[calc(100%+4rem)] max-w-3xl"
              style={{ 
                background: `linear-gradient(135deg, ${currentPalette.accent}40, ${currentPalette.secondary}20)`,
                boxShadow: `0 25px 50px -12px ${currentPalette.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`
              }}
            />
            <div className="relative">
              <h1 className="text-hierarchy-1 font-bold tracking-tighter" style={{ color: currentPalette.primary }}>People Management</h1>
              <p className="text-hierarchy-3 mt-2 font-medium" style={{ color: currentPalette.secondary }}>A Better Way to Campaign</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isQuickActionsOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fixed left-20 top-1/2 -translate-y-1/2 z-40"
            >
              <div className="flex flex-col gap-3">
                {quickActions.map((action) => (
                  <motion.div key={action.label} variants={itemVariants}>
                    <Link 
                      href={action.href}
                      className="glass-card p-3 cursor-pointer group hover:scale-105 transition-transform flex items-center gap-3 block"
                    >
                      <div className="icon-glass-subtle" style={{ backgroundColor: currentPalette.primary + '15' }}>
                        <action.icon className="h-4 w-4" style={{ color: currentPalette.primary }} />
                      </div>
                      <span className="text-caption font-medium whitespace-nowrap" style={{ color: currentPalette.primary }}>
                        {action.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {mainSections.map((section) => (
              <motion.div key={section.title} variants={itemVariants}>
                <SectionCard section={section} currentPalette={currentPalette} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
