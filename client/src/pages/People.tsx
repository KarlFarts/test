import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocation } from "wouter";

// Components
import { MasterDetail } from "@/components/ui/split-pane";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePersonForm } from "@/components/CreatePersonForm";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

// Icons
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
  Plus
} from "lucide-react";

// Animations
import { 
  pageTransition, 
  staggerContainer, 
  staggerItem
} from "@/lib/animations";

// Types
import type { Person } from "@shared/schema";

interface PeopleResponse {
  people: Person[];
  total: number;
}

interface FilterOption {
  value: string;
  label: string;
}

const statusOptions: FilterOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const volunteerLevelOptions: FilterOption[] = [
  { value: "all", label: "All Levels" },
  { value: "new", label: "New" },
  { value: "regular", label: "Regular" },
  { value: "core", label: "Core" },
];

const locationOptions: FilterOption[] = [
  { value: "all", label: "All Locations" },
  { value: "Downtown", label: "Downtown" },
  { value: "Westside", label: "Westside" },
  { value: "Eastside", label: "Eastside" },
  { value: "Northside", label: "Northside" },
];

export default function People() {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Person; direction: 'ascending' | 'descending' } | null>(null);

  // Fetch people data
  const { data, isLoading, error } = useQuery<PeopleResponse>({
    queryKey: ['people', { searchTerm, statusFilter, levelFilter, locationFilter, currentPage }],
    queryFn: async () => {
      // TODO: Implement actual API call
      return {
        people: [],
        total: 0,
      };
    },
  });

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.total / 10) : 1;

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle row selection
  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  // Handle sorting
  const requestSort = (key: keyof Person) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading people data. Please try again later.
      </div>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full flex flex-col"
    >
      <MasterDetail
        master={
          <div className="h-full flex flex-col">
            <div className="p-6 pb-0">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">People</h1>
                  <p className="text-muted-foreground">Manage your volunteer database and contact information.</p>
                </div>
                <Button onClick={() => setIsCreateFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Person
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                    startIcon={Search}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
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
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[180px]">
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
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[180px]">
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
                </div>
              </div>
            </div>

            {/* People Table */}
            <div className="flex-1 overflow-auto px-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.people.map((person) => (
                        <TableRow 
                          key={person.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSelectPerson(person)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <span>{person.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{person.email}</TableCell>
                          <TableCell>{person.phone}</TableCell>
                          <TableCell>
                            <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>
                              {person.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{person.location}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Pagination */}
            <div className="p-6 pt-4 flex items-center justify-between border-t">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">1-{data?.people.length}</span> of{' '}
                <span className="font-medium">{data?.total}</span> people
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 2 + i;
                        if (pageNum > totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        }
                      }
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? 'default' : 'ghost'}
                        size="sm"
                        className="w-10 h-10 p-0"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        }
        detail={
          <div className="h-full p-6">
            {selectedPerson ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedPerson.name}</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPerson.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPerson.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPerson.location}</span>
                  </div>
                  <div className="pt-4">
                    <Badge variant={selectedPerson.status === 'active' ? 'default' : 'secondary'}>
                      {selectedPerson.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <UserCircle className="h-12 w-12 mb-2" />
                <p>Select a person to view details</p>
              </div>
            )}
          </div>
        }
      />

      {/* Create Person Form Modal */}
      <CreatePersonForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </motion.div>
  );
}