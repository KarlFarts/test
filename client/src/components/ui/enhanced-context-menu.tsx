import { motion } from "framer-motion";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuLabel
} from "@/components/ui/context-menu";
import { 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Star,
  Archive,
  Download,
  Share
} from "lucide-react";

interface ContextMenuAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface ContextMenuGroup {
  label?: string;
  actions: ContextMenuAction[];
}

interface EnhancedContextMenuProps {
  children: React.ReactNode;
  groups: ContextMenuGroup[];
}

export function EnhancedContextMenu({ children, groups }: EnhancedContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.label && (
                <ContextMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1">
                  {group.label}
                </ContextMenuLabel>
              )}
              <ContextMenuGroup>
                {group.actions.map((action) => (
                  <ContextMenuItem
                    key={action.id}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`
                      flex items-center space-x-2 px-2 py-1.5 text-sm cursor-pointer
                      hover:bg-white/10 dark:hover:bg-white/5 transition-colors
                      ${action.variant === "destructive" ? "text-red-600 dark:text-red-400" : ""}
                      ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {action.icon && (
                      <span className="w-4 h-4 flex-shrink-0">
                        {action.icon}
                      </span>
                    )}
                    <span className="flex-1">{action.label}</span>
                    {action.shortcut && (
                      <ContextMenuShortcut>{action.shortcut}</ContextMenuShortcut>
                    )}
                  </ContextMenuItem>
                ))}
              </ContextMenuGroup>
              {groupIndex < groups.length - 1 && <ContextMenuSeparator />}
            </div>
          ))}
        </motion.div>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Predefined context menus for common use cases
export function PersonContextMenu({ 
  children, 
  onEdit, 
  onDelete, 
  onContact, 
  onView,
  person 
}: {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
  onView?: () => void;
  person?: any;
}) {
  const groups: ContextMenuGroup[] = [
    {
      actions: [
        {
          id: "view",
          label: "View Details",
          icon: <Eye className="w-4 h-4" />,
          shortcut: "Enter",
          action: onView || (() => {}),
          disabled: !onView
        },
        {
          id: "edit",
          label: "Edit Person",
          icon: <Edit className="w-4 h-4" />,
          shortcut: "⌘E",
          action: onEdit || (() => {}),
          disabled: !onEdit
        }
      ]
    },
    {
      label: "Contact",
      actions: [
        {
          id: "email",
          label: "Send Email",
          icon: <Mail className="w-4 h-4" />,
          action: () => {
            if (person?.email) {
              window.open(`mailto:${person.email}`);
            }
          },
          disabled: !person?.email
        },
        {
          id: "call",
          label: "Call",
          icon: <Phone className="w-4 h-4" />,
          action: () => {
            if (person?.phone) {
              window.open(`tel:${person.phone}`);
            }
          },
          disabled: !person?.phone
        }
      ]
    },
    {
      actions: [
        {
          id: "copy",
          label: "Copy Info",
          icon: <Copy className="w-4 h-4" />,
          shortcut: "⌘C",
          action: () => {
            if (person) {
              const info = `${person.name}\n${person.email || ''}\n${person.phone || ''}`;
              navigator.clipboard.writeText(info);
            }
          }
        },
        {
          id: "favorite",
          label: "Add to Favorites",
          icon: <Star className="w-4 h-4" />,
          action: () => {
            // Implementation for favorites
          }
        }
      ]
    },
    {
      actions: [
        {
          id: "delete",
          label: "Delete Person",
          icon: <Trash2 className="w-4 h-4" />,
          shortcut: "⌫",
          action: onDelete || (() => {}),
          variant: "destructive",
          disabled: !onDelete
        }
      ]
    }
  ];

  return <EnhancedContextMenu groups={groups}>{children}</EnhancedContextMenu>;
}

export function TableContextMenu({ 
  children, 
  selectedCount = 0,
  onSelectAll,
  onDeselectAll,
  onExport,
  onBulkEdit,
  onBulkDelete
}: {
  children: React.ReactNode;
  selectedCount?: number;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onExport?: () => void;
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
}) {
  const groups: ContextMenuGroup[] = [
    {
      label: "Selection",
      actions: [
        {
          id: "select-all",
          label: "Select All",
          shortcut: "⌘A",
          action: onSelectAll || (() => {}),
          disabled: !onSelectAll
        },
        {
          id: "deselect-all",
          label: "Deselect All",
          shortcut: "Esc",
          action: onDeselectAll || (() => {}),
          disabled: !onDeselectAll || selectedCount === 0
        }
      ]
    },
    {
      label: "Actions",
      actions: [
        {
          id: "export",
          label: "Export Data",
          icon: <Download className="w-4 h-4" />,
          shortcut: "⌘⇧E",
          action: onExport || (() => {}),
          disabled: !onExport
        },
        {
          id: "share",
          label: "Share Selection",
          icon: <Share className="w-4 h-4" />,
          action: () => {
            // Implementation for sharing
          },
          disabled: selectedCount === 0
        }
      ]
    }
  ];

  if (selectedCount > 0) {
    groups.push({
      label: `Bulk Actions (${selectedCount} selected)`,
      actions: [
        {
          id: "bulk-edit",
          label: "Edit Selected",
          icon: <Edit className="w-4 h-4" />,
          action: onBulkEdit || (() => {}),
          disabled: !onBulkEdit
        },
        {
          id: "bulk-archive",
          label: "Archive Selected",
          icon: <Archive className="w-4 h-4" />,
          action: () => {
            // Implementation for bulk archive
          }
        },
        {
          id: "bulk-delete",
          label: "Delete Selected",
          icon: <Trash2 className="w-4 h-4" />,
          action: onBulkDelete || (() => {}),
          variant: "destructive",
          disabled: !onBulkDelete
        }
      ]
    });
  }

  return <EnhancedContextMenu groups={groups}>{children}</EnhancedContextMenu>;
}
