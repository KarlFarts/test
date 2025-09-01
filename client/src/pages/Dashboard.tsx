import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isThisWeek, isPast } from "date-fns";
import { useLocation } from "wouter";
import { 
  Users,
  Calendar,
  CheckSquare,
  PlusCircle,
  UserPlus,
  FileText,
  Clock,
  AlertCircle,
  CalendarDays,
  Activity,
  TrendingUp,
  
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatePersonForm } from "@/components/CreatePersonForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { TaskWithAssignee, EventWithStats } from "@shared/schema";

interface DashboardStats {
  totalPeople: number;
  activePeople: number;
  totalEvents: number;
  upcomingEvents: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasksThisWeek: number;
  overdrueTasks: number;
}

interface TasksResponse {
  tasks: TaskWithAssignee[];
  total: number;
}

interface EventsResponse {
  events: EventWithStats[];
  total: number;
}

interface PeopleResponse {
  people: any[];
  total: number;
}

function DailySnapshotStats() {
  const { data: peopleData } = useQuery<PeopleResponse>({
    queryKey: ["/api/people"],
    queryFn: async () => {
      const response = await fetch("/api/people?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch people");
      return response.json();
    },
  });

  const { data: eventsData } = useQuery<EventsResponse>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const response = await fetch("/api/events?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const { data: tasksData } = useQuery<TasksResponse>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const people = peopleData?.people || [];
  const events = eventsData?.events || [];
  const tasks = tasksData?.tasks || [];

  const stats = {
    totalPeople: people.length,
    activePeople: people.filter(p => p.status === "active").length,
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.startDate) > new Date() && e.status === "scheduled").length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === "pending").length,
    completedTasksThisWeek: tasks.filter(t => t.status === "complete" && isThisWeek(new Date(t.updatedAt))).length,
    overdueTasks: tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "complete").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active People</h3>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-people-count">
            {stats.activePeople}
          </div>
          <p className="text-xs text-muted-foreground">{stats.totalPeople} total registered</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Upcoming Events</h3>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-events-count">
            {stats.upcomingEvents}
          </div>
          <p className="text-xs text-muted-foreground">{stats.totalEvents} total events</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Tasks</h3>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-tasks-count">
            {stats.pendingTasks}
          </div>
          <p className="text-xs text-destructive">
            {stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : "All on track"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">This Week</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground" data-testid="text-completed-count">
            {stats.completedTasksThisWeek}
          </div>
          <p className="text-xs text-accent">Tasks completed</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MyFeed() {
  const { data: tasksData } = useQuery<TasksResponse>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks?limit=10");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const { data: eventsData } = useQuery<EventsResponse>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const response = await fetch("/api/events?limit=10");
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const tasks = tasksData?.tasks || [];
  const events = eventsData?.events || [];

  // Create feed from recent task updates and upcoming events
  const feedItems = [
    ...tasks.slice(0, 5).map(task => ({
      id: task.id,
      type: 'task',
      title: task.title,
      description: `Task ${task.status}${task.assignee ? ` - assigned to ${task.assignee.username}` : ''}`,
      time: task.updatedAt,
      priority: task.priority,
    })),
    ...events.slice(0, 3).map(event => ({
      id: event.id,
      type: 'event',
      title: event.title,
      description: `${event.eventType} - ${format(new Date(event.startDate), "MMM d, h:mm a")}`,
      time: event.createdAt,
      status: event.status,
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          My Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedItems.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-3" data-testid={`feed-item-${index}`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${
                item.type === 'task' 
                  ? ('priority' in item && item.priority === 'urgent') ? 'bg-red-500' 
                    : ('priority' in item && item.priority === 'high') ? 'bg-orange-500'
                    : 'bg-blue-500'
                  : ('status' in item && item.status === 'scheduled') ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{item.title}</span>
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(item.time), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
          ))}
          {feedItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MyEvents() {
  const { data: eventsData } = useQuery<EventsResponse>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const response = await fetch("/api/events?limit=20");
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const events = eventsData?.events || [];
  const upcomingEvents = events
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          My Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors" data-testid={`event-item-${event.id}`}>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {event.eventType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(event.startDate), "MMM d, h:mm a")}
                  </span>
                  {isToday(new Date(event.startDate)) && (
                    <Badge variant="secondary" className="text-xs">
                      Today
                    </Badge>
                  )}
                </div>
                {event.location && (
                  <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{event.totalRegistered}</div>
                <div className="text-xs text-muted-foreground">registered</div>
              </div>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MyTasks() {
  const { data: tasksData } = useQuery<TasksResponse>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks?assignedTo=user1&limit=10");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const tasks = tasksData?.tasks || [];
  
  // Sort by priority and due date
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortedTasks = tasks
    .filter(task => task.status !== "complete")
    .sort((a, b) => {
      // First by priority
      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date (overdue first, then earliest due date)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    })
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          My Priority Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const isOverdue = task.dueDate && isPast(new Date(task.dueDate));
            
            return (
              <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors" data-testid={`task-item-${task.id}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-xs ${
                      isOverdue ? "text-red-600" : "text-muted-foreground"
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>Due {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                      {isOverdue && <AlertCircle className="w-3 h-3" />}
                    </div>
                  )}
                </div>
                <Badge variant={task.status === "in_progress" ? "default" : "secondary"} className="text-xs">
                  {task.status.replace("_", " ")}
                </Badge>
              </div>
            );
          })}
          {sortedTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No pending tasks assigned to you
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

 

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showCreatePerson, setShowCreatePerson] = useState(false);
  const [view, setView] = useState<"manager" | "action" | "other">("manager");

  const handleCreateEvent = () => setLocation("/events");

  return (
    <div className="space-y-6">
      {/* Header Row with Welcome + Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">Your Command Center for quick actions and oversight.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowCreatePerson(true)}
            data-testid="button-add-volunteer"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add Volunteer
          </Button>
          <Button
            onClick={handleCreateEvent}
            data-testid="button-create-event"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Create Event
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
        <TabsList>
          <TabsTrigger value="manager">Manager View</TabsTrigger>
          <TabsTrigger value="action">Action View</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {/* Manager View: overview + varied-size widgets */}
        <TabsContent value="manager" className="mt-4">
          <DailySnapshotStats />
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <MyFeed />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <MyTasks />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <MyEvents />
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Reports Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Coming soon: KPI charts, fundraising, outreach metrics.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Action View: tasks-focused layout */}
        <TabsContent value="action" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <MyTasks />
              <MyFeed />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <MyEvents />
            </div>
          </div>
        </TabsContent>

        {/* Other View: placeholder customizable area */}
        <TabsContent value="other" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Widget A</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Add any widget here.</p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Widget B (Wide)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Larger card to showcase charts or maps.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Person/Volunteer Modal */}
      <CreatePersonForm open={showCreatePerson} onOpenChange={setShowCreatePerson} />
    </div>
  );
}