import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonSchema, insertEventSchema, insertEventRegistrationSchema, insertTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // People routes
  app.get("/api/people", async (req, res) => {
    try {
      const { status, volunteerLevel, location, search, page = "1", limit = "10" } = req.query;
      
      const filters = {
        status: status as string,
        volunteerLevel: volunteerLevel as string,
        location: location as string,
        search: search as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await storage.getPeople(filters, pagination);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch people" });
    }
  });

  app.get("/api/people/:id", async (req, res) => {
    try {
      const person = await storage.getPerson(req.params.id);
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.json(person);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch person" });
    }
  });

  app.post("/api/people", async (req, res) => {
    try {
      const validatedData = insertPersonSchema.parse(req.body);
      const person = await storage.createPerson(validatedData);
      res.status(201).json(person);
    } catch (error) {
      res.status(400).json({ error: "Invalid person data" });
    }
  });

  app.post("/api/people/check-duplicates", async (req, res) => {
    try {
      const { email, phone } = req.body;
      const result = await storage.checkDuplicates(email, phone);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to check duplicates" });
    }
  });

  app.patch("/api/people/:id", async (req, res) => {
    try {
      const validatedData = insertPersonSchema.partial().parse(req.body);
      const person = await storage.updatePerson(req.params.id, validatedData);
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.json(person);
    } catch (error) {
      res.status(400).json({ error: "Invalid person data" });
    }
  });

  app.delete("/api/people/:id", async (req, res) => {
    try {
      const success = await storage.deletePerson(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete person" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const { eventType, status, location, startDate, endDate, search, page = "1", limit = "20" } = req.query;
      
      const filters = {
        eventType: eventType as string,
        status: status as string,
        location: location as string,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await storage.getEvents(filters, pagination);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/stats", async (req, res) => {
    try {
      const stats = await storage.getEventStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event stats" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const success = await storage.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Event Registration routes
  app.post("/api/events/:id/register", async (req, res) => {
    try {
      const eventId = req.params.id;
      const validatedData = insertEventRegistrationSchema.parse({
        ...req.body,
        eventId
      });
      const registration = await storage.registerForEvent(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  app.get("/api/events/:id/registrations", async (req, res) => {
    try {
      const registrations = await storage.getEventRegistrations(req.params.id);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.patch("/api/registrations/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const registration = await storage.updateRegistrationStatus(req.params.id, status);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      res.json(registration);
    } catch (error) {
      res.status(400).json({ error: "Failed to update registration status" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const { priority, status, assignedTo, createdBy, search, page = "1", limit = "50" } = req.query;
      
      const filters = {
        priority: priority as string,
        status: status as string,
        assignedTo: assignedTo as string,
        createdBy: createdBy as string,
        search: search as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await storage.getTasks(filters, pagination);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
