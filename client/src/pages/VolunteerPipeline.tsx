import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Download, Calendar, FileDown } from "lucide-react";

const pipelineStages = [
  { 
    title: "New Applications", 
    count: 3, 
    color: "bg-gray-100 border-gray-300",
    volunteers: [
      { name: "Alex Rodriguez", initials: "AR", role: "VOLUNTEER", status: "NEEDS REVIEW", priority: "high" },
      { name: "Sarah Mitchell", initials: "SM", role: "VOLUNTEER", status: "NEEDS REVIEW", priority: "medium" },
      { name: "Mike Chen", initials: "MC", role: "VOLUNTEER", status: "VERIFIED", priority: "low" }
    ]
  },
  {
    title: "Screening",
    count: 1,
    color: "bg-blue-50 border-blue-300",
    volunteers: [
      { name: "Emma Thompson", initials: "ET", role: "VOLUNTEER", status: "PENDING", priority: "medium" }
    ]
  },
  {
    title: "Interviews",
    count: 5,
    color: "bg-yellow-50 border-yellow-300",
    volunteers: [
      { name: "Michael Craig", initials: "MC", role: "VOLUNTEER", status: "SCHEDULED", priority: "high" },
      { name: "Lisa Park", initials: "LP", role: "VOLUNTEER", status: "NEEDS REVIEW", priority: "medium" },
      { name: "David Park", initials: "DP", role: "VOLUNTEER", status: "VERIFIED", priority: "low" }
    ]
  },
  {
    title: "Training",
    count: 2,
    color: "bg-purple-50 border-purple-300",
    volunteers: [
      { name: "Sarah Chen", initials: "SC", role: "VOLUNTEER", status: "VERIFIED", priority: "medium" },
      { name: "James Wilson", initials: "JW", role: "VOLUNTEER", status: "VERIFIED", priority: "medium" }
    ]
  },
  {
    title: "Active",
    count: 5,
    color: "bg-green-50 border-green-300",
    volunteers: [
      { name: "Sarah Chen", initials: "SC", role: "VOLUNTEER", status: "VERIFIED", priority: "high" },
      { name: "James Wilson", initials: "JW", role: "VOLUNTEER", status: "VERIFIED", priority: "medium" }
    ]
  }
];

const pipelineAnalytics = [
  { title: "New Applications", percentage: 100, volunteers: 3 },
  { title: "Screening", percentage: 100, volunteers: 1 },
  { title: "Interview", percentage: 100, volunteers: 5 },
  { title: "Training", percentage: 100, volunteers: 2 },
  { title: "Active", percentage: 100, volunteers: 5 }
];

const staffedVolunteers = [
  { name: "Sara Salinas", role: "Canvass Lead", days: "4 days ago" },
  { name: "Liam Park", role: "Phone Bank Lead", days: "5 days ago" },
  { name: "Emily Park", role: "Event Coordinator", days: "1 week ago" }
];

export default function VolunteerPipeline() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Pipeline</h1>
          <p className="text-muted-foreground mt-1">Track volunteers through the onboarding process</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export Pipeline
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search by name..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="needs-review">Needs Review</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {pipelineStages.map((stage, stageIndex) => (
          <Card key={stageIndex} className={`${stage.color} min-h-[500px]`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{stage.title}</span>
                <Badge variant="secondary" className="ml-2">
                  {stage.count}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stage.volunteers.map((volunteer, volunteerIndex) => (
                <Card key={volunteerIndex} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs font-medium">
                          {volunteer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{volunteer.name}</h4>
                        <p className="text-xs text-muted-foreground">{volunteer.role}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant={
                              volunteer.status === 'NEEDS REVIEW' ? 'destructive' : 
                              volunteer.status === 'SCHEDULED' ? 'default' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {volunteer.status}
                          </Badge>
                          {volunteer.priority === 'high' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new volunteer to stage */}
              <Button variant="ghost" className="w-full h-12 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50">
                <Plus className="w-4 h-4 mr-2" />
                Add Volunteer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineAnalytics.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.title}</span>
                  <div className="text-sm text-muted-foreground">
                    {item.percentage}% ({item.volunteers} volunteers)
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Staffed Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle>Staffed Volunteers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Volunteers who have been assigned to leadership roles for the next 7 days
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {staffedVolunteers.map((volunteer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{volunteer.name}</h4>
                  <p className="text-xs text-muted-foreground">{volunteer.role}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {volunteer.days}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
