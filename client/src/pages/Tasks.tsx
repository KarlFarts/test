import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  User, 
  CheckCircle,
  AlertCircle,
  Calendar,
  MoreHorizontal
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

import type { TaskWithAssignee } from "@shared/schema";

interface TasksResponse {
  tasks: TaskWithAssignee[];
  total: number;
}

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
];

const DUE_DATE_OPTIONS = [
  { value: "all", label: "All Due Dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due Today" },
  { value: "this_week", label: "Due This Week" },
  { value: "next_week", label: "Due Next Week" },
  { value: "no_due_date", label: "No Due Date" },
];

const ASSIGNEE_OPTIONS = [
  { value: "all", label: "All Assignees" },
  { value: "unassigned", label: "Unassigned" },
  { value: "user1", label: "Admin" },
  { value: "user2", label: "John Doe" },
  { value: "user3", label: "Jane Smith" },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "complete":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

function TaskCard({ task }: { task: TaskWithAssignee }) {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      return apiRequest(`/api/tasks/${task.id}`, "PATCH", { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    updateTaskMutation.mutate({ status: newStatus });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Card className="mb-3 hover:shadow-sm transition-shadow cursor-pointer" data-testid={`card-task-${task.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-sm font-medium" data-testid={`text-task-title-${task.id}`}>
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={`text-xs ${getPriorityColor(task.priority)}`}
                data-testid={`badge-task-priority-${task.id}`}
              >
                {task.priority}
              </Badge>
              {task.assignee && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span data-testid={`text-task-assignee-${task.id}`}>
                    {task.assignee.username}
                  </span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid={`button-task-menu-${task.id}`}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                Move to Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("complete")}>
                Move to Complete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {(task.description || task.dueDate) && (
        <CardContent className="pt-0 space-y-2">
          {task.description && (
            <p className="text-xs text-muted-foreground" data-testid={`text-task-description-${task.id}`}>
              {task.description}
            </p>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
            }`}>
              <Clock className="w-3 h-3" />
              <span data-testid={`text-task-due-date-${task.id}`}>
                Due {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
              {isOverdue && <AlertCircle className="w-3 h-3" />}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function KanbanColumn({ title, status, tasks, icon: Icon }: { 
  title: string; 
  status: string; 
  tasks: TaskWithAssignee[]; 
  icon: any;
}) {
  const statusTasks = tasks.filter(task => task.status === status);

  return (
    <div className="flex-1 min-w-80">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-4 h-4" />
          <h3 className="font-medium" data-testid={`text-column-title-${status}`}>
            {title}
          </h3>
          <Badge variant="secondary" className="ml-auto" data-testid={`badge-column-count-${status}`}>
            {statusTasks.length}
          </Badge>
        </div>
        <div className="space-y-3" data-testid={`column-${status}`}>
          {statusTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {statusTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No {title.toLowerCase()} tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [filters, setFilters] = useState({
    search: "",
    priority: "all",
    status: "all",
    assignedTo: "all",
    dueDate: "all",
  });
  const [viewMode, setViewMode] = useState<"board" | "my-tasks" | "team-tasks">("board");

  const queryClient = useQueryClient();

  // Fetch tasks with filters
  const { data: tasksData, isLoading } = useQuery<TasksResponse>({
    queryKey: ["/api/tasks", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value);
      });

      const response = await fetch(`/api/tasks?${params}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const tasks = tasksData?.tasks || [];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      priority: "all",
      status: "all",
      assignedTo: "all",
      dueDate: "all",
    });
  };

  // Apply client-side due date filtering
  const applyDueDateFilter = (tasks: TaskWithAssignee[]) => {
    if (filters.dueDate === "all") return tasks;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisWeekEnd = new Date(today.getTime() + (7 - today.getDay()) * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      switch (filters.dueDate) {
        case "overdue":
          return task.dueDate && new Date(task.dueDate) < today;
        case "today":
          return task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString();
        case "this_week":
          return task.dueDate && new Date(task.dueDate) >= today && new Date(task.dueDate) <= thisWeekEnd;
        case "next_week":
          return task.dueDate && new Date(task.dueDate) > thisWeekEnd && new Date(task.dueDate) <= nextWeek;
        case "no_due_date":
          return !task.dueDate;
        default:
          return true;
      }
    });
  };

  // Apply client-side assignee filtering  
  const applyAssigneeFilter = (tasks: TaskWithAssignee[]) => {
    if (filters.assignedTo === "all") return tasks;
    
    return tasks.filter(task => {
      if (filters.assignedTo === "unassigned") {
        return !task.assignedTo;
      }
      return task.assignedTo === filters.assignedTo;
    });
  };

  // Apply additional client-side filters
  const filteredTasks = applyAssigneeFilter(applyDueDateFilter(tasks));

  // Filter tasks for My Tasks (assuming user1 is current user)
  const myTasks = applyAssigneeFilter(applyDueDateFilter(
    tasks.filter(task => task.assignedTo === "user1" || task.createdBy === "user1")
  ));
  
  // Filter tasks for Team Tasks (all tasks)
  const teamTasks = filteredTasks;

  const getCurrentTasks = () => {
    switch (viewMode) {
      case "my-tasks":
        return myTasks;
      case "team-tasks":
        return teamTasks;
      default:
        return filteredTasks;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks Dashboard</h1>
          <p className="text-muted-foreground">
            Manage tasks, track progress, and coordinate team activities
          </p>
        </div>
        <Button data-testid="button-create-task">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
        <TabsList>
          <TabsTrigger value="board" data-testid="tab-board-view">
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="my-tasks" data-testid="tab-my-tasks">
            My Tasks ({myTasks.length})
          </TabsTrigger>
          <TabsTrigger value="team-tasks" data-testid="tab-team-tasks">
            Team Tasks ({teamTasks.length})
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                    data-testid="input-search-tasks"
                  />
                </div>
              </div>

              {/* Priority Filter */}
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger className="w-full lg:w-48" data-testid="select-priority">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-full lg:w-48" data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Due Date Filter */}
              <Select
                value={filters.dueDate}
                onValueChange={(value) => handleFilterChange("dueDate", value)}
              >
                <SelectTrigger className="w-full lg:w-48" data-testid="select-due-date">
                  <SelectValue placeholder="Due Date" />
                </SelectTrigger>
                <SelectContent>
                  {DUE_DATE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Assignee Filter */}
              <Select
                value={filters.assignedTo}
                onValueChange={(value) => handleFilterChange("assignedTo", value)}
              >
                <SelectTrigger className="w-full lg:w-48" data-testid="select-assignee">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNEE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {/* Kanban Board View */}
        <TabsContent value="board" className="space-y-0">
          {!isLoading && (
            <div className="flex gap-6 overflow-x-auto pb-4">
              <KanbanColumn
                title="Pending"
                status="pending"
                tasks={getCurrentTasks()}
                icon={Clock}
              />
              <KanbanColumn
                title="In Progress"
                status="in_progress"
                tasks={getCurrentTasks()}
                icon={AlertCircle}
              />
              <KanbanColumn
                title="Complete"
                status="complete"
                tasks={getCurrentTasks()}
                icon={CheckCircle}
              />
            </div>
          )}
        </TabsContent>

        {/* My Tasks View */}
        <TabsContent value="my-tasks" className="space-y-0">
          {!isLoading && (
            <div className="flex gap-6 overflow-x-auto pb-4">
              <KanbanColumn
                title="Pending"
                status="pending"
                tasks={myTasks}
                icon={Clock}
              />
              <KanbanColumn
                title="In Progress"
                status="in_progress"
                tasks={myTasks}
                icon={AlertCircle}
              />
              <KanbanColumn
                title="Complete"
                status="complete"
                tasks={myTasks}
                icon={CheckCircle}
              />
            </div>
          )}
        </TabsContent>

        {/* Team Tasks View */}
        <TabsContent value="team-tasks" className="space-y-0">
          {!isLoading && (
            <div className="flex gap-6 overflow-x-auto pb-4">
              <KanbanColumn
                title="Pending"
                status="pending"
                tasks={teamTasks}
                icon={Clock}
              />
              <KanbanColumn
                title="In Progress"
                status="in_progress"
                tasks={teamTasks}
                icon={AlertCircle}
              />
              <KanbanColumn
                title="Complete"
                status="complete"
                tasks={teamTasks}
                icon={CheckCircle}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}