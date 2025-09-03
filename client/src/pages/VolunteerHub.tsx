import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Users, TrendingUp, AlertCircle, Plus, Settings, Download, Eye } from "lucide-react";

const stats = [
  { title: "ACTIVE VOLUNTEERS", value: "127", change: "+8 this week", icon: Users, color: "text-blue-600" },
  { title: "THIS FY WEEK", value: "23", change: "Last 7 days", icon: CalendarDays, color: "text-green-600" },
  { title: "EVENTS", value: "15", change: "Current pipeline", icon: TrendingUp, color: "text-purple-600" },
  { title: "COMPLETION RATE", value: "78%", change: "Assignments on time", icon: AlertCircle, color: "text-orange-600" }
];

const pipelineData = [
  { status: "New", count: 12, color: "bg-gray-500" },
  { status: "Screening", count: 8, color: "bg-blue-500" },
  { status: "Interview", count: 5, color: "bg-yellow-500" },
  { status: "Training", count: 15, color: "bg-purple-500" },
  { status: "Active", count: 127, color: "bg-green-500" }
];

const urgentActions = [
  { title: "Interview Scheduling", description: "5 new interviews need scheduling", priority: "HIGH", dueDate: "Today" },
  { title: "Training Completion", description: "3 volunteers pending final assessment", priority: "MEDIUM", dueDate: "2 days remaining" },
  { title: "Reference Checks", description: "8 new volunteers need reference verification", priority: "MEDIUM", dueDate: "3 days remaining" },
  { title: "New Applications", description: "12 new volunteer applications to review", priority: "LOW", dueDate: "1 week" }
];

const recentActivity = [
  { name: "Training Completed", user: "John Smith", time: "2 minutes ago", avatar: "JS" },
  { name: "Interview Scheduled", user: "Sarah Johnson", time: "15 minutes ago", avatar: "SJ" },
  { name: "Application Submitted", user: "Mike Davis", time: "1 hour ago", avatar: "MD" },
  { name: "Volunteer Assigned", user: "Lisa Wilson", time: "2 hours ago", avatar: "LW" },
  { name: "Background Check", user: "Tom Brown", time: "3 hours ago", avatar: "TB" }
];

const quickActions = [
  { title: "Review Applications", description: "Process new volunteer applications and schedule interviews", icon: Eye, color: "bg-blue-500" },
  { title: "Manage Training", description: "Schedule and track volunteer training sessions", icon: Settings, color: "bg-red-500" },
  { title: "Export Data", description: "Download volunteer reports and analytics", icon: Download, color: "bg-green-500" },
  { title: "View Reports", description: "Access volunteer performance and engagement metrics", icon: TrendingUp, color: "bg-purple-500" }
];

export default function VolunteerHub() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Hub Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your volunteer pipeline and track engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Schedule Training
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-opacity-10 ${stat.color}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pipeline Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-medium">{item.status}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View Full Pipeline
            </Button>
          </CardContent>
        </Card>

        {/* Urgent Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentActions.map((action, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <Badge 
                    variant={action.priority === 'HIGH' ? 'destructive' : action.priority === 'MEDIUM' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {action.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{action.dueDate}</p>
                {index < urgentActions.length - 1 && <hr className="my-3" />}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Actions
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Show All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button key={index} variant="outline" className="h-auto p-4 flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
