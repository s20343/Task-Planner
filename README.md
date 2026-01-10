# Task Planner

## 1️⃣ Project Overview

**Task Planner** is a lightweight task management application that allows users to:

* Create, edit, delete, and complete tasks
* Assign tasks to categories (`work`, `personal`, `study`, `other`)
* Set priority (1–5) and optional deadlines
* Organize tasks by projects
* Filter and search tasks
* Aggregate statistics per project and overall

**Tech stack:**

* **Backend:** Node.js, Express.js, Joi for validation
* **Database:** MongoDB (with full-text and field indexes)
* **Frontend:** Vanilla JavaScript, Bootstrap 5, Flatpickr
* **Dev tools:** Nodemon, Docker (MongoDB container)

Supports **client-side and server-side validation**, toggleable for testing.

## 2️⃣ Launch Instructions

### Requirements

* Docker (for MongoDB container)
* Node.js ≥ 18
* npm

### Environment Variables

Create a `.env` file in project root:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/taskplanner
```

### Launch Project

Start MongoDB container using Docker Compose:

```bash
docker-compose up -d
```

Install dependencies:

```bash
npm install
```

Seed the database with sample tasks:

```bash
npm run seed
```

Start development server:

```bash
npm run dev
```

Open frontend in browser at:

```
http://localhost:3000
```

Toggle client-side validation in `script.js`:

```js
const ENABLE_CLIENT_VALIDATION = true; // or false
```

## 3️⃣ Project Architecture

```
Frontend (view/)  <---->  Backend (Express.js API)  <---->  MongoDB
  - index.html          - src/app.js                - Task documents
  - style.css           - src/routes/taskRoutes.js
  - script.js           - src/controllers/
                        - src/models/
                        - src/validators/
                        - src/middlewares/
                        - src/config/db.js
Seed script (seed.js) -> MongoDB
```

* Frontend communicates with REST API via Axios
* Backend validates input (Joi), performs CRUD and aggregations, handles errors
* MongoDB stores tasks with optional fields for flexibility, supports indexes for fast queries

## 4️⃣ Database & Data Structure

### Task Document

```json
{
  "_id": "ObjectId",
  "title": "Finish MongoDB project",
  "description": "Complete NBD assignment",
  "category": "study",
  "priority": 5,
  "project": "NBD",
  "deadline": "2026-01-15T00:00:00.000Z",
  "completed": false,
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-01-10T12:00:00.000Z"
}
```

### Indexes

* Full-text search: `title`, `description`, `project`
* Aggregation/filtering: `project`, `priority`, `completed`, `deadline`

### Query & Filter Examples

* Get all tasks: `GET /api/tasks`

* Get task by ID: `GET /api/tasks/:id`

* Search tasks: `/api/tasks/search?q=meeting&category=work&priority=3`

* Aggregation endpoints:

  * `/api/tasks/stats/projects` → tasks per project
  * `/api/tasks/stats/avg-priority` → average priority per project
  * `/api/tasks/stats/summary` → total, completed, pending, average priority

* Filters for date: `startDate`, `endDate`, `deadline`

## 5️⃣ Validation Rules

| Field       | Validation                             |
| ----------- | -------------------------------------- |
| title       | Required, 3–100 characters             |
| description | Optional, max 500 characters           |
| category    | Required: work, personal, study, other |
| priority    | Required, integer 1–5                  |
| project     | Optional, max 100 characters           |
| deadline    | Optional, cannot be past date          |
| completed   | Optional, boolean                      |

Both **client-side** and **server-side** validations follow these rules.

## 6️⃣ Sample Test Data

Seed script (`seed.js`) generates **12 tasks**:

| Category | Count | Priority Range | Deadline                  | Completed      |
| -------- | ----- | -------------- | ------------------------- | -------------- |
| Study    | 3     | 3–5            | Some tasks with deadlines | Mixed          |
| Work     | 3     | 3–5            | Some with deadlines       | Mixed          |
| Personal | 3     | 1–3            | Mostly no deadlines       | Mixed          |
| Other    | 3     | 2–4            | Some with deadlines       | Pending mostly |

* Tasks cover **all categories, priority levels, deadlines, and completion states**
* Provides **good coverage** for testing filters, searches, and aggregations

  
## 7️⃣ Quality & Demonstration

* RESTful API with **full CRUD, filters, and aggregations**  
* **Indexed fields** for fast queries and sorting  
* **MVC pattern implemented**:  
  * **Models** handle data structure and database interaction (`Task` schema)  
  * **Controllers** manage business logic and validation (`taskController.js`)  
  * **Routes** define API endpoints (`taskRoutes.js`)  
  * **Views** (frontend HTML/JS/CSS) interact with the API  
* Sample seed data ensures **realistic testing**  
* Toggleable client-side validation shows **differences between server and client**  
* Responsive UI with **Bootstrap** & **Flatpickr**  
* Error handling clearly distinguishes **validation**, **database**, and **server errors**



## 8️⃣ Data Flow Diagram

```
[Frontend - script.js]
        |
        | Axios REST API
        v
[Backend - Express.js + Joi validation]
        |
        | MongoDB queries, aggregations, filters
        v
[MongoDB - Task collection with indexes]
```

* Frontend handles UI, forms, client-side validation
* Backend handles server-side validation, CRUD, search, aggregation
* MongoDB stores task documents and supports efficient queries via indexes

## 9️⃣ Docker

`docker-compose.yml` runs a **MongoDB container**:

```yaml
version: "3.8"
services:
  mongo:
    image: mongo:6
    container_name: taskplanner_mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

* Provides a **consistent, isolated DB environment**
* Supports easy setup on any machine
