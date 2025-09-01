import { type User, type InsertUser, type Person, type InsertPerson } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private people: Map<string, Person>;

  constructor() {
    this.users = new Map();
    this.people = new Map();
    
    // Add some sample people data
    this.seedPeopleData();
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
          person.email.toLowerCase().includes(searchLower) ||
          person.phone?.toLowerCase().includes(searchLower) ||
          person.location?.toLowerCase().includes(searchLower)
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
      ...insertPerson, 
      id,
      status: insertPerson.status || "active",
      volunteerLevel: insertPerson.volunteerLevel || "new"
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
}

export const storage = new MemStorage();
