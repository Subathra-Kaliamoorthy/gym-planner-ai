# React Gym AI Planner

React Gym AI Planner is an AI-assisted fitness planning app that helps users create a personalized workout experience from onboarding to profile-based plan generation. The project combines a modern React front end with an Express + Prisma backend so user preferences can be stored and expanded into dynamic training plans.

## Features

- Guided onboarding questionnaire for goals, experience level, schedule, equipment, and injuries
- Authentication flow for sign-in and account management
- Profile persistence with Prisma and PostgreSQL
- API routes prepared for plan generation and profile management
- Clean React-based user experience with client-side routing

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router
- Backend: Express, TypeScript, Prisma, PostgreSQL
- Auth: Neon authentication integration
- AI-ready backend structure for future plan generation

## Project Structure

- Frontend app: src/
- Backend API: server/src/
- Database schema: server/prisma/schema.prisma

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Start the backend server

```bash
npm run dev:server
```

### 5. Configure environment variables

Create a .env file in the server directory and provide your database connection string and any required auth configuration values.

## Roadmap

- Complete AI-generated workout plan creation
- Add plan history and saved routines
- Improve dashboard and progress tracking


