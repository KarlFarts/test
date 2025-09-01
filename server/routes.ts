import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
