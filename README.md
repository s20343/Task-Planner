to run this project open terminal and npm run dev

fix errors add validation maybe consider adding indexing
fix fronted issue no complated line.

# Task Planner – MongoDB Project

## Description
A web-based task planner that allows users to create, edit, delete, search,
filter, and analyze tasks stored in MongoDB.

## Technologies
- Node.js
- Express
- MongoDB (Mongoose)
- HTML, Bootstrap, JavaScript

## Installation
1. Clone the repository
2. Install dependencies:
   npm install
3. Create `.env` file:
   MONGO_URI=mongodb://localhost:27017/taskplanner
   PORT=3000
4. Start server:
   node server.js

## Database Design
Tasks are stored as MongoDB documents with flexible fields depending on task type.
Optional fields include `deadline`, `project`, and `priority`.

## Indexes
- Text index on `title`, `description`, `project`
- Indexes on `priority`, `project`, `completed`, `deadline`

## API Endpoints
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/search
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- GET /api/tasks/stats/projects
- GET /api/tasks/stats/avg-priority
- GET /api/tasks/stats/summary

## Aggregations
- Number of tasks per project
- Average priority per project
- Overall task statistics

## Frontend
Simple Bootstrap-based UI for task management and filtering.
## Docker & Database Seeding

The application is containerized using Docker.
MongoDB runs in a separate container.

To populate the database with sample data:

docker compose exec backend node seed.js

This script is executed manually and is not part of the normal application runtime.
