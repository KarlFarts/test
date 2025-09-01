import { type User, type InsertUser, type Person, type InsertPerson, type Event, type InsertEvent, type EventRegistration, type InsertEventRegistration, type EventWithStats, type Task, type InsertTask, type TaskWithAssignee } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // People CRUD operations
  getPeople(filters?: { status?: string; volunteerLevel?: string; location?: string; search?: string }, pagination?: { page: number; limit: number }): Promise<{ people: Person[]; total: number }>;
  getPerson(id: string): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(id: string, person: Partial<InsertPerson>): Promise<Person | undefined>;
  deletePerson(id: string): Promise<boolean>;
  
  // Duplicate checking
  checkDuplicates(email?: string, phone?: string): Promise<{ emailExists: boolean; phoneExists: boolean }>;
  
  // Events CRUD operations
  getEvents(filters?: { eventType?: string; status?: string; location?: string; startDate?: string; endDate?: string; search?: string }, pagination?: { page: number; limit: number }): Promise<{ events: EventWithStats[]; total: number }>;
  getEvent(id: string): Promise<EventWithStats | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Event Registration operations
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistrations(eventId: string): Promise<EventRegistration[]>;
  updateRegistrationStatus(id: string, status: string): Promise<EventRegistration | undefined>;
  
  // Event Stats
  getEventStats(): Promise<{ upcoming: number; totalRegistered: number; totalAttended: number }>;
  
  // Task CRUD operations
  getTasks(filters?: { priority?: string; status?: string; assignedTo?: string; createdBy?: string; search?: string }, pagination?: { page: number; limit: number }): Promise<{ tasks: TaskWithAssignee[]; total: number }>;
  getTask(id: string): Promise<TaskWithAssignee | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private people: Map<string, Person>;
  private events: Map<string, Event>;
  private eventRegistrations: Map<string, EventRegistration>;
  private tasks: Map<string, Task>;

  constructor() {
    this.users = new Map();
    this.people = new Map();
    this.events = new Map();
    this.eventRegistrations = new Map();
    this.tasks = new Map();
    
    // Add some sample data
    this.seedUsersData();
    this.seedPeopleData();
    this.seedEventsData();
    this.seedTasksData();
  }

  private seedUsersData() {
    const sampleUsers: User[] = [
      {
        id: "user1",
        username: "admin",
        password: "hashedpassword1",
      },
      {
        id: "user2", 
        username: "john.doe",
        password: "hashedpassword2",
      },
      {
        id: "user3",
        username: "jane.smith", 
        password: "hashedpassword3",
      },
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  private seedPeopleData() {
    const samplePeople: Person[] = [
      {
        id: randomUUID(),
        name: "John Smith",
        firstName: "John",
        lastName: "Smith", 
        email: "john.smith@email.com",
        phone: "(555) 123-4567",
        location: "Downtown",
        status: "active",
        volunteerLevel: "core",
        lastContact: new Date("2024-01-15"),
      },
      {
        id: randomUUID(),
        name: "Maria Garcia",
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@email.com",
        phone: "(555) 234-5678",
        location: "Westside",
        status: "active",
        volunteerLevel: "regular",
        lastContact: new Date("2024-01-10"),
      },
      {
        id: randomUUID(),
        name: "David Johnson",
        firstName: "David",
        lastName: "Johnson",
        email: "david.johnson@email.com",
        phone: "(555) 345-6789",
        location: "Eastside",
        status: "inactive",
        volunteerLevel: "new",
        lastContact: new Date("2023-12-20"),
      },
      {
        id: randomUUID(),
        name: "Sarah Williams",
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.williams@email.com",
        phone: "(555) 456-7890",
        location: "Northside",
        status: "active",
        volunteerLevel: "core",
        lastContact: new Date("2024-01-12"),
      },
      {
        id: randomUUID(),
        name: "Michael Brown",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@email.com",
        phone: "(555) 567-8901",
        location: "Downtown",
        status: "active",
        volunteerLevel: "regular",
        lastContact: new Date("2024-01-08"),
      },
    ];

    samplePeople.forEach(person => {
      this.people.set(person.id, person);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPeople(
    filters?: { status?: string; volunteerLevel?: string; location?: string; search?: string },
    pagination?: { page: number; limit: number }
  ): Promise<{ people: Person[]; total: number }> {
    let filteredPeople = Array.from(this.people.values());

    // Apply filters
    if (filters) {
      if (filters.status) {
        filteredPeople = filteredPeople.filter(person => person.status === filters.status);
      }
      if (filters.volunteerLevel) {
        filteredPeople = filteredPeople.filter(person => person.volunteerLevel === filters.volunteerLevel);
      }
      if (filters.location) {
        filteredPeople = filteredPeople.filter(person => person.location === filters.location);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPeople = filteredPeople.filter(person =>
          person.name.toLowerCase().includes(searchLower) ||
          (person.email && person.email.toLowerCase().includes(searchLower)) ||
          (person.phone && person.phone.toLowerCase().includes(searchLower)) ||
          (person.location && person.location.toLowerCase().includes(searchLower))
        );
      }
    }

    const total = filteredPeople.length;

    // Apply pagination
    if (pagination) {
      const start = (pagination.page - 1) * pagination.limit;
      filteredPeople = filteredPeople.slice(start, start + pagination.limit);
    }

    return { people: filteredPeople, total };
  }

  async getPerson(id: string): Promise<Person | undefined> {
    return this.people.get(id);
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = randomUUID();
    const person: Person = { 
      id,
      name: insertPerson.name,
      firstName: insertPerson.firstName ?? null,
      lastName: insertPerson.lastName ?? null,
      email: insertPerson.email ?? null,
      phone: insertPerson.phone ?? null,
      location: insertPerson.location ?? null,
      status: insertPerson.status || "active",
      volunteerLevel: insertPerson.volunteerLevel || "new",
      lastContact: insertPerson.lastContact ?? null
    };
    this.people.set(id, person);
    return person;
  }

  async checkDuplicates(email?: string, phone?: string): Promise<{ emailExists: boolean; phoneExists: boolean }> {
    const people = Array.from(this.people.values());
    
    const emailExists = email ? people.some(person => person.email === email) : false;
    const phoneExists = phone ? people.some(person => person.phone === phone) : false;
    
    return { emailExists, phoneExists };
  }

  async updatePerson(id: string, updateData: Partial<InsertPerson>): Promise<Person | undefined> {
    const person = this.people.get(id);
    if (!person) return undefined;
    
    const updatedPerson: Person = { ...person, ...updateData };
    this.people.set(id, updatedPerson);
    return updatedPerson;
  }

  async deletePerson(id: string): Promise<boolean> {
    return this.people.delete(id);
  }

  private seedEventsData() {
    const now = new Date();
    const sampleEvents: Event[] = [
      {
        id: randomUUID(),
        title: "Community Town Hall",
        description: "Join us for our monthly community discussion about local issues and upcoming initiatives.",
        eventType: "meeting",
        status: "scheduled",
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: "Community Center, 123 Main St",
        virtualLink: null,
        maxCapacity: "100",
        registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Neighborhood Canvassing",
        description: "Door-to-door outreach to connect with voters in the downtown district.",
        eventType: "canvassing",
        status: "scheduled", 
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
        location: "Downtown District",
        virtualLink: null,
        maxCapacity: "25",
        registrationDeadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Phone Bank Training",
        description: "Learn effective phone banking techniques and voter outreach strategies.",
        eventType: "training",
        status: "scheduled",
        startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
        location: "Campaign Headquarters",
        virtualLink: "https://zoom.us/j/1234567890",
        maxCapacity: "50",
        registrationDeadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Fundraising Gala",
        description: "Annual fundraising dinner with guest speakers and live entertainment.",
        eventType: "fundraiser",
        status: "scheduled",
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 5 hours later
        location: "Grand Ballroom, Hotel Plaza",
        virtualLink: null,
        maxCapacity: "200",
        registrationDeadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Victory Rally",
        description: "Pre-election rally to energize supporters and volunteers.",
        eventType: "rally",
        status: "completed",
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        location: "City Park Amphitheater",
        virtualLink: null,
        maxCapacity: "500",
        registrationDeadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleEvents.forEach(event => {
      this.events.set(event.id, event);
    });

    // Add sample registrations
    const eventIds = Array.from(this.events.keys());
    const personIds = Array.from(this.people.keys());
    
    const sampleRegistrations: EventRegistration[] = [
      // Town Hall registrations
      {
        id: randomUUID(),
        eventId: eventIds[0],
        personId: personIds[0],
        registrationStatus: "registered",
        registeredAt: new Date(),
        notes: null,
      },
      {
        id: randomUUID(),
        eventId: eventIds[0],
        personId: personIds[1],
        registrationStatus: "confirmed",
        registeredAt: new Date(),
        notes: null,
      },
      // Canvassing registrations
      {
        id: randomUUID(),
        eventId: eventIds[1],
        personId: personIds[2],
        registrationStatus: "registered",
        registeredAt: new Date(),
        notes: "First time volunteer",
      },
      // Victory Rally registrations (completed event)
      {
        id: randomUUID(),
        eventId: eventIds[4],
        personId: personIds[0],
        registrationStatus: "attended",
        registeredAt: new Date(),
        notes: null,
      },
      {
        id: randomUUID(),
        eventId: eventIds[4],
        personId: personIds[1],
        registrationStatus: "attended",
        registeredAt: new Date(),
        notes: null,
      },
      {
        id: randomUUID(),
        eventId: eventIds[4],
        personId: personIds[2],
        registrationStatus: "no-show",
        registeredAt: new Date(),
        notes: null,
      },
    ];

    sampleRegistrations.forEach(reg => {
      this.eventRegistrations.set(reg.id, reg);
    });
  }

  private seedTasksData() {
    const sampleTasks: Task[] = [
      {
        id: randomUUID(),
        title: "Design campaign flyers",
        description: "Create compelling flyers for the upcoming rally",
        priority: "high",
        status: "pending",
        assignedTo: "user2",
        createdBy: "user1",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Update volunteer database",
        description: "Clean up contact information and add new volunteers",
        priority: "medium",
        status: "in_progress",
        assignedTo: "user3",
        createdBy: "user1",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Schedule phone banking sessions",
        description: "Coordinate volunteer schedules for next week's phone banking",
        priority: "urgent",
        status: "complete",
        assignedTo: "user2",
        createdBy: "user1",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: randomUUID(),
        title: "Prepare rally materials",
        description: "Order banners, signs, and promotional materials for downtown rally",
        priority: "high",
        status: "pending",
        assignedTo: null,
        createdBy: "user1",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Social media content creation",
        description: "Create posts for Facebook, Twitter, and Instagram for this week",
        priority: "medium",
        status: "in_progress",
        assignedTo: "user3",
        createdBy: "user2",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(),
      },
    ];

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
  }

  // Event methods
  async getEvents(
    filters?: { eventType?: string; status?: string; location?: string; startDate?: string; endDate?: string; search?: string },
    pagination?: { page: number; limit: number }
  ): Promise<{ events: EventWithStats[]; total: number }> {
    let filteredEvents = Array.from(this.events.values());

    // Apply filters
    if (filters) {
      if (filters.eventType) {
        filteredEvents = filteredEvents.filter(event => event.eventType === filters.eventType);
      }
      if (filters.status) {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status);
      }
      if (filters.location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location && event.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredEvents = filteredEvents.filter(event => event.startDate >= startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        filteredEvents = filteredEvents.filter(event => event.startDate <= endDate);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchLower) ||
          (event.description && event.description.toLowerCase().includes(searchLower)) ||
          (event.location && event.location.toLowerCase().includes(searchLower))
        );
      }
    }

    // Add registration stats to each event
    const eventsWithStats: EventWithStats[] = filteredEvents.map(event => {
      const registrations = Array.from(this.eventRegistrations.values())
        .filter(reg => reg.eventId === event.id);
      
      const totalRegistered = registrations.length;
      const totalAttended = registrations.filter(reg => reg.registrationStatus === "attended").length;

      return {
        ...event,
        totalRegistered,
        totalAttended
      };
    });

    // Sort by start date (newest first)
    eventsWithStats.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    const total = eventsWithStats.length;

    // Apply pagination
    if (pagination) {
      const start = (pagination.page - 1) * pagination.limit;
      return { 
        events: eventsWithStats.slice(start, start + pagination.limit), 
        total 
      };
    }

    return { events: eventsWithStats, total };
  }

  async getEvent(id: string): Promise<EventWithStats | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;

    const registrations = Array.from(this.eventRegistrations.values())
      .filter(reg => reg.eventId === id);
    
    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter(reg => reg.registrationStatus === "attended").length;

    return {
      ...event,
      totalRegistered,
      totalAttended
    };
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      id,
      title: insertEvent.title,
      description: insertEvent.description ?? null,
      eventType: insertEvent.eventType,
      status: insertEvent.status ?? "scheduled",
      startDate: insertEvent.startDate,
      endDate: insertEvent.endDate ?? null,
      location: insertEvent.location ?? null,
      virtualLink: insertEvent.virtualLink ?? null,
      maxCapacity: insertEvent.maxCapacity ?? null,
      registrationDeadline: insertEvent.registrationDeadline ?? null,
      createdBy: insertEvent.createdBy ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent: Event = { 
      ...event, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    // Also delete related registrations
    const registrations = Array.from(this.eventRegistrations.entries())
      .filter(([_, reg]) => reg.eventId === id);
    
    registrations.forEach(([regId, _]) => {
      this.eventRegistrations.delete(regId);
    });

    return this.events.delete(id);
  }

  // Event Registration methods
  async registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration> {
    const id = randomUUID();
    const eventRegistration: EventRegistration = {
      id,
      eventId: registration.eventId,
      personId: registration.personId,
      registrationStatus: registration.registrationStatus ?? "registered",
      notes: registration.notes ?? null,
      registeredAt: new Date(),
    };
    this.eventRegistrations.set(id, eventRegistration);
    return eventRegistration;
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    return Array.from(this.eventRegistrations.values())
      .filter(reg => reg.eventId === eventId);
  }

  async updateRegistrationStatus(id: string, status: string): Promise<EventRegistration | undefined> {
    const registration = this.eventRegistrations.get(id);
    if (!registration) return undefined;
    
    const updated: EventRegistration = { 
      ...registration, 
      registrationStatus: status 
    };
    this.eventRegistrations.set(id, updated);
    return updated;
  }

  // Event Stats
  async getEventStats(): Promise<{ upcoming: number; totalRegistered: number; totalAttended: number }> {
    const now = new Date();
    const events = Array.from(this.events.values());
    const registrations = Array.from(this.eventRegistrations.values());

    const upcoming = events.filter(event => 
      event.startDate > now && event.status === "scheduled"
    ).length;

    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter(reg => 
      reg.registrationStatus === "attended"
    ).length;

    return { upcoming, totalRegistered, totalAttended };
  }

  // Task methods
  async getTasks(
    filters?: { priority?: string; status?: string; assignedTo?: string; createdBy?: string; search?: string },
    pagination?: { page: number; limit: number }
  ): Promise<{ tasks: TaskWithAssignee[]; total: number }> {
    let filteredTasks = Array.from(this.tasks.values());

    // Apply filters
    if (filters) {
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      if (filters.assignedTo) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === filters.assignedTo);
      }
      if (filters.createdBy) {
        filteredTasks = filteredTasks.filter(task => task.createdBy === filters.createdBy);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }
    }

    // Add assignee and creator information
    const tasksWithAssignee: TaskWithAssignee[] = filteredTasks.map(task => {
      const assignee = task.assignedTo ? this.users.get(task.assignedTo) : undefined;
      const creator = this.users.get(task.createdBy);
      
      return {
        ...task,
        assignee: assignee ? { id: assignee.id, username: assignee.username } : undefined,
        creator: creator ? { id: creator.id, username: creator.username } : { id: task.createdBy, username: "Unknown" }
      };
    });

    // Sort by creation date (newest first)
    tasksWithAssignee.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = tasksWithAssignee.slice(startIndex, endIndex);

    return { tasks: paginatedTasks, total: tasksWithAssignee.length };
  }

  async getTask(id: string): Promise<TaskWithAssignee | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const assignee = task.assignedTo ? this.users.get(task.assignedTo) : undefined;
    const creator = this.users.get(task.createdBy);

    return {
      ...task,
      assignee: assignee ? { id: assignee.id, username: assignee.username } : undefined,
      creator: creator ? { id: creator.id, username: creator.username } : { id: task.createdBy, username: "Unknown" }
    };
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      id,
      title: taskData.title,
      description: taskData.description ?? null,
      priority: taskData.priority ?? "medium",
      status: taskData.status ?? "pending",
      assignedTo: taskData.assignedTo ?? null,
      createdBy: taskData.createdBy,
      dueDate: taskData.dueDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask: Task = { 
      ...existingTask, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
