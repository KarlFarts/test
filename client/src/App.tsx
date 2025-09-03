import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BreadcrumbsProvider } from "@/hooks/useBreadcrumbs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCommandPalette } from "@/components/ui/command-palette";
import AppLayout from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import MyTasks from "@/pages/MyTasks";
import MyEvents from "@/pages/MyEvents";
import BallotAccess from "@/pages/BallotAccess";
import VolunteerHub from "@/pages/VolunteerHub";
import VolunteerPipeline from "@/pages/VolunteerPipeline";
import VolunteerAssignments from "@/pages/VolunteerAssignments";
import Tasks from "@/pages/Tasks";
import Events from "@/pages/Events";
import People from "@/pages/People";
import PersonDetail from "@/pages/PersonDetail";
import Templates from "@/pages/Templates";
import NotFound from "@/pages/not-found";

function Router() {
  const { CommandPalette } = useCommandPalette();
  
  return (
    <Switch>
      {/* Landing page without AppLayout (no sidebar/header) */}
      <Route path="/" component={Landing} />
      
      {/* All other routes with AppLayout (includes sidebar/header) */}
      <Route path="/dashboard">
        <AppLayout>
          <Dashboard />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/my-tasks">
        <AppLayout>
          <MyTasks />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/my-events">
        <AppLayout>
          <MyEvents />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/ballot-access">
        <AppLayout>
          <BallotAccess />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/volunteer-hub">
        <AppLayout>
          <VolunteerHub />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/volunteer-pipeline">
        <AppLayout>
          <VolunteerPipeline />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/volunteer-assignments">
        <AppLayout>
          <VolunteerAssignments />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/tasks">
        <AppLayout>
          <Tasks />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/events">
        <AppLayout>
          <Events />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/people">
        <AppLayout>
          <People />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/people/:id">
        <AppLayout>
          <PersonDetail />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route path="/templates">
        <AppLayout>
          <Templates />
          <CommandPalette />
        </AppLayout>
      </Route>
      <Route>
        <AppLayout>
          <NotFound />
          <CommandPalette />
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BreadcrumbsProvider>
          <Router />
        </BreadcrumbsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
