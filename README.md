# Fruit Inventory & Management Backend

A secure and scalable REST API for managing fruit inventory in an enterprise environment.

## Features

- User registration and login with JWT authentication
- Role-based authorization (USER & ADMIN)
- Full CRUD operations for Fruits (Inventory Management)
- Category management
- Protected admin routes
- Server-side validation and error handling

## Tech Stack

- Node.js + Express.js
- Prisma ORM
- PostgreSQL (Render)
- JWT for authentication
- bcrypt for password hashing

## Live Backend

**https://fruit-inventory-backend.onrender.com**

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Fruits (Inventory Management)

- `GET /api/fruits` — Get all fruits (public)
- `POST /api/fruits` — Create new fruit (Admin only)
- `PUT /api/fruits/:id` — Update fruit (Admin only)
- `DELETE /api/fruits/:id` — Delete fruit (Admin only)

### Categories

- `GET /api/categories`
- `POST /api/categories` (Admin only)

## Setup Instructions (Local)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
