import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  CheckSquare, 
  Building, 
  MessageSquare,
  User,
  Clock,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import type { Person, InsertPerson } from "@shared/schema";
import { insertPersonSchema } from "@shared/schema";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getVolunteerLevelColor = (level: string) => {
  switch (level) {
    case "core":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "regular":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "new":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

// Mock data for tabs - in a real app this would come from API
const mockEvents = [
  {
    id: "1",
    name: "Downtown Rally",
    date: new Date("2024-01-10"),
    type: "Rally",
    status: "attended"
  },
  {
    id: "2", 
    name: "Volunteer Training",
    date: new Date("2024-01-05"),
    type: "Training",
    status: "attended"
  }
];

const mockTasks = [
  {
    id: "1",
    title: "Collect signatures at Metro Station",
    dueDate: new Date("2024-01-20"),
    status: "in_progress",
    priority: "high"
  },
  {
    id: "2",
    title: "Phone bank calls",
    dueDate: new Date("2024-01-18"),
    status: "completed",
    priority: "medium"
  }
];

const mockOrganizations = [
  {
    id: "1",
    name: "Local Democratic Club",
    role: "Member",
    joinDate: new Date("2023-06-15")
  },
  {
    id: "2",
    name: "Environmental Action Group",
    role: "Volunteer Coordinator",
    joinDate: new Date("2023-09-01")
  }
];

const mockCommunicationLog = [
  {
    id: "1",
    type: "email",
    subject: "Rally Reminder",
    date: new Date("2024-01-08"),
    direction: "outgoing"
  },
  {
    id: "2",
    type: "phone",
    subject: "Follow-up call",
    date: new Date("2024-01-05"),
    direction: "incoming"
  }
];

export default function PersonDetail() {
  const [, params] = useRoute("/people/:id");
  const personId = params?.id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: person, isLoading, error } = useQuery<Person>({
    queryKey: ["/api/people", personId],
    queryFn: async () => {
      const response = await fetch(`/api/people/${personId}`);
      if (!response.ok) throw new Error("Failed to fetch person");
      return response.json();
    },
    enabled: !!personId,
  });

  const updatePersonMutation = useMutation({
    mutationFn: async (data: Partial<InsertPerson>) => {
      return apiRequest(`/api/people/${personId}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/people"] });
      queryClient.invalidateQueries({ queryKey: ["/api/people", personId] });
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Person updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update person",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertPerson>({
    resolver: zodResolver(insertPersonSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      status: "active",
      volunteerLevel: "new",
    },
  });

  // Update form when person data loads
  useState(() => {
    if (person) {
      form.reset({
        name: person.name,
        email: person.email,
        phone: person.phone || "",
        location: person.location || "",
        status: person.status,
        volunteerLevel: person.volunteerLevel,
      });
    }
  });

  const onSubmit = (data: InsertPerson) => {
    updatePersonMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">Person Not Found</h1>
        <p className="text-muted-foreground mb-6">The person you're looking for doesn't exist or has been removed.</p>
        <Link href="/people">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to People
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/people">
            <Button variant="ghost" size="sm" data-testid="button-back-to-people">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to People
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{person.name}</h1>
            <p className="text-muted-foreground">Person Details</p>
          </div>
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            data-testid="button-edit-person"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Person Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {person.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{person.email}</span>
              </div>
              
              {person.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{person.phone}</span>
                </div>
              )}
              
              {person.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{person.location}</span>
                </div>
              )}
            </div>

            {/* Status & Level */}
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <div className="mt-1">
                  <Badge className={getStatusColor(person.status)}>
                    {person.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">Volunteer Level</span>
                <div className="mt-1">
                  <Badge className={getVolunteerLevelColor(person.volunteerLevel)}>
                    {person.volunteerLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Last Contact */}
            {person.lastContact && (
              <div className="pt-3 border-t border-border">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground block">Last Contact</span>
                    <span className="text-sm font-medium">
                      {format(new Date(person.lastContact), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
              <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks</TabsTrigger>
              <TabsTrigger value="organizations" data-testid="tab-organizations">Organizations</TabsTrigger>
              <TabsTrigger value="communication" data-testid="tab-communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Quick Stats</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Events Attended:</span>
                            <span className="font-medium">{mockEvents.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tasks Assigned:</span>
                            <span className="font-medium">{mockTasks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Organizations:</span>
                            <span className="font-medium">{mockOrganizations.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Recent Activity</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">Completed phone bank task</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-muted-foreground">Attended downtown rally</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Events Attended</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {format(event.date, "MMM d, yyyy")}
                            </span>
                            <Badge variant="secondary">{event.type}</Badge>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckSquare className="w-5 h-5" />
                    <span>Tasks Assigned</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Due: {format(task.dueDate, "MMM d, yyyy")}
                            </span>
                            <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={task.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Organizations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockOrganizations.map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium">{org.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            Member since {format(org.joinDate, "MMM yyyy")}
                          </span>
                        </div>
                        <Badge variant="outline">{org.role}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Communication Log</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockCommunicationLog.map((comm) => (
                      <div key={comm.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium">{comm.subject}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {format(comm.date, "MMM d, yyyy 'at' h:mm a")}
                            </span>
                            <Badge variant="secondary">{comm.type}</Badge>
                          </div>
                        </div>
                        <Badge variant={comm.direction === "outgoing" ? "default" : "outline"}>
                          {comm.direction}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Person</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" data-testid="input-edit-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} data-testid="input-edit-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} data-testid="input-edit-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volunteerLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volunteer Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-volunteer-level">
                          <SelectValue placeholder="Select volunteer level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="core">Core</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updatePersonMutation.isPending}
                  data-testid="button-save-edit"
                >
                  {updatePersonMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}