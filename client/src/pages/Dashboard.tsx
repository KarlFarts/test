import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileSignature,
  Calendar,
  CheckSquare,
  PlusCircle,
  UserPlus,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Volunteers</h3>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground" data-testid="text-volunteers-count">
              1,247
            </div>
            <p className="text-xs text-accent">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Signatures Collected</h3>
              <FileSignature className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground" data-testid="text-signatures-count">
              8,432
            </div>
            <p className="text-xs text-accent">+5% from target</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Events This Week</h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground" data-testid="text-events-count">
              12
            </div>
            <p className="text-xs text-muted-foreground">3 today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending Tasks</h3>
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground" data-testid="text-tasks-count">
              23
            </div>
            <p className="text-xs text-destructive">3 overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-3 text-left rounded-md hover:bg-secondary transition-colors"
                data-testid="button-create-event"
              >
                <div className="flex items-center space-x-3">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">Create New Event</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 text-left rounded-md hover:bg-secondary transition-colors"
                data-testid="button-add-volunteer"
              >
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-5 h-5 text-accent" />
                  <span className="font-medium">Add Volunteer</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button 
                className="w-full flex items-center justify-between p-3 text-left rounded-md hover:bg-secondary transition-colors"
                data-testid="button-generate-report"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Generate Report</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3" data-testid="activity-item-1">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">John Smith</span> completed signature collection in District 5
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3" data-testid="activity-item-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Rally at City Hall</span> scheduled for tomorrow
                  </p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3" data-testid="activity-item-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Maria Garcia</span> submitted ballot access forms
                  </p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
