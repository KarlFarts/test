# Campaign Management Platform

## Overview

This is a full-stack campaign management platform designed to help political campaigns organize volunteers, manage tasks and events, handle ballot access requirements, and coordinate grassroots activities. The application provides a centralized dashboard for campaign staff to track metrics, manage resources, and coordinate volunteer efforts across multiple areas of campaign operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing with simple API
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod schema validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript throughout the stack for consistency and type safety
- **Architecture Pattern**: Layered architecture with separate routing, storage, and business logic layers
- **Development Setup**: Hot reloading with Vite integration for seamless full-stack development
- **Storage Interface**: Abstract storage layer with in-memory implementation (designed for easy database integration)

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory for type consistency
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Validation**: Drizzle-Zod integration for runtime type validation of database operations

### Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store for scalable session handling
- **User Model**: Basic user schema with username/password authentication ready for expansion
- **Security**: Prepared for role-based access control with extensible user model

### External Dependencies
- **Database**: Neon Database (PostgreSQL) for cloud-native database hosting
- **UI Components**: Extensive Radix UI component library for accessible, customizable interface elements
- **Icons**: Lucide React for consistent iconography throughout the application
- **Development Tools**: ESBuild for production bundling, TSX for TypeScript execution
- **Styling**: PostCSS with Autoprefixer for CSS processing and browser compatibility

The application follows a modular, scalable architecture designed for rapid development and easy maintenance. The storage layer abstraction allows for seamless transition from in-memory development storage to production database implementations. The shared schema approach ensures type consistency between frontend and backend while enabling rapid feature development.