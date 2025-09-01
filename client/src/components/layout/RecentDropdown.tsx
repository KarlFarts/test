import { Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRecentItems } from "@/hooks/useRecentItems";
import { useLocation } from "wouter";

export default function RecentDropdown() {
  const { items, clearItems } = useRecentItems();
  const [, setLocation] = useLocation();

  if (items.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-recent-items"
        >
          <Clock className="w-5 h-5" />
          <span className="sr-only">Recently viewed</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.href}
            onSelect={() => setLocation(item.href)}
            className="cursor-pointer"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem className="text-destructive" onSelect={clearItems}>
          Clear history
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
