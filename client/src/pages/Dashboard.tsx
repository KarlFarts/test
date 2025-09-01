import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format, isThisWeek, isPast, parseISO } from "date-fns"
import { useLocation } from "wouter"
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
  Search,
  UserCheck,
  CheckCircle2,
  XCircle
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/StatusBadge"
import { MetricCard } from "@/components/MetricCard"

interface TaskWithAssignee {
  id: string
  title: string
  status: string
  dueDate?: string
  updatedAt: string
  assignee?: {
    id: string
    name: string
  }
}

interface EventWithStats {
  id: string
  title: string
  startDate: string
  status: string
  attendees?: Array<{
    id: string
    status: string
  }>
}

interface TasksResponse {
  tasks: TaskWithAssignee[]
  total: number
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Campaign Dashboard</h1>
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your campaign today.
        </p>
      </div>

      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total People"
              value="1,234"
              description="In database"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: '+12%', positive: true }}
            />
            <MetricCard
              title="Active Volunteers"
              value="256"
              description="Engaged this month"
              icon={<UserCheck className="h-5 w-5" />}
              trend={{ value: '+8', positive: true }}
            />
            <MetricCard
              title="Upcoming Events"
              value="12"
              description="Scheduled"
              icon={<Calendar className="h-5 w-5" />}
            />
            <MetricCard
              title="Tasks Completed"
              value="48"
              description="This week"
              icon={<CheckCircle2 className="h-5 w-5" />}
              trend={{ value: '+5', positive: true }}
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
                <CardDescription>Key metrics and progress indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Campaign metrics visualization</p>
                    <p className="text-xs text-muted-foreground">Engagement, reach, and conversion metrics will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="rounded-lg border p-2 bg-muted/20">
                          <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Campaign Milestone {i}</p>
                          <p className="text-xs text-muted-foreground">
                            Due in {i} week{i !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="rounded-lg border p-2 bg-muted/20">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Activity {i}</p>
                        <p className="text-xs text-muted-foreground">
                          Description of activity {i}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Active team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {`Member ${i}`.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{`Member ${i}`}</p>
                        <p className="text-xs text-muted-foreground truncate">{`Role ${i}`}</p>
                      </div>
                      <StatusBadge status="active" size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Campaign performance metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center space-y-2">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view campaign reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center space-y-2">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Reports dashboard coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Campaign performance metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center space-y-2">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view campaign reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center space-y-2">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Reports dashboard coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
    </Tabs>
  </div>
)
}