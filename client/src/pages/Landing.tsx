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
  Target
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

// Memoized Theme Selector Component
const ThemeSelector = memo(({ 
  currentPalette,
  selectedPalette,
  onSelectPalette,
  isOpen,
  onToggle 
}: {
  currentPalette: ColorPalette;
  selectedPalette: string;
  isOpen: boolean;
  onSelectPalette: (palette: string) => void;
  onToggle: () => void;
}) => {
  const paletteNames = useMemo(() => Object.keys(colorPalettes), []);
  
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="floating-card p-4">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={onToggle}
        >
          <div className="icon-glass">
            <Palette className="h-4 w-4" style={{ color: currentPalette.primary }} />
          </div>
          <span className="text-caption font-medium" style={{ color: currentPalette.primary }}>Theme</span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-2 mt-3"
            >
              {paletteNames.map((paletteName) => (
                <button
                  key={paletteName}
                  onClick={() => onSelectPalette(paletteName)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${selectedPalette === paletteName ? 'ring-2 ring-offset-1' : 'hover:scale-105'}`}
                  style={{ 
                    backgroundColor: `${colorPalettes[paletteName].primary}20`,
                    color: colorPalettes[paletteName].primary,
                    ...(selectedPalette === paletteName && {
                      borderColor: colorPalettes[paletteName].primary,
                      borderWidth: '2px'
                    })
                  }}
                >
                  {paletteName.split(' ')[0]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

// Optimized Gradient Background Component
const GradientBackground = memo(({ gradient, overlay }: { gradient: string; overlay: string }) => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 will-change-transform"
        style={{ 
          background: gradient,
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }} 
      />
      <div className={`absolute inset-0 ${overlay} will-change-opacity`} />
    </div>
  );
});

// Memoized QuickAction component
const QuickAction = memo(({ action, currentPalette }: { action: typeof quickActions[0]; currentPalette: ColorPalette }) => {
  return (
    <Link href={action.href}>
      <div className="floating-card-enhanced p-6 text-center group cursor-pointer">
        <div 
          className="icon-glass mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 will-change-transform" 
          style={{ backgroundColor: currentPalette.secondary + '20' }}
        >
          <action.icon className="h-6 w-6 transition-colors" style={{ color: currentPalette.secondary }} />
        </div>
        <p className="text-body font-semibold text-optimized" style={{ color: currentPalette.primary }}>{action.label}</p>
      </div>
    </Link>
  );
});

// Memoized SectionCard component
const SectionCard = memo(({ section, currentPalette }: { section: typeof mainSections[0]; currentPalette: ColorPalette }) => {
  return (
    <div className="floating-card-enhanced h-full">
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div 
            className="icon-glass mb-4 will-change-transform" 
            style={{ backgroundColor: currentPalette.highlight + '20' }}
          >
            <section.icon className="h-6 w-6" style={{ color: currentPalette.highlight }} />
          </div>
          <div>
            <h3 className="text-hierarchy-3 mb-2 text-optimized" style={{ color: currentPalette.primary }}>{section.title}</h3>
            <p className="text-body text-optimized" style={{ color: currentPalette.secondary }}>
              {section.description}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {section.items.map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group">
                <span className="text-body font-medium group-hover:text-blue-600 transition-colors text-optimized" style={{ color: currentPalette.primary }}>
                  {item.label}
                </span>
                {item.badge && (
                  <span 
                    className="badge-glass" 
                    style={{ 
                      backgroundColor: currentPalette.accent + '60', 
                      color: currentPalette.primary,
                      willChange: 'transform, opacity'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

export default function Landing() {
  const [selectedPalette, setSelectedPalette] = useState("Steel Corporate");
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const currentPalette = useMemo(() => colorPalettes[selectedPalette], [selectedPalette]);

  // Memoize handlers
  const handlePaletteChange = useCallback((paletteName: string) => {
    setSelectedPalette(paletteName);
    setIsThemeSelectorOpen(false);
  }, []);

  const toggleThemeSelector = useCallback(() => {
    setIsThemeSelectorOpen(prev => !prev);
  }, []);

  // Memoize the main content to prevent unnecessary re-renders
  const memoizedContent = useMemo(() => (
    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 lg:py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="mb-16 text-center"
      >
        <h1 className="text-hierarchy-1 mb-6 text-optimized" style={{ color: currentPalette.primary }}>
          Campaign CRM
        </h1>
        <p className="text-body-large max-w-2xl mx-auto text-optimized" style={{ color: currentPalette.secondary }}>
          Welcome back! Here's your campaign command center.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-20"
      >
        <h2 className="text-hierarchy-3 mb-8 flex items-center justify-start gap-3 text-optimized" style={{ color: currentPalette.primary }}>
          <div className="icon-glass will-change-transform" style={{ backgroundColor: currentPalette.primary + '20' }}>
            <Activity className="h-5 w-5" style={{ color: currentPalette.primary }} />
          </div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div key={action.label} variants={itemVariants}>
              <QuickAction action={action} currentPalette={currentPalette} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-hierarchy-3 mb-8 flex items-center justify-start gap-3 text-optimized" style={{ color: currentPalette.primary }}>
          <div className="icon-glass will-change-transform" style={{ backgroundColor: currentPalette.accent + '40' }}>
            <Network className="h-5 w-5" style={{ color: currentPalette.primary }} />
          </div>
          Campaign Sections
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainSections.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants}>
              <SectionCard section={section} currentPalette={currentPalette} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  ), [currentPalette]);

  return (
    <div className="min-h-screen relative overflow-hidden scroll-optimized" style={{ backgroundColor: currentPalette.background }}>
      {/* Optimized Gradient Background */}
      <GradientBackground 
        gradient={currentPalette.gradient} 
        overlay={currentPalette.overlay} 
      />
      
      {/* Memoized Theme Selector */}
      <ThemeSelector
        currentPalette={currentPalette}
        selectedPalette={selectedPalette}
        isOpen={isThemeSelectorOpen}
        onSelectPalette={handlePaletteChange}
        onToggle={toggleThemeSelector}
      />
      
      {memoizedContent}
    </div>
  );
}
