import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  UserCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function People() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [volunteerLevelFilter, setVolunteerLevelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  
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
    setSelectedPerson(person);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setVolunteerLevelFilter("all");
    setLocationFilter("all");
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">People</h1>
        <p className="text-muted-foreground">Manage your volunteer database and contact information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contact Database</span>
            <div className="flex items-center space-x-2">
              <Button size="sm" data-testid="button-add-person">
                <UserCircle className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-people"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-status-filter">
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

            <Select value={volunteerLevelFilter} onValueChange={setVolunteerLevelFilter}>
              <SelectTrigger data-testid="select-volunteer-level-filter">
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
              <SelectTrigger data-testid="select-location-filter">
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

            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load people data</p>
            </div>
          )}

          {/* Data Table */}
          {data && !isLoading && (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                    {data.people.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No people found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.people.map((person) => (
                        <TableRow
                          key={person.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(person)}
                          data-testid={`row-person-${person.id}`}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {person.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <span>{person.name}</span>
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
                                  className="h-8 w-8 p-0"
                                  data-testid={`button-menu-person-${person.id}`}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem data-testid={`button-edit-person-${person.id}`}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`button-contact-person-${person.id}`}>
                                  Contact
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  data-testid={`button-delete-person-${person.id}`}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data.total)} of {data.total} people
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
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
                      data-testid="button-next-page"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="mt-4 text-sm text-muted-foreground text-center">
                {data.total === 0 ? (
                  "No people found"
                ) : (
                  `Found ${data.total} ${data.total === 1 ? "person" : "people"}`
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}