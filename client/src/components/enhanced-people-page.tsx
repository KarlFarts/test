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
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PersonContextMenu, TableContextMenu } from "@/components/ui/enhanced-context-menu";
import { GlassCard } from "@/components/ui/glass-panel";
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
  people: Person[];
  total: number;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

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
      return response.json();
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleRowClick = (person: Person) => {
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
      <motion.div 
        className="mb-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">People</h1>
        <p className="text-muted-foreground">Manage your volunteer database and contact information.</p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="shadow-elevation-3">
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
                  className="pl-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20 focus:border-primary/50 transition-all duration-200"
                  data-testid="input-search-people"
                />
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger 
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20"
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
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20"
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
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20"
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
                  className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20 hover:bg-white/70 dark:hover:bg-black/70"
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
                    <div className="border rounded-lg overflow-hidden bg-white/30 dark:bg-black/30 backdrop-blur-sm">
                      <Table>
                        <TableHeader className="bg-white/50 dark:bg-black/50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-8">
                              <input
                                type="checkbox"
                                checked={selectedIds.size === data.people.length && data.people.length > 0}
                                onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                                className="rounded border-gray-300"
                              />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Volunteer Level</TableHead>
                            <TableHead>Last Contact</TableHead>
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
                              data.people.map((person, index) => (
                                <PersonContextMenu
                                  key={person.id}
                                  person={person}
                                  onEdit={() => console.log("Edit", person.id)}
                                  onDelete={() => console.log("Delete", person.id)}
                                  onView={() => handleRowClick(person)}
                                  onContact={() => console.log("Contact", person.id)}
                                >
                                  <motion.tr
                                    className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                    variants={staggerItem}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                  >
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
                                        <span 
                                          className="hover:text-primary transition-colors cursor-pointer"
                                          onClick={() => handleRowClick(person)}
                                        >
                                          {person.name}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{person.email}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {person.phone ? (
                                        <div className="flex items-center space-x-2">
                                          <Phone className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm">{person.phone}</span>
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {person.location ? (
                                        <div className="flex items-center space-x-2">
                                          <MapPin className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-sm">{person.location}</span>
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getStatusColor(person.status)}>
                                        {person.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getVolunteerLevelColor(person.volunteerLevel)}>
                                        {person.volunteerLevel}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {person.lastContact ? (
                                        <span className="text-sm text-muted-foreground">
                                          {format(new Date(person.lastContact), "MMM d, yyyy")}
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">Never</span>
                                      )}
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
                                  </motion.tr>
                                </PersonContextMenu>
                              ))
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
                                className={currentPage === pageNum ? "" : "bg-white/50 dark:bg-black/50 backdrop-blur-sm"}
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
        </GlassCard>
      </motion.div>

      {/* Enhanced Create Person Form */}
      <CreatePersonForm 
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </motion.div>
  );
}
