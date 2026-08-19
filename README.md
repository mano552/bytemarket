# 🛍️ ByteMarket - Full-Stack E-Commerce Platform

A modern, fully-featured e-commerce application built with TypeScript, React, Express, and PostgreSQL.

## ✨ Features

- 🔐 **Authentication** - JWT-based auth with Google OAuth integration
- 🛒 **Shopping Cart** - Real-time cart management
- 📦 **Order Management** - Complete order tracking system
- 👔 **Admin Panel** - Product & inventory management
- 🎨 **Modern UI** - Responsive design with mobile-first approach
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔍 **Search & Filter** - Product search and category filtering
- 🖼️ **Image Upload** - Product image management
- 🎯 **Type-Safe** - Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- Context API for state management
- Vite for build tooling

### Backend
- Node.js & Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Multer for file uploads

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mano552/bytemarket.git
cd ecommerce-ts-project
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce"
# JWT_SECRET="your-secret-key"

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5174`

## 📦 Database Schema

- **Users** - Customer and admin accounts
- **Products** - Product catalog with images
- **Categories** - Product categorization
- **Cart** - Shopping cart items
- **Orders** - Order history and tracking

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ecommerce
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id (optional)
```

## 👥 Default Users

After seeding, you can login with:

**Admin Account:**
- Email: `admin@shop.com`
- Password: `admin123`

**Customer Account:**
- Email: `user@example.com`
- Password: `password`

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

## 🏗️ Project Structure

```
ecommerce-ts-project/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   └── uploads/             # Product images
│
└── frontend/
    ├── src/
    │   ├── api/             # API client
    │   ├── components/      # React components
    │   ├── context/         # Context providers
    │   ├── pages/           # Page components
    │   └── types.ts         # TypeScript types
    └── dist/                # Build output
```

## 🎨 Features in Detail

### User Features
- Browse products by category
- Search products by name
- View product details
- Add items to cart
- Checkout and place orders
- View order history
- Google Sign-In integration

### Admin Features
- Create, edit, delete products
- Upload product images
- Manage inventory
- View all products
- Category management

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- SQL injection prevention via Prisma

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ by [Minahil Samreen]

---

⭐ Star this repo if you find it helpful!
