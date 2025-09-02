import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocation } from "wouter";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  Calendar,
  CheckSquare,
  Home
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrafficLightIndicator } from "@/components/ui/traffic-light-indicator";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ExpandableRow } from "@/components/ui/expandable-row";
import { HoverPreview } from "@/components/ui/hover-preview";
import { PersonContextMenu, TableContextMenu } from "@/components/ui/enhanced-context-menu";
import { PrimaryButton } from "@/components/ui/gradient-button";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { CreatePersonForm } from "@/components/CreatePersonForm";
import { 
  pageTransition, 
  staggerContainer, 
  staggerItem, 
  fadeInUp, 
  cardHover 
} from "@/lib/animations";
import type { Person } from "@shared/schema";

interface PeopleResponse {
  people: EnhancedPerson[];
  total: number;
}

interface EnhancedPerson extends Omit<Person, 'petitionGoal' | 'petitionCollected' | 'taskCompletionRate' | 'dataValidationState'> {
  petitionGoal: string | null;
  petitionCollected: string | null;
  taskCompletionRate: string | null;
  dataValidationState: "valid" | "warning" | "error" | null;
  taskCount: number;
  eventCount: number;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "flagged", label: "Flagged" },
  { value: "inactive", label: "Inactive" },
];

// Dummy data for enhanced features
const generateDummyData = (people: Person[]): EnhancedPerson[] => {
  return people.map(person => ({
    ...person,
    petitionGoal: Math.floor(Math.random() * 100 + 50).toString(),
    petitionCollected: Math.floor(Math.random() * 80).toString(),
    taskCompletionRate: Math.floor(Math.random() * 100).toString(),
    dataValidationState: ["valid", "warning", "error"][Math.floor(Math.random() * 3)] as "valid" | "warning" | "error",
    taskCount: Math.floor(Math.random() * 15),
    eventCount: Math.floor(Math.random() * 8),
    status: ["active", "pending", "flagged", "inactive"][Math.floor(Math.random() * 4)] as any
  }));
};

const volunteerLevelOptions = [
  { value: "all", label: "All Levels" },
  { value: "new", label: "New" },
  { value: "regular", label: "Regular" },
  { value: "core", label: "Core" },
];

const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "Downtown", label: "Downtown" },
  { value: "Westside", label: "Westside" },
  { value: "Eastside", label: "Eastside" },
  { value: "Northside", label: "Northside" },
];

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-yellow-500";
  if (percentage >= 40) return "bg-orange-500";
  return "bg-red-500";
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

