# 🎓 EduNode — School Management REST API

**EduNode** is a full-stack school management application designed to simplify and centralize the management of academic data through a secure and structured **RESTful API**.

The project combines a **Node.js / Express.js backend** with a **React.js frontend** and an **SQLite database**. It provides CRUD operations, data export, statistical reporting, API-key authentication, request validation, logging, rate limiting, and soft-delete functionality.

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Architecture](#-architecture)
* [Tech Stack](#-tech-stack)
* [API Endpoints](#-api-endpoints)
* [Middleware](#-middleware)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [API Authentication](#-api-authentication)
* [Testing the API](#-testing-the-api)
* [Future Improvements](#-future-improvements)
* [Author](#-author)

---

## 📌 Overview

EduNode provides a RESTful backend for managing school-related information while exposing a clean API that can be consumed by the React.js frontend or external clients.

The application follows a layered architecture:

* **Frontend layer** — React.js user interface
* **API layer** — Express.js REST API
* **Middleware layer** — Authentication, validation, logging, rate limiting, and error handling
* **Data layer** — SQLite database

The application supports standard **CRUD operations** and additional features such as CSV export, statistics, and soft deletion.

### Main objectives

* Centralize school data management
* Provide a structured REST API
* Separate frontend and backend responsibilities
* Secure API access
* Validate incoming requests
* Facilitate data reporting and export
* Provide a foundation that can be extended for production use

---

## ✨ Features

### 📚 School Data Management

* Create new records
* Retrieve existing records
* Retrieve individual records by ID
* Update records
* Soft-delete records
* Manage data through RESTful endpoints

### 📊 Reporting & Data

* Statistical reporting
* Dashboard-oriented data
* CSV data export
* SQLite persistent storage

### 🔐 Security

* API key authentication
* Protected API routes
* Request validation
* Rate limiting
* Centralized error handling

### ⚙️ Backend

* RESTful API architecture
* Express.js routing
* Middleware-based request processing
* Separation of routes, controllers, models, and middleware

### 💻 Frontend

* React.js application
* REST API consumption
* Axios for HTTP requests
* Responsive user interface

### 🧪 Development & Testing

* Postman for API testing
* Git for version control
* GitHub for source-code management

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │     React.js        │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / REST
                                    ▼
                         ┌─────────────────────┐
                         │    Express.js       │
                         │      REST API       │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │         Middleware          │
                     │                             │
                     │  • Authentication           │
                     │  • Validation               │
                     │  • Logging                  │
                     │  • Rate Limiting            │
                     │  • Error Handling            │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       SQLite        │
                         │      Database       │
                         └─────────────────────┘
```

### Request flow

```text
Client
  │
  ▼
React.js
  │
  ▼
Axios HTTP Request
  │
  ▼
Express.js Router
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Validation
  ├── Rate Limiting
  └── Logging
  │
  ▼
Controller
  │
  ▼
Model / Database Layer
  │
  ▼
SQLite
  │
  ▼
JSON Response
  │
  ▼
React.js
```

---

## 🛠️ Tech Stack

### Backend

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| **Node.js**    | JavaScript runtime              |
| **Express.js** | REST API framework              |
| **SQLite**     | Relational database             |
| **dotenv**     | Environment variable management |

### Frontend

| Technology     | Purpose                |
| -------------- | ---------------------- |
| **React.js**   | User interface         |
| **Axios**      | HTTP/API communication |
| **JavaScript** | Application logic      |
| **HTML / CSS** | Structure and styling  |

### Development Tools

| Tool        | Purpose             |
| ----------- | ------------------- |
| **Postman** | API testing         |
| **Git**     | Version control     |
| **GitHub**  | Source-code hosting |
| **npm**     | Package management  |

---

## 🔌 API Endpoints

The API follows REST principles and uses HTTP methods to perform operations on school data.

### Students

| Method   | Endpoint                   | Description                |
| -------- | -------------------------- | -------------------------- |
| `GET`    | `/api/students`            | Retrieve all students      |
| `GET`    | `/api/students/:id`        | Retrieve a student by ID   |
| `POST`   | `/api/students`            | Create a new student       |
| `PUT`    | `/api/students/:id`        | Update a student           |
| `DELETE` | `/api/students/:id`        | Soft-delete a student      |
| `GET`    | `/api/students/export/csv` | Export student data as CSV |

### Statistics

| Method | Endpoint     | Description                      |
| ------ | ------------ | -------------------------------- |
| `GET`  | `/api/stats` | Retrieve statistical information |

### HTTP Methods

The API uses standard HTTP methods:

```text
GET       → Retrieve data
POST      → Create data
PUT       → Update data
DELETE    → Soft-delete data
```

> **Note:** The endpoints above represent the API structure implemented for the project. Additional resources can be documented here as the API is extended.

---

## 🔐 Middleware

EduNode uses custom middleware to improve security, validation, monitoring, and error management.

### Authentication Middleware

Protects API routes by validating the API key supplied by the client.

```text
Client Request
      │
      ▼
API Key Validation
      │
 ┌────┴────┐
 │         │
Valid    Invalid
 │         │
 ▼         ▼
Route     Error
```

### Logging Middleware

Records incoming HTTP requests to facilitate:

* Debugging
* Monitoring
* Request tracking
* Application analysis

### Validation Middleware

Validates incoming JSON requests before they reach the application logic.

This helps prevent invalid or malformed data from being processed.

### Rate Limiting Middleware

Limits the number of requests that a client can make within a defined period.

This helps reduce:

* Excessive requests
* API abuse
* Unwanted traffic

### Error Handling Middleware

Centralizes API errors and provides consistent HTTP responses.

Example:

```json
{
  "error": true,
  "message": "Resource not found"
}
```

---

## 🗑️ Soft Delete

EduNode implements **soft deletion** rather than immediately removing records from the database.

Instead of permanently deleting a record, the application marks it as deleted or archived.

### Advantages

* Prevents accidental permanent deletion
* Preserves historical data
* Makes recovery possible
* Improves data traceability

Conceptually:

```text
DELETE Request
      │
      ▼
Record marked as deleted
      │
      ▼
Record remains in database
```

---

## 📁 Project Structure

```text
EduNode/
│
├── backend/
│   │
│   ├── controllers/
│   │   └── ...
│   │
│   ├── middleware/
│   │   └── ...
│   │
│   ├── models/
│   │   └── ...
│   │
│   ├── routes/
│   │   └── ...
│   │
│   ├── database.sqlite
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── public/
│   │   └── ...
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following software is installed:

* **Node.js** — version 16 or higher
* **npm** — included with Node.js
* **Git** — for cloning the repository

Check your installed versions:

```bash
node --version
npm --version
git --version
```

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/KHsalma123/EduNode.git
```

Navigate to the project:

```bash
cd EduNode
```

---

### 2. Install backend dependencies

```bash
cd backend
npm install
```

---

### 3. Install frontend dependencies

Open another terminal and run:

```bash
cd frontend
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
DATABASE_PATH=./database.sqlite
API_KEY=your_api_key
```

### Variables

| Variable        | Description                            |
| --------------- | -------------------------------------- |
| `PORT`          | Port used by the Express server        |
| `DATABASE_PATH` | Location of the SQLite database        |
| `API_KEY`       | API key used to protect secured routes |


# ▶️ Running the Application

## Start the Backend

From the `backend` directory:

```bash
npm start
```

The API will be available at:

```text
http://localhost:5000
```

---

## Start the Frontend

From the `frontend` directory:

```bash
npm start
```

The React application will normally be available at:

```text
http://localhost:3000
```

The frontend communicates with the backend through the REST API.

---

## 🗄️ SQLite Database

EduNode uses SQLite as its database.

The database file is created automatically when the application initializes it.

Example:

```text
backend/
└── database.sqlite
```

SQLite was selected because it is:

* Lightweight
* Easy to configure
* Serverless
* Suitable for development and small applications
* Convenient for local testing

For larger production environments, the project can later be migrated to PostgreSQL or another enterprise-grade relational database.

---

# 🔑 API Authentication

Protected API endpoints require an API key.

The API key can be configured through the backend `.env` file:

```env
API_KEY=your_api_key
```

A client can then provide the key in the request headers according to the authentication middleware implementation.

Example:

```http
X-API-Key: your_api_key
```

Unauthorized requests should receive an appropriate HTTP error response.

---

# 🧪 Testing the API

The API can be tested using **Postman** or any HTTP client.

### Example request

```http
GET http://localhost:5000/api/students
```

### Example POST request

```http
POST http://localhost:5000/api/students
Content-Type: application/json
X-API-Key: your_api_key
```

Example JSON payload:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

The exact request body depends on the fields defined by the application's data model.

---

# 📤 CSV Export

EduNode provides an endpoint for exporting student data in CSV format.

```http
GET /api/students/export/csv
```

This functionality can be used for:

* Reporting
* Data analysis
* Administrative operations
* Backup/export purposes

---

# 📊 Statistical Reporting

The API provides a dedicated statistics endpoint:

```http
GET /api/stats
```

This endpoint can be consumed by the React frontend to display statistical information in a dashboard.

Possible use cases include:

* Number of students
* Distribution of records
* Aggregated school data
* Dashboard indicators

---

# 🔮 Future Improvements

The project can be extended with several improvements:

* [ ] JWT-based authentication
* [ ] Role-based access control
* [ ] Admin, teacher, and student accounts
* [ ] Pagination and filtering
* [ ] Search functionality
* [ ] Unit tests
* [ ] Integration tests
* [ ] API documentation with Swagger / OpenAPI
* [ ] PostgreSQL migration
* [ ] Docker containerization
* [ ] CI/CD pipeline
* [ ] Improved dashboard and data visualization
* [ ] Deployment to a cloud platform

---

# 👩‍💻 Author

**Salma Khaliqi**

* GitHub: [@KHsalma123](https://github.com/KHsalma123)
* LinkedIn: [Salma Khaliqi](https://www.linkedin.com/in/salma-khaliqi-1087182a9/)

---

## 📄 License

This project was developed for educational and academic purposes.
