vanilla-node-api
================

- [English](README.md) | [Portuguese](README.pt-br.md)

## Table of Contents

- [Overview](#overview)
  - [Implemented Features](#implemented-features)
- [Project Objective](#project-objective)
- [Main Concepts Covered](#main-concepts-covered)
- [General Architecture](#general-architecture)
  - [Request Flow](#request-flow)
  - [Layer Responsibilities](#layer-responsibilities)
- [Custom Routing System](#custom-routing-system)
  - [Router](#router)
  - [FactoryRouter](#factoryrouter-factory-pattern)
  - [RouterContext](#routercontext-strategy-pattern)
- [MVC Architecture](#mvc-architecture)
  - [Controller](#controller)
  - [Service](#service)
  - [Repository](#repository)
- [Design Patterns Used](#design-patterns-used)
- [Known Limitations](#known-limitations)
- [Technical Motivation](#technical-motivation)
- [Final Considerations](#final-considerations)
- [Installation and Execution](#installation-and-execution)
  - [Prerequisites](#prerequisites)
  - [Local Execution (Conventional Mode – npm)](#local-execution-conventional-mode--npm)
  - [Execution with Docker](#execution-with-docker)
- [Routes Documentation](#routes-documentation-endpoints)
  - [Base URL](#base-url)
  - [GET /products](#-get-products)
  - [GET /products/:id](#-get-productsid)
  - [POST /products/add](#-post-productsadd)
  - [PUT /products/edit/:id](#-put-productseditid)
  - [DELETE /products/:id](#-delete-productsid)
- [License](#license)

> REST API built **exclusively with native Node.js modules**, without using frameworks such as Express or Fastify, focusing on **architecture**, **design patterns**, and a **deep understanding of the HTTP flow**.

📌 Overview
-----------

**vanilla-node-api** is a study project whose goal is to **demonstrate mastery of the internal workings of an HTTP API in Node.js**, manually abstracting responsibilities that are typically provided out of the box by popular frameworks.

This project was developed **intentionally without any web framework**, using only Node.js’s native `http` module, with the purpose of:

- Understanding the full lifecycle of an HTTP request  
- Manually implementing a routing system  
- Applying classic architectural and design patterns  
- Demonstrating the ability to structure scalable and organized code even at a low level  

### Implemented Features

**Dynamic Routing:** Support for URL parameters (e.g., `/products/:id/`) through conversion to Regex.

**Native Body Parser:** Data stream handling to capture POST and PUT payloads.

**Schema Validation:** Generic validator that ensures data integrity before reaching the service layer.

**File Persistence:** Full CRUD persisted in a `.json` file with UUID generation.

> ⚠️ **This project was not designed for production use.**  
> It exists as a **technical and educational demonstration**, especially for portfolio purposes.

🎯 Project Objective
--------------------

- Understand what happens “under the hood” in frameworks such as **Express** and **Fastify**
- Demonstrate the ability to:
  - Model architecture
  - Create consistent abstractions
  - Separate responsibilities
  - Work directly with HTTP, streams, and events

* * *

🧠 Main Concepts Covered
-----------------------

- REST API without frameworks  
- Native HTTP (`node:http`)  
- Manual routing  
- Manual parsing of:
  - URL
  - Query params
  - Path params
  - Body
- Layered architecture (MVC)
- Classic design patterns

🏗️ General Architecture
-----------------------

### Request Flow

```
HTTP Request
   ↓
Node.js HTTP Server
   ↓
ServerApi
   ↓
FactoryRouter
   ↓
RouterContext
   ↓
Router (Strategy)
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
HTTP Response
```

### Flow Description

1. The native HTTP server (`http.createServer`) receives the request.
2. The request is delegated to a central layer (`ServerApi`).
3. **FactoryRouter** identifies which router should handle the route based on the prefix.
4. **RouterContext** executes the selected router (Strategy Pattern).
5. The **Router**:
   - Selects the correct route
   - Extracts path and query parameters
   - Parses the request body
6. The **Controller** executes the corresponding action.
7. The response is built and sent manually via `response`.

```
src/
 ├─ index.ts
 ├─ server.ts
 ├─ router/                 # Routing core
 │   ├─ Router.ts
 │   ├─ RouterContext.ts
 │   ├─ FactoryRouter.ts
 │   └─ ProductRouter.ts
 ├─ controller/             # Acts as an intermediary receiving the HTTP request
 ├─ service/                # Business rules
 ├─ repository/             # Data access
 ├─ utils/                  # Types and Validators
 ├─ exception/              # Custom errors
 └─ db/                     # JSON file (persistence)
```

### Layer Responsibilities

#### `index.ts`

- Initializes the native HTTP server
- Defines the port
- Registers the main API handler

#### `server.ts`

- Acts as the **logical entry point** of the application
- Centralizes request handling
- Forwards requests to the routing system

🛣️ Custom Routing System
------------------------

### Router

The `Router` class is responsible for:

- Registering HTTP routes (`GET`, `POST`, `PUT`, `DELETE`)
- Normalizing URLs
- Associating callbacks with routes
- Dynamically resolving:
  - Path params
  - Query params
  - Request body

Each route stores:

- Callback
- Matching expression
- List of dynamic parameters

> Routing is performed without external dependencies and without middleware.

* * *

### FactoryRouter (Factory Pattern)

Responsible for:

- Managing multiple registered routers
- Dynamically selecting the correct router based on the route prefix

This enables a modular architecture, for example:

- `/products/*`
- `/users/*`
- `/orders/*`

Each domain can have its own isolated router.

* * *

### RouterContext (Strategy Pattern)

`RouterContext` implements the **Strategy Pattern**, allowing:

- Dynamic switching of routing strategies
- Decoupling routing execution logic from its concrete implementation

* * *

🧱 MVC Architecture
-------------------

The project follows a clear separation of responsibilities inspired by the **MVC** pattern, adapted to a REST API context.

### Controller

- Responsible for:
  - Receiving already processed data
  - Orchestrating service calls
  - Returning HTTP responses

### Service

- Contains business rules
- Has no knowledge of HTTP
- Acts as an intermediary layer between Controller and Repository

### Repository

- Responsible for data access
- In this project’s context:
  - Simple persistence
  - Focus on abstraction, not on a real database

* * *

🧩 Design Patterns Used
----------------------

### ✔ Factory Pattern

- Used for dynamic router selection
- Facilitates API scalability

### ✔ Strategy Pattern

- Allows switching routing strategies
- Reduces coupling

### ✔ MVC (adapted)

- Clear separation of responsibilities
- More readable, testable, and maintainable code

* * *

⚠️ Known Limitations
--------------------

This project **is not intended for production use**. Some intentional limitations include:

- No middleware
- No authentication
- No concurrency control
- No robust data validation
- Simple persistence
- No advanced error handling
- No performance optimizations

These decisions were made consciously to **keep the focus on understanding the internal workings** of an HTTP API.

* * *

🧪 Technical Motivation
-----------------------

Modern frameworks abstract away much of HTTP’s complexity.  
This project demonstrates that the author:

- Understands these abstractions
- Can reproduce them manually
- Can structure clean code even without ready-made tools
- Has conceptual mastery beyond merely using frameworks

* * *

📌 Final Considerations
----------------------

This project does not attempt to compete with existing frameworks.  
This repository exists as:

- A demonstration of technical knowledge
- An in-depth Node.js study
- Portfolio material
- Proof of architectural understanding

⚙️ Installation and Execution
-----------------------------

This section describes how to **install, run, and test** the API locally.  
The project offers **two execution methods**, reflecting common modern development scenarios.

* * *

### ✔️ Prerequisites

Regardless of the chosen method, the environment is expected to have:

- **Node.js** (recent version recommended)
- **npm**
- (Optional) **Docker** and **Docker Compose**

* * *

▶️ Local Execution (Conventional Mode – npm)
--------------------------------------------

### 1. Clone the repository

```bash
git clone https://github.com/seu-usuario/vanilla-node-api.git
cd vanilla-node-api
```

### 2\. Install dependencies

Project dependencies are **minimal and focused only on development**:

```bash
npm install
```

**DevDependencies used:**

*   `typescript` – static typing and code organization
    
*   `@types/node` – Node.js type definitions
    
*   `nodemon` – automatic reload during development
    

> No external dependencies are used for HTTP, routing, or middleware.

### 3\. Run the project

#### Development mode (with auto-reload):

```bash
npm run dev
```

Compiled mode:

```bash
npm run build
npm start
```

By default, the server will start at:

```bash
http://localhost:3000
```

🐳 Execution with Docker
----------------------

The project can also be run using **Docker**, ensuring environment isolation and ease of testing.

### Build the image

```bash
docker build -t vanilla-node-api .
```

Run the container

```bash
docker run -p 3000:3000 vanilla-node-api
```

After that, the API will be available at:

```bash
http://localhost:3000
```

🛣️ Routes Documentation (Endpoints)
--------------------------------------

A API expõe um conjunto simples de endpoints focados em **produtos**.

| Método| Rota |Descrição|
|------|-------|---------|
| GET  |`/products`| Returns all registered products in JSON format |
| GET  |`/products/:id`| Returns a specific product in JSON format using the "id" parameter |
| POST |`/products/add` | Sends data through the request body and saves a new product |
| PUT |`/products/edit/:id` |  Updates an existing product|
| DELETE |`/products/:id` | Deletes a product based on its ID |

📦 Base URL

```bash
http://localhost:3000
```

### 🔹 GET `/products/`

**Description:**  
Returns all registered products.

**Response:**

*   `200 OK`
    
*   Array of products

### 🔹 GET `/products/:id/`

**Description:**  
Returns a specific product by `id`.

**Path parameters:**

| Name | Type | Required |
| --- | --- | --- |
| id | string | yes |

**Response:**

*   `200 OK` if found
    
*   `404 Not Found` if it does not exist

### 🔹 POST `/products/add/`

**Description:**  
Creates a new product.

**Expected body (JSON):**

```json
{
  "name": "Produto X",
  "price": 100,
  "count": 10
}
```

**Response:**

*   `201 Created`
    
*   Created product object (with automatically generated `id`)

### 🔹 PUT `/products/edit/:id/`

**Description:**  
Partially or fully updates an existing product.

**Path parameters:**

| Name | Type | Required |
| --- | --- | --- |
| id | string | yes |

```json
{
  "name": "Novo nome",
  "price": 150,
  "count": 5
}
```

**Response:**

*   `200 OK` if updated
    
*   `404 Not Found` if the product does not exist

### 🔹 DELETE `/products/:id/`

**Description:**  
Removes a product by `id`.

**Path parameters:**

| Name | Type | Required |
| --- | --- | --- |
| id | string | yes |

**Resposta:**

*   `200 OK` if removed
    
*   `404 Not Found` if it does not exist

🚧 Known Limitations (Important Section)
-------------------------------------------

This project has **intentional limitations**, aligned with its objective and limited scope of creating a REST API using only the HTTP module.

### Technical limitations:

*   Does not use:
    
    *   Middlewares
        
    *   Authentication
        
    *   Authorization
        
*   Manual body parsing (no advanced streams)
    
*   Simplified persistence (JSON file)
    
*   No:
    
    *   Connection pooling
        
    *   Cache
        
    *   Concurrency control
        
*   Basic error handling
    
*   No structured payload validation
    
*   No automated tests

📄 License
----------

This project is licensed under the **MIT** license.

This means you are free to:

*   Use
    
*   Study
    
*   Modify
    
*   Distribute
    

As long as you keep the copyright notice.