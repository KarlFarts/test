import React, { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Users,
  MoreHorizontal,
  CheckSquare,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Home,
  UserCircle,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Person } from "@shared/schema";
import { CreatePersonForm } from "./CreatePersonForm";

interface PeopleResponse {
  people: EnhancedPerson[];
  total: number;
}

interface EnhancedPerson extends Omit<Person, 'petitionGoal' | 'petitionCollected' | 'taskCompletionRate' | 'dataValidationState'> {
  petitionGoal: string | null;
  petitionCollected: string | null;
  taskCompletionRate: string | null;
  dataValidationState: "valid" | "warning" | "error";
  taskCount: number;
  eventCount: number;
  status: "active" | "pending" | "flagged" | "inactive";
  dateOfBirth?: string | null;
  gender?: string | null;
  createdAt?: string;
  address?: string | null;
}

// Seeded random number generator for consistent dummy data
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Dummy data generator function
const generateDummyData = (people: Person[]): EnhancedPerson[] => {
  return people.map((person, index) => {
    const rng = seededRandom((person.id ? parseInt(person.id.replace(/\D/g, ''), 10) || 0 : 0) + index * 1000);
    
    return {
      ...person,
      petitionGoal: Math.floor(rng() * 100 + 50).toString(),
      petitionCollected: Math.floor(rng() * 80).toString(),
      taskCompletionRate: Math.floor(rng() * 100).toString(),
      dataValidationState: (["valid", "warning", "error"] as const)[Math.floor(rng() * 3)],
      taskCount: Math.floor(rng() * 15),
      eventCount: Math.floor(rng() * 8),
      status: (["active", "pending", "flagged", "inactive"] as const)[Math.floor(rng() * 4)]
    };
  });
};

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function EnhancedPeoplePage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [validationFilter, setValidationFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce(search, 300);

  // Stable query key using primitive values only
  const queryKey = useMemo(() => [
    'people',
    debouncedSearch,
    statusFilter,
    validationFilter,
    currentPage,
    pageSize
  ], [debouncedSearch, statusFilter, validationFilter, currentPage, pageSize]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<PeopleResponse> => {
      const params = new URLSearchParams({
        search: debouncedSearch,
        status: statusFilter === "all" ? "" : statusFilter,
        validation: validationFilter === "all" ? "" : validationFilter,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      const response = await fetch(`/api/people?${params}`);
      if (!response.ok) throw new Error("Failed to fetch people");
      
      const result = await response.json();
      return result;
    },
    select: useCallback((data: PeopleResponse) => ({
      ...data,
      people: generateDummyData(data.people)
    }), [generateDummyData])
  });

  // Memoized event handlers
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleValidationFilter = useCallback((value: string) => {
    setValidationFilter(value);
    setCurrentPage(1);
  }, []);

  const handleRowClick = useCallback((personId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(personId)) {
        newSet.delete(personId);
      } else {
        newSet.add(personId);
      }
      return newSet;
    });
  }, []);

  const handleSelectPerson = useCallback((personId: string, checked: boolean) => {
    setSelectedPeople(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(personId);
      } else {
        newSet.delete(personId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked && data?.people) {
      setSelectedPeople(new Set(data.people.map(p => p.id)));
    } else {
      setSelectedPeople(new Set());
    }
  }, [data?.people]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setValidationFilter("all");
    setCurrentPage(1);
  }, []);

  // Memoized pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  }, []);

  // Memoized computed values
  const totalPages = useMemo(() => 
    data ? Math.ceil(data.total / pageSize) : 0
  , [data?.total, pageSize]);

  const isAllSelected = useMemo(() => 
    data?.people && data.people.length > 0 && 
    data.people.every(p => selectedPeople.has(p.id))
  , [data?.people, selectedPeople]);

  const isIndeterminate = useMemo(() => 
    data?.people && selectedPeople.size > 0 && selectedPeople.size < data.people.length
  , [data?.people, selectedPeople]);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading people: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-6 py-8"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={fadeInUp} className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                <Home className="w-4 h-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>People Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <motion.div variants={fadeInUp} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <UserCircle className="w-6 h-6" />
              People Management
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="ml-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={staggerItem} className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search people..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </motion.div>

              <motion.div variants={staggerItem}>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Select value={validationFilter} onValueChange={handleValidationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by validation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Validation States</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading people...</p>
        </div>
      ) : (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        ref={(ref) => {
                          if (ref) (ref as any).indeterminate = isIndeterminate;
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Petition Progress</TableHead>
                    <TableHead>Task Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Validation</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <AnimatePresence>
                  <TableBody>
                    {data?.people.map((person) => (
                      <PersonRow
                        key={person.id}
                        person={person}
                        isSelected={selectedPeople.has(person.id)}
                        isExpanded={expandedRows.has(person.id)}
                        onSelect={(checked) => handleSelectPerson(person.id, checked)}
                        onToggleExpand={() => handleRowClick(person.id)}
                      />
                    ))}
                  </TableBody>
                </AnimatePresence>
              </Table>

              {/* Pagination */}
              <motion.div 
                className="flex items-center justify-between p-4 border-t"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Showing {data?.people.length || 0} of {data?.total || 0} people
                  </span>
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <span className="px-3 py-1 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => console.log('Bulk actions')}
        >
          <Zap className="w-6 h-6" />
        </Button>
      </div>

      {/* Create Person Modal */}
      {showCreateForm && (
        <CreatePersonForm
          open={showCreateForm}
          onOpenChange={(open) => setShowCreateForm(open)}
        />
      )}
    </motion.div>
  );
}

// Memoized PersonRow component to prevent unnecessary re-renders
const PersonRow = React.memo<{
  person: EnhancedPerson;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (checked: boolean) => void;
  onToggleExpand: () => void;
}>(({ person, isSelected, isExpanded, onSelect, onToggleExpand }) => {
  // Memoized calculations
  const petitionProgress = useMemo(() => {
    const collected = parseInt(person.petitionCollected || "0");
    const goal = parseInt(person.petitionGoal || "1");
    return Math.min(100, Math.round((collected / goal) * 100));
  }, [person.petitionCollected, person.petitionGoal]);

  const taskProgress = useMemo(() => {
    return parseInt(person.taskCompletionRate || "0");
  }, [person.taskCompletionRate]);

  const formattedLastContact = useMemo(() => {
    if (!person.lastContact) return "Never";
    const date = new Date(person.lastContact);
    return date.toLocaleDateString();
  }, [person.lastContact]);

  const expandedContent = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="px-12 py-4 bg-gray-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Information
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Date of Birth:</span> {person.dateOfBirth || "Not provided"}</p>
            <p><span className="font-medium">Gender:</span> {person.gender || "Not specified"}</p>
            <p><span className="font-medium">Registration Date:</span> {new Date(person.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Activity Summary
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Petition Progress</span>
              <span className="text-sm font-medium">{petitionProgress}%</span>
            </div>
            <Progress value={petitionProgress} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Task Completion</span>
              <span className="text-sm font-medium">{taskProgress}%</span>
            </div>
            <Progress value={taskProgress} className="h-2" />
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recent Activity
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Tasks:</span> {person.taskCount} active</p>
            <p><span className="font-medium">Events:</span> {person.eventCount} upcoming</p>
            <p><span className="font-medium">Last Activity:</span> {Math.floor(Math.random() * 7) + 1} days ago</p>
          </div>
        </div>
      </div>
    </motion.div>
  ), [person, petitionProgress, taskProgress]);

  return (
    <React.Fragment>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={onToggleExpand}
      >
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium">{person.name}</div>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3 h-3" />
              {person.email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3" />
              {person.phone || "Not provided"}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-3 h-3" />
            {person.address || "Not provided"}
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{person.petitionCollected || 0}/{person.petitionGoal || 0}</span>
              <span>{petitionProgress}%</span>
            </div>
            <Progress value={petitionProgress} className="h-2" />
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Tasks</span>
              <span>{taskProgress}%</span>
            </div>
            <Progress value={taskProgress} className="h-2" />
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant={
              person.status === "active" ? "default" :
              person.status === "pending" ? "secondary" :
              person.status === "flagged" ? "destructive" : "outline"
            }
          >
            {person.status}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {person.dataValidationState === "valid" && <div className="w-2 h-2 rounded-full bg-green-500" />}
            {person.dataValidationState === "warning" && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
            {person.dataValidationState === "error" && <div className="w-2 h-2 rounded-full bg-red-500" />}
            <span className="text-sm capitalize">{person.dataValidationState}</span>
          </div>
        </TableCell>
        <TableCell className="text-sm">
          {formattedLastContact}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocation(`/people/${person.id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Contact', person.id)}>
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </motion.tr>
      
      {isExpanded && (
        <motion.tr key={`${person.id}-expanded`}>
          <TableCell colSpan={10} className="p-0">
            {expandedContent}
          </TableCell>
        </motion.tr>
      )}
    </React.Fragment>
  );
});

PersonRow.displayName = "PersonRow";