export default function EnhancedPeoplePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [volunteerLevelFilter, setVolunteerLevelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();
  
  const limit = 10;

  const { data, isLoading, error } = useQuery<PeopleResponse>({
    queryKey: ["/api/people", { search, statusFilter, volunteerLevelFilter, locationFilter, page: currentPage, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      if (volunteerLevelFilter && volunteerLevelFilter !== "all") params.append("volunteerLevel", volunteerLevelFilter);
      if (locationFilter && locationFilter !== "all") params.append("location", locationFilter);
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      const response = await fetch(`/api/people?${params}`);
      if (!response.ok) throw new Error("Failed to fetch people");
      const result = await response.json();
      // Enhance data with dummy metrics for demo
      return {
        ...result,
        people: generateDummyData(result.people)
      };
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleRowClick = (person: EnhancedPerson) => {
    setLocation(`/people/${person.id}`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setVolunteerLevelFilter("all");
    setLocationFilter("all");
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (data?.people) {
      setSelectedIds(new Set(data.people.map(p => p.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handlePersonSelect = (personId: string, selected: boolean) => {
    const newSelected = new Set(selectedIds);
    if (selected) {
      newSelected.add(personId);
    } else {
      newSelected.delete(personId);
    }
    setSelectedIds(newSelected);
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 h-full overflow-auto"
    >
      {/* Breadcrumb Navigation */}
      <motion.div 
        className="mb-4"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Campaign</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>People</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <motion.div 
        className="mb-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">People</h1>
        <p className="text-muted-foreground">Manage your volunteer database and contact information. Track petition goals, task completion, and engagement metrics.</p>
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Quick Guide:</strong> Click on any row to expand detailed information. Use the floating action buttons to quickly add people or assign tasks. Hover over badges to see additional context.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <UserCircle className="w-5 h-5" />
                <span>Contact Database</span>
              </span>
              <div className="flex items-center space-x-2">
                <PrimaryButton 
                  size="sm" 
                  onClick={() => setIsCreateFormOpen(true)}
                  data-testid="button-add-person"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Person
                </PrimaryButton>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Enhanced Search and Filters */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div className="relative" variants={staggerItem}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-primary transition-all duration-200"
                  data-testid="input-search-people"
                />
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger 
                    className="bg-background border-border"
                    data-testid="select-status-filter"
                  >
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Select value={volunteerLevelFilter} onValueChange={setVolunteerLevelFilter}>
                  <SelectTrigger 
                    className="bg-background border-border"
                    data-testid="select-volunteer-level-filter"
                  >
                    <SelectValue placeholder="Volunteer Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteerLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger 
                    className="bg-background border-border"
                    data-testid="select-location-filter"
                  >
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="w-full bg-background border-border hover:bg-muted/50"
                  data-testid="button-clear-filters"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </motion.div>
            </motion.div>

            {/* Loading State with Enhanced Skeletons */}
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableSkeleton rows={5} />
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <p className="text-destructive">Failed to load people data</p>
                </motion.div>
              )}

              {/* Enhanced Data Table with Context Menus */}
              {data && !isLoading && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TableContextMenu
                    selectedCount={selectedIds.size}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    onExport={() => console.log("Export")}
                  >
                    <div className="border rounded-lg overflow-hidden bg-background">
                      <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-8">Expand</TableHead>
                            <TableHead className="w-8">
                              <input
                                type="checkbox"
                                checked={selectedIds.size === data.people.length && data.people.length > 0}
                                onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                                className="rounded border-gray-300"
                              />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Validation</TableHead>
                            <TableHead>Relations</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {data.people.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                  No people found matching your criteria
                                </TableCell>
                              </TableRow>
                            ) : (
                              data.people.map((person, index) => {
                                const petitionProgress = person.petitionGoal && person.petitionCollected 
                                  ? Math.round((parseInt(person.petitionCollected) / parseInt(person.petitionGoal)) * 100)
                                  : 0;
                                const taskProgress = person.taskCompletionRate ? parseInt(person.taskCompletionRate) : 0;
                                
                                const expandedContent = (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Contact Details */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h4>
                                      <div className="space-y-2">
                                        {person.email && (
                                          <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{person.email}</span>
                                          </div>
                                        )}
                                        {person.phone && (
                                          <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{person.phone}</span>
                                          </div>
                                        )}
                                        {person.location && (
                                          <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{person.location}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Progress Metrics */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Progress Metrics</h4>
                                      <div className="space-y-3">
                                        <div>
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Petition Collection</span>
                                            <span>{person.petitionCollected || 0}/{person.petitionGoal || 0}</span>
                                          </div>
                                          <Progress value={petitionProgress} className="h-2" />
                                        </div>
                                        <div>
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Task Completion</span>
                                            <span>{taskProgress}%</span>
                                          </div>
                                          <Progress value={taskProgress} className="h-2" />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Activity Summary */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Activity Summary</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm">Active Tasks</span>
                                          <Badge variant="outline">{person.taskCount || 0}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm">Events Attended</span>
                                          <Badge variant="outline">{person.eventCount || 0}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm">Last Contact</span>
                                          <span className="text-sm text-muted-foreground">
                                            {person.lastContact ? format(new Date(person.lastContact), "MMM d, yyyy") : "Never"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                                
                                return (
                                  <PersonContextMenu
                                    key={person.id}
                                    person={person as any}
                                    onEdit={() => console.log("Edit", person.id)}
                                    onDelete={() => console.log("Delete", person.id)}
                                    onView={() => handleRowClick(person)}
                                    onContact={() => console.log("Contact", person.id)}
                                  >
                                    <ExpandableRow expandedContent={expandedContent}>
                                      <TableCell>
                                        <input
                                          type="checkbox"
                                          checked={selectedIds.has(person.id)}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            handlePersonSelect(person.id, e.target.checked);
                                          }}
                                          className="rounded border-gray-300"
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                          <motion.div 
                                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                          >
                                            {person.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                          </motion.div>
                                          <div>
                                            <HoverPreview
                                              title={person.name}
                                              content={
                                                <div className="space-y-2">
                                                  <p className="text-sm">Volunteer Level: <Badge className={getVolunteerLevelColor(person.volunteerLevel)}>{person.volunteerLevel}</Badge></p>
                                                  <p className="text-sm">Location: {person.location || "Not specified"}</p>
                                                  <p className="text-sm">Tasks: {person.taskCount || 0} active</p>
                                                </div>
                                              }
                                            >
                                              <span 
                                                className="hover:text-primary transition-colors cursor-pointer font-medium"
                                                onClick={() => handleRowClick(person)}
                                              >
                                                {person.name}
                                              </span>
                                            </HoverPreview>
                                            <div className="text-xs text-muted-foreground">
                                              {person.volunteerLevel}
                                            </div>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="space-y-1">
                                          {person.email && (
                                            <div className="flex items-center space-x-1 text-sm">
                                              <Mail className="w-3 h-3 text-muted-foreground" />
                                              <span className="truncate max-w-[120px]">{person.email}</span>
                                            </div>
                                          )}
                                          {person.phone && (
                                            <div className="flex items-center space-x-1 text-sm">
                                              <Phone className="w-3 h-3 text-muted-foreground" />
                                              <span>{person.phone}</span>
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center space-x-2">
                                          <StatusBadge status={person.status as any} />
                                          <TrafficLightIndicator 
                                            state={person.dataValidationState || "valid"} 
                                            showIcon={false}
                                          />
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="space-y-2">
                                          <div>
                                            <div className="flex justify-between text-xs mb-1">
                                              <span>Petitions</span>
                                              <span>{petitionProgress}%</span>
                                            </div>
                                            <Progress value={petitionProgress} className="h-1" />
                                          </div>
                                          <div>
                                            <div className="flex justify-between text-xs mb-1">
                                              <span>Tasks</span>
                                              <span>{taskProgress}%</span>
                                            </div>
                                            <Progress value={taskProgress} className="h-1" />
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <TrafficLightIndicator 
                                          state={person.dataValidationState || "valid"} 
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center space-x-2">
                                          <HoverPreview
                                            title="Tasks"
                                            content={
                                              <div className="space-y-1">
                                                <p className="text-sm">Active tasks: {person.taskCount || 0}</p>
                                                <p className="text-sm">Completion rate: {taskProgress}%</p>
                                              </div>
                                            }
                                          >
                                            <Badge variant="outline" className="text-xs">
                                              <CheckSquare className="w-3 h-3 mr-1" />
                                              {person.taskCount || 0}
                                            </Badge>
                                          </HoverPreview>
                                          <HoverPreview
                                            title="Events"
                                            content={
                                              <div className="space-y-1">
                                                <p className="text-sm">Events attended: {person.eventCount || 0}</p>
                                                <p className="text-sm">Last event: This month</p>
                                              </div>
                                            }
                                          >
                                            <Badge variant="outline" className="text-xs">
                                              <Calendar className="w-3 h-3 mr-1" />
                                              {person.eventCount || 0}
                                            </Badge>
                                          </HoverPreview>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-8 w-8 p-0 hover:bg-white/20"
                                              data-testid={`button-menu-person-${person.id}`}
                                            >
                                              <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="bg-white/95 dark:bg-black/95 backdrop-blur-xl">
                                            <DropdownMenuItem data-testid={`button-edit-person-${person.id}`}>
                                              <Edit className="w-4 h-4 mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem data-testid={`button-contact-person-${person.id}`}>
                                              <Mail className="w-4 h-4 mr-2" />
                                              Contact
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              className="text-destructive"
                                              data-testid={`button-delete-person-${person.id}`}
                                            >
                                              <Trash2 className="w-4 h-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </TableCell>
                                    </ExpandableRow>
                                  </PersonContextMenu>
                                );
                              })
                            )}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </div>
                  </TableContextMenu>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <motion.div 
                      className="flex items-center justify-between mt-6"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data.total)} of {data.total} people
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                          data-testid="button-previous-page"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={currentPage === pageNum ? "" : "bg-background border-border"}
                                data-testid={`button-page-${pageNum}`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                          data-testid="button-next-page"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Action Buttons */}
      <FloatingActionButton
        icon={Plus}
        label="Add New Person"
        onClick={() => setIsCreateFormOpen(true)}
        className="bottom-6 right-6"
        variant="primary"
      />
      
      <FloatingActionButton
        icon={Zap}
        label="Quick Assign Task"
        onClick={() => console.log("Quick assign task")}
        className="bottom-6 right-24"
        variant="secondary"
      />

      {/* Enhanced Create Person Form */}
      <CreatePersonForm 
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </motion.div>
  );
}
