import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { 
  Calendar, 
  List, 
  Filter, 
  Search, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  User
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import type { EventWithStats } from "@shared/schema";

interface EventsResponse {
  events: EventWithStats[];
  total: number;
}

interface EventStats {
  upcoming: number;
  totalRegistered: number;
  totalAttended: number;
}

const EVENT_TYPES = [
  { value: "rally", label: "Rally" },
  { value: "canvassing", label: "Canvassing" },
  { value: "phone-banking", label: "Phone Banking" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "meeting", label: "Meeting" },
  { value: "training", label: "Training" }
];

const EVENT_STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

function EventCard({ event }: { event: EventWithStats }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-500";
      case "ongoing": return "bg-green-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rally": return "bg-purple-100 text-purple-800";
      case "canvassing": return "bg-blue-100 text-blue-800";
      case "phone-banking": return "bg-green-100 text-green-800";
      case "fundraiser": return "bg-yellow-100 text-yellow-800";
      case "meeting": return "bg-gray-100 text-gray-800";
      case "training": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-event-${event.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold" data-testid={`text-event-title-${event.id}`}>
              {event.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getTypeColor(event.eventType)} data-testid={`badge-event-type-${event.id}`}>
                {EVENT_TYPES.find(t => t.value === event.eventType)?.label || event.eventType}
              </Badge>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
                <span className="text-sm text-muted-foreground capitalize" data-testid={`text-event-status-${event.id}`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.description && (
          <p className="text-sm text-muted-foreground" data-testid={`text-event-description-${event.id}`}>
            {event.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span data-testid={`text-event-date-${event.id}`}>
              {format(parseISO(event.startDate.toString()), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span data-testid={`text-event-location-${event.id}`}>
                {event.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span data-testid={`text-event-registered-${event.id}`}>
                  {event.totalRegistered} registered
                </span>
              </div>
              {event.status === "completed" && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid={`text-event-attended-${event.id}`}>
                    {event.totalAttended} attended
                  </span>
                </div>
              )}
            </div>
            
            {event.maxCapacity && (
              <div className="text-xs text-muted-foreground">
                Capacity: {event.maxCapacity}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCards({ stats }: { stats: EventStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card data-testid="card-stats-upcoming">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-stats-upcoming">
            {stats.upcoming}
          </div>
          <p className="text-xs text-muted-foreground">
            Events scheduled
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-stats-registered">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-stats-registered">
            {stats.totalRegistered}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all events
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-stats-attended">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attended</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-stats-attended">
            {stats.totalAttended}
          </div>
          <p className="text-xs text-muted-foreground">
            Completed events
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Events() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filters, setFilters] = useState({
    search: "",
    eventType: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const queryClient = useQueryClient();

  // Fetch events stats
  const { data: stats } = useQuery<EventStats>({
    queryKey: ["/api/events/stats"],
    queryFn: async () => {
      const response = await fetch("/api/events/stats");
      if (!response.ok) throw new Error("Failed to fetch event stats");
      return response.json();
    },
  });

  // Fetch events with filters
  const { data: eventsData, isLoading } = useQuery<EventsResponse>({
    queryKey: ["/api/events", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append("limit", "50"); // Show more events

      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const events = eventsData?.events || [];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      eventType: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  // Simple calendar view - group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = format(parseISO(event.startDate.toString()), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, EventWithStats[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">
            Manage campaign events, rallies, and community outreach activities
          </p>
        </div>
        <Button data-testid="button-create-event">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                  data-testid="input-search-events"
                />
              </div>
            </div>

            {/* Event Type Filter */}
            <Select
              value={filters.eventType}
              onValueChange={(value) => handleFilterChange("eventType", value)}
            >
              <SelectTrigger className="w-full lg:w-48" data-testid="select-event-type">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {EVENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full lg:w-48" data-testid="select-event-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {EVENT_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full lg:w-40"
                data-testid="input-start-date"
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full lg:w-40"
                data-testid="input-end-date"
              />
            </div>

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

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "calendar")}>
        <TabsList>
          <TabsTrigger value="list" data-testid="tab-list-view">
            <List className="w-4 h-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar-view">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {Object.values(filters).some(f => f) ? "Try adjusting your filters" : "Create your first event to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading events...</div>
            </div>
          ) : Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {Object.values(filters).some(f => f) ? "Try adjusting your filters" : "Create your first event to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEvents)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dateKey, dayEvents]) => (
                  <Card key={dateKey}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {format(parseISO(dateKey), "EEEE, MMMM d, yyyy")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dayEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium" data-testid={`text-calendar-event-title-${event.id}`}>
                                  {event.title}
                                </h4>
                                <Badge className={`${EVENT_TYPES.find(t => t.value === event.eventType)?.value === event.eventType ? 
                                  "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"} text-xs`}>
                                  {EVENT_TYPES.find(t => t.value === event.eventType)?.label || event.eventType}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span data-testid={`text-calendar-event-time-${event.id}`}>
                                  {format(parseISO(event.startDate.toString()), "h:mm a")}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {event.totalRegistered} registered
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${
                                event.status === "scheduled" ? "bg-blue-500" :
                                event.status === "ongoing" ? "bg-green-500" :
                                event.status === "completed" ? "bg-gray-500" : "bg-red-500"
                              }`}></div>
                              <span className="text-xs text-muted-foreground capitalize">
                                {event.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}