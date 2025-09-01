import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BreadcrumbsProvider } from "@/hooks/useBreadcrumbs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCommandPalette } from "@/components/ui/command-palette";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MyTasks from "@/pages/MyTasks";
import MyEvents from "@/pages/MyEvents";
import BallotAccess from "@/pages/BallotAccess";
import VolunteerHub from "@/pages/VolunteerHub";
import Tasks from "@/pages/Tasks";
import Events from "@/pages/Events";
import People from "@/pages/People";
import PersonDetail from "@/pages/PersonDetail";
import Templates from "@/pages/Templates";
import NotFound from "@/pages/not-found";

function Router() {
  const { CommandPalette } = useCommandPalette();
  
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/my-tasks" component={MyTasks} />
        <Route path="/my-events" component={MyEvents} />
        <Route path="/ballot-access" component={BallotAccess} />
        <Route path="/volunteer-hub" component={VolunteerHub} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/events" component={Events} />
        <Route path="/people" component={People} />
        <Route path="/people/:id" component={PersonDetail} />
        <Route path="/templates" component={Templates} />
        <Route component={NotFound} />
      </Switch>
      <CommandPalette />
    </AppLayout>
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
