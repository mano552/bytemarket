# ByteMarket

A modern full-stack e-commerce application built with **React, TypeScript, Express, Prisma, and PostgreSQL**. The project provides a responsive shopping experience with secure authentication, product management, shopping cart, and order processing.

## Features

* User Authentication (JWT & Google Sign-In)
* Product Catalog with Search & Filtering
* Shopping Cart Management
* Secure Checkout
* Order History
* Admin Product Management (CRUD)
* Responsive UI for Desktop & Mobile

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt

## Project Structure

```text
bytemarket/
├── frontend/
├── backend/
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/bytemarket.git
cd bytemarket
```

### Install dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file inside the **backend** directory.

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
PORT=3000
```

Create a `.env` file inside the **frontend** directory.

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Run the Project

Backend

```bash
cd backend
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
```

Open:

```
http://localhost:5173
```

## License

This project is created for learning and portfolio purposes.
