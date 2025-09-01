import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Users, Plus, Settings, Home, FileText, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
  group: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-home",
      title: "Go to Dashboard",
      description: "Navigate to the main dashboard",
      icon: <Home className="w-4 h-4" />,
      action: () => setLocation("/"),
      keywords: ["dashboard", "home", "main"],
      group: "Navigation"
    },
    {
      id: "nav-people",
      title: "Go to People",
      description: "View and manage contacts",
      icon: <Users className="w-4 h-4" />,
      action: () => setLocation("/people"),
      keywords: ["contacts", "users", "volunteers"],
      group: "Navigation"
    },
    {
      id: "nav-events",
      title: "Go to Events",
      description: "Manage events and activities",
      icon: <Calendar className="w-4 h-4" />,
      action: () => setLocation("/events"),
      keywords: ["activities", "calendar", "schedule"],
      group: "Navigation"
    },
    {
      id: "nav-reports",
      title: "Go to Reports",
      description: "View analytics and reports",
      icon: <FileText className="w-4 h-4" />,
      action: () => setLocation("/reports"),
      keywords: ["analytics", "data", "statistics"],
      group: "Navigation"
    },
    
    // Actions
    {
      id: "action-add-person",
      title: "Add New Person",
      description: "Create a new contact",
      icon: <Plus className="w-4 h-4" />,
      action: () => {
        setLocation("/people");
        // Trigger add person modal
        setTimeout(() => {
          const addButton = document.querySelector('[data-testid="button-add-person"]') as HTMLButtonElement;
          addButton?.click();
        }, 100);
      },
      keywords: ["create", "new", "contact", "volunteer"],
      group: "Actions"
    },
    {
      id: "action-search-people",
      title: "Search People",
      description: "Find contacts by name, email, or phone",
      icon: <Search className="w-4 h-4" />,
      action: () => {
        setLocation("/people");
        setTimeout(() => {
          const searchInput = document.querySelector('[data-testid="input-search-people"]') as HTMLInputElement;
          searchInput?.focus();
        }, 100);
      },
      keywords: ["find", "lookup", "filter"],
      group: "Actions"
    },
    
    // Settings
    {
      id: "settings-preferences",
      title: "Preferences",
      description: "Manage application settings",
      icon: <Settings className="w-4 h-4" />,
      action: () => setLocation("/settings"),
      keywords: ["config", "options", "customize"],
      group: "Settings"
    }
  ];

  const filteredCommands = commands.filter(command => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const titleMatch = command.title.toLowerCase().includes(searchLower);
    const descriptionMatch = command.description?.toLowerCase().includes(searchLower);
    const keywordMatch = command.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchLower)
    );
    
    return titleMatch || descriptionMatch || keywordMatch;
  });

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleSelect = useCallback((command: CommandItem) => {
    command.action();
    onOpenChange(false);
    setSearch("");
  }, [onOpenChange]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl bg-transparent border-0 shadow-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400
          }}
          className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-glass overflow-hidden"
        >
          <Command className="bg-transparent border-0">
            <div className="flex items-center border-b border-white/10 px-4">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <CommandInput
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
                className="border-0 bg-transparent focus:ring-0 text-base"
              />
              <div className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                ⌘K
              </div>
            </div>
            
            <CommandList className="max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {Object.keys(groupedCommands).length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CommandEmpty className="py-6 text-center text-muted-foreground">
                      No results found for "{search}"
                    </CommandEmpty>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {Object.entries(groupedCommands).map(([group, items]) => (
                      <CommandGroup key={group} heading={group} className="px-2 py-2">
                        {items.map((command, index) => (
                          <motion.div
                            key={command.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <CommandItem
                              onSelect={() => handleSelect(command)}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                            >
                              <div className="flex-shrink-0 text-muted-foreground">
                                {command.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">
                                  {command.title}
                                </div>
                                {command.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {command.description}
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          </motion.div>
                        ))}
                      </CommandGroup>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CommandList>
          </Command>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(prev => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  return {
    open,
    setOpen,
    toggle,
    close,
    CommandPalette: (props: Omit<CommandPaletteProps, "open" | "onOpenChange">) => (
      <CommandPalette open={open} onOpenChange={setOpen} {...props} />
    )
  };
}
