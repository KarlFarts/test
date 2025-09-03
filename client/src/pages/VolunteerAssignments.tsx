import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Plus, Settings, Phone, Mail } from "lucide-react";

const currentAssignments = [
  {
    id: 1,
    volunteer: "Alex Rodriguez",
    initials: "AR",
    contacted: "2024-01-15 - 4:30 PM",
    location: "Downtown Canvass",
    volunteers: 4,
    status: "Starting Soon"
  },
  {
    id: 2,
    volunteer: "Maria Silva Santos",
    initials: "MS",
    contacted: "2024-01-14 - 2:00 PM",
    location: "Community Center",
    volunteers: 2,
    status: "Completed"
  },
  {
    id: 3,
    volunteer: "Community Team-led Setup",
    initials: "CT",
    contacted: "2024-01-13 - 10:30 AM",
    location: "Campaign HQ",
    volunteers: 2,
    status: "Completed"
  }
];

const upcomingEvents = [
  {
    date: "Wednesday, January 31, 2024",
    events: [
      {
        id: 1,
        title: "Social Media Content Creation",
        time: "9:00 AM - 12:30 PM",
        location: "Campaign HQ",
        volunteers: 3,
        committed: 2,
        status: "Join Now"
      }
    ]
  },
  {
    date: "Thursday, February 1, 2024",
    events: [
      {
        id: 2,
        title: "Voter Registration Drive",
        time: "1:00 PM - 4:00 PM",
        location: "University Campus",
        volunteers: 4,
        committed: 1,
        status: "Join Now"
      }
    ]
  },
  {
    date: "Friday, February 2, 2024",
    events: [
      {
        id: 3,
        title: "Town Hall Photography",
        time: "2:30 PM - 8:00 PM",
        location: "Town Hall",
        volunteers: 3,
        committed: 1,
        status: "Join Now"
      }
    ]
  },
  {
    date: "Monday, February 5, 2024",
    events: [
      {
        id: 4,
        title: "Door Party Marathon",
        time: "9:00 AM - 2:00 PM",
        location: "Riverside Neighborhood",
        volunteers: 6,
        committed: 1,
        status: "Join Now"
      }
    ]
  },
  {
    date: "Tuesday, February 6, 2024",
    events: [
      {
        id: 5,
        title: "Women's Canvassing Blitz",
        time: "10:00 AM - 4:30 PM",
        location: "Various Neighborhoods",
        volunteers: 7,
        committed: 1,
        status: "Join Now"
      }
    ]
  }
];

const needsAssignment = {
  title: "Needs Assignment",
  subtitle: "Weekend Phone Bank",
  date: "Jan 20-21",
  time: "9:00 AM - 4:00 PM",
  volunteers: 5,
  needed: 4,
  actions: [
    { label: "Assign Volunteers", variant: "default" as const },
    { label: "Assign Volunteers", variant: "default" as const },
    { label: "Assign Volunteers", variant: "default" as const }
  ]
};

export default function VolunteerAssignments() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Assignments</h1>
          <p className="text-muted-foreground mt-1">Manage volunteer assignments and event coordination</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Assignments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <div>VOLUNTEER</div>
                <div>CONTACTED</div>
                <div>LOCATION</div>
                <div>VOLUNTEERS ASSIGNED</div>
                <div>STATUS</div>
              </div>
              
              {currentAssignments.map((assignment) => (
                <div key={assignment.id} className="grid grid-cols-5 gap-4 items-center py-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{assignment.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{assignment.volunteer}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{assignment.contacted}</div>
                  <div className="text-sm">{assignment.location}</div>
                  <div className="text-sm">{assignment.volunteers} volunteers</div>
                  <div>
                    <Badge 
                      variant={assignment.status === 'Starting Soon' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs Assignment */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">{needsAssignment.title}</CardTitle>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-medium">{needsAssignment.subtitle}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{needsAssignment.date} • {needsAssignment.time}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {needsAssignment.volunteers} volunteers • {needsAssignment.needed} more needed
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsAssignment.actions.map((action, index) => (
              <Button key={index} variant={action.variant} className="w-full" size="sm">
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events (Next 7-14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {upcomingEvents.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="font-semibold text-lg mb-4">{day.date}</h3>
                <div className="space-y-4">
                  {day.events.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{event.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{event.committed} of {event.volunteers} committed</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="default" size="sm">
                            {event.status}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {dayIndex < upcomingEvents.length - 1 && <hr className="my-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
