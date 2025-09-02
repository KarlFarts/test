import { useState } from "react"

import {
  MapPin,
  Files,
  AlertCircle,
  PlusCircle,
  Search,
  Globe,
  Flag,
  ClipboardSignature,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MetricCard } from "@/components/MetricCard"
import { Progress } from "@/components/ui/progress"

export default function BallotAccess() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Ballot Access HQ</h1>
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
              New Petition
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Track progress, deadlines, and documents required for ballot access nationwide.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[520px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="States Qualified"
              value="10 / 50"
              description="Ballot secured"
              icon={<Flag className="h-5 w-5" />}
              trend={{ value: "+2", positive: true }}
            />
            <MetricCard
              title="Signatures Collected"
              value="125,430"
              description="Across all states"
              icon={<ClipboardSignature className="h-5 w-5" />}
              trend={{ value: "+4.5%", positive: true }}
            />
            <MetricCard
              title="Avg. Daily Signatures"
              value="7,120"
              description="Last 7 days"
              icon={<Globe className="h-5 w-5" />}
            />
            <MetricCard
              title="Upcoming Deadlines"
              value="3"
              description="Within 30 days"
              icon={<AlertCircle className="h-5 w-5" />}
              trend={{ value: "-1", positive: false }}
            />
          </div>

          {/* Progress & Activity */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Signature Progress */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>National Signature Progress</CardTitle>
                <CardDescription>Goal: 1,000,000 signatures by May 1st</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={12.5} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>125,430 collected</span>
                    <span>12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* High Priority Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>High-Priority Deadlines</CardTitle>
                <CardDescription>States closing soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["TX", "NY", "FL"].map((state) => (
                    <div key={state} className="flex items-start gap-3">
                      <div className="rounded-lg border p-2 bg-muted/20">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{state} Filing Deadline</p>
                        <p className="text-xs text-muted-foreground">Due in 10 days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* States Tab */}
        <TabsContent value="states" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>State Progress Map</CardTitle>
              <CardDescription>Interactive map coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg">
                <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Deadlines</CardTitle>
              <CardDescription>Filter and export upcoming deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg text-center space-y-2">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Deadline tracking table coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Petition Forms</CardTitle>
              <CardDescription>Upload & download official state forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg text-center space-y-2">
                <Files className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Document repository coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
