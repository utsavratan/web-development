# Dynamic To-Do List Application

![HTML](https://img.shields.io/badge/Frontend-HTML5-orange)
![CSS](https://img.shields.io/badge/Style-CSS3-blue)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-black)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey)

A **full-stack dynamic To-Do List web application** built using **HTML, CSS, JavaScript, Node.js, Express, and SQLite**.
The application allows users to **create, manage, and track tasks efficiently**, with all tasks stored in a database to ensure persistence even after page refresh.

This project demonstrates **frontend UI development, JavaScript DOM manipulation, REST API integration, and database operations**.

---

# Project Overview

This application enables users to:

* Add new tasks with priority
* Edit existing tasks
* Mark tasks as completed
* Delete tasks
* Filter tasks by status
* Store tasks permanently using a database

The project follows a **client–server architecture**, where the frontend interacts with the backend using **REST APIs**.

---

# Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript (DOM Manipulation)
* Fetch API

## Backend

* Node.js
* Express.js

## Database

* SQLite

## Development Tools

* VS Code
* Git & GitHub
* NPM

---

# Project Folder Structure

```
dynamic_todo_list/

frontend/
│
├── index.html
├── style.css
└── script.js

backend/
│
├── server.js
├── package.json
└── db.sqlite
```

---

# Application Features

## Task Management

* Create tasks with title and priority
* Update task information
* Delete tasks
* Mark tasks as completed

## Filtering System

Users can filter tasks by:

* All Tasks
* Active Tasks
* Completed Tasks

## User Interface

* Clean and responsive layout
* Priority labels (Low / Medium / High)
* Completed tasks displayed with line-through styling
* Hover effects for buttons
* Mobile-friendly design

## Persistent Storage

All tasks are stored in an **SQLite database**, ensuring data remains available even after refreshing the page.

---

# Database Schema

Table: **tasks**

| Column    | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| id        | INTEGER  | Primary Key (Auto Increment) |
| title     | TEXT     | Task title                   |
| priority  | TEXT     | Task priority                |
| isDone    | INTEGER  | Completion status (0 or 1)   |
| createdAt | DATETIME | Task creation timestamp      |

---

# REST API Endpoints

## Get All Tasks

```
GET /tasks
```

Returns all tasks stored in the database.

---

## Add New Task

```
POST /tasks
```

Example request body:

```
{
"title": "Buy groceries",
"priority": "High"
}
```

---

## Update Task

```
PUT /tasks/:id
```

Updates the task title or priority.

---

## Toggle Task Completion

```
PATCH /tasks/:id/status
```

Marks a task as completed or active.

---

## Delete Task

```
DELETE /tasks/:id
```

Removes the task from the database.

---

# Installation and Setup

## 1 Clone the Repository

```
git clone https://github.com/yourusername/dynamic-todo-list.git
```

---

## 2 Navigate to Backend Folder

```
cd backend
```

---

## 3 Install Dependencies

```
npm install
```

---

## 4 Start the Server

```
node server.js
```

The backend server will run on:

```
http://localhost:3000
```

---

## 5 Run the Frontend

Open the file:

```
frontend/index.html
```

in your browser.

---

# Input Validation

The application includes basic validation:

* Task title cannot be empty
* Maximum character limit for tasks
* Priority must be selected
* Invalid inputs are rejected

---

# Expected Workflow

Example usage:

1. Add task **Buy groceries (High Priority)**
2. Add task **Complete assignment**
3. Mark **Buy groceries** as completed
4. Edit **Complete assignment → Complete DBMS assignment**
5. Delete unnecessary tasks

All updates appear **instantly in the UI** and are **saved in the database**.

---

# Screenshots

Include the following screenshots in submission:

* Task creation
* Task editing
* Task completion
* Database persistence after refresh

---

# Challenges Faced

Some challenges encountered during development:

* Connecting frontend with backend APIs
* Managing asynchronous JavaScript requests
* Designing database schema
* Updating UI dynamically after CRUD operations

---

# Future Improvements

Possible enhancements:

* Task search functionality
* Sorting by priority or date
* Due date reminders
* Authentication system
* Export tasks to JSON
* Drag-and-drop task management



GitHub
https://github.com/83Aayush 
