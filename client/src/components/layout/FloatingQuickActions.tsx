import { useState, useEffect } from "react";
import { Plus, UserPlus, CalendarPlus, CheckSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function FloatingQuickActions() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  // Listen for global event to open quick actions (for hotkeys)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-quick-actions", handler);
    return () => window.removeEventListener("open-quick-actions", handler);
  }, []);

  const handleNavigate = (path: string) => {
    setOpen(false);
    setLocation(path);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
          data-testid="button-quick-actions"
        >
          <Plus className="w-6 h-6" />
          <span className="sr-only">Quick actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} align="end" className="w-56">
        <DropdownMenuItem onSelect={() => handleNavigate("/people")}> {/* Could open modal via query params */}
          <UserPlus className="w-4 h-4 mr-2" /> Add Person
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleNavigate("/events")}> {/* Would ideally open create event */}
          <CalendarPlus className="w-4 h-4 mr-2" /> Create Event
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleNavigate("/tasks")}>
          <CheckSquare className="w-4 h-4 mr-2" /> New Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
