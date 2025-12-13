# IRU Voyage - Property Rental Platform

## Overview
A full-stack property rental platform (similar to Airbnb) built with React/TypeScript frontend and Node.js/Express/Prisma backend with PostgreSQL. Features user authentication, property listings, booking system, reviews, messaging, wishlist, payments (Stripe/MTN/Airtel), and host functionality with image uploads via Cloudinary.

## Recent Updates (December 2025)
- **Responsive Design**: All pages and components now have comprehensive responsive styling with breakpoints at 1200px, 1024px, 900px, 768px, 600px, 480px, and 360px for optimal viewing on all devices
- **Payment Integrations**: Real integrations with Stripe SDK (payment intents), MTN Mobile Money API (OAuth authentication), and Airtel Money API
- **Database Schema**: Added CANCELLED status to PaymentStatus enum

## Project Structure
```
React-TypeScript/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (User, Property, Booking, Review, Payment, Availability)
│   │   └── seed.js                # Database seeder
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js       # Application constants (roles, statuses)
│   │   │   ├── database.js        # Prisma client
│   │   │   ├── index.js           # Config exports
│   │   │   └── jwt.js             # JWT configuration
│   │   ├── controllers/           # Request handlers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── availabilityController.js  # Property availability management
│   │   │   ├── bookingController.js
│   │   │   ├── messageController.js
│   │   │   ├── notificationController.js
│   │   │   ├── paymentController.js       # Payment processing
│   │   │   ├── propertyController.js
│   │   │   ├── reviewController.js
│   │   │   ├── userController.js
│   │   │   └── wishlistController.js
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication, role checks
│   │   │   ├── errorHandler.js    # Global error handling
│   │   │   ├── rateLimiter.js     # Rate limiting
│   │   │   └── validation.js      # Request validation
│   │   ├── routes/                # API route definitions
│   │   ├── services/              # Business logic layer
│   │   │   ├── availabilityService.js     # Availability management
│   │   │   ├── emailService.js            # Email notifications
│   │   │   ├── paymentService.js          # Payment processing (Stripe/MTN/Airtel)
│   │   │   └── ...
│   │   └── utils/                 # Helper functions, validators
│   ├── Dockerfile                 # Backend Docker image
│   ├── swagger.json               # OpenAPI/Swagger documentation
│   └── package.json
├── src/
│   ├── components/
│   │   ├── AvailabilityCalendar.tsx   # Property availability calendar
│   │   ├── ErrorBoundary.tsx          # Error boundary component
│   │   ├── Header.tsx, Footer.tsx     # Layout components
│   │   ├── LoadingSpinner.tsx         # Loading indicator
│   │   ├── PaymentForm.tsx            # Payment form (Stripe/MTN/Airtel)
│   │   ├── PropertyCard.tsx           # Property listing card
│   │   ├── ProtectedRoute.tsx         # Route protection
│   │   ├── SearchFilters.tsx          # Advanced search filters
│   │   └── Sidebar.tsx, AdminSidebar.tsx
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication context with JWT
│   ├── hooks/                     # Custom React hooks
│   │   ├── useApi.ts              # API utility hooks
│   │   ├── useBookings.ts         # Booking data hooks
│   │   ├── usePayments.ts         # Payment data hooks
│   │   └── useProperties.ts       # Property data hooks
│   ├── layouts/
│   │   ├── MainLayout.tsx         # Main site layout
│   │   └── AuthLayout.tsx         # Auth pages layout
│   ├── pages/
│   │   ├── admin/                 # Admin dashboard pages
│   │   ├── BookingConfirmation.tsx    # Booking confirmation page
│   │   ├── Checkout.tsx               # Payment/checkout page
│   │   ├── Dashboard*.tsx         # User dashboard pages
│   │   ├── Home.tsx, Listings.tsx # Main pages
│   │   ├── PropertyDetail.tsx     # Property detail with booking
│   │   └── ...
│   └── styles/                    # CSS styles
├── .env.example                   # Environment variables template
├── docker-compose.yml             # Full-stack Docker orchestration
├── Dockerfile                     # Frontend Docker image
├── nginx.conf                     # Nginx configuration
└── CHECKLIST.md                   # Component checklist

## Tech Stack
**Frontend:**
- React 18 with TypeScript
- Vite build tool
- React Router DOM v7
- Lucide React icons
- CSS with CSS Variables

**Backend:**
- Node.js with Express
- Prisma ORM with PostgreSQL
- JWT authentication with bcryptjs
- Nodemailer for emails
- Multer for file uploads
- Cloudinary for image hosting

**Infrastructure:**
- Docker & Docker Compose
- Nginx for production
- Swagger/OpenAPI documentation

## Database Models
- **User** - Users with roles (USER, HOST, ADMIN)
- **Property** - Property listings with amenities
- **Booking** - Reservations with status tracking
- **Review** - Property reviews and ratings
- **Wishlist** - Saved properties
- **Message** - User messaging
- **Notification** - User notifications
- **Payment** - Payment transactions (Stripe/MTN/Airtel)
- **Availability** - Property blocked dates

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List properties with filters
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Property details
- `POST /api/properties` - Create property (host)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Bookings
- `GET /api/bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/:id/confirm` - Confirm payment
- `GET /api/payments/:id/status` - Get payment status
- `POST /api/payments/:id/refund` - Request refund

### Availability
- `GET /api/availability/property/:id` - Get property availability
- `POST /api/availability/property/:id/block` - Block dates
- `POST /api/availability/property/:id/unblock` - Unblock dates

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/properties` - All properties
- `PUT /api/admin/properties/:id/status` - Update property status

## Environment Variables
See `.env.example` for all required environment variables.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret

**Optional:**
- `STRIPE_SECRET_KEY` - Stripe payment integration
- `MTN_MOMO_API_KEY` - MTN Mobile Money
- `AIRTEL_API_KEY` - Airtel Money
- `CLOUDINARY_*` - Image upload config
- `SMTP_*` - Email configuration

## Running the Project

### Development
```bash
# Frontend (port 5000)
npm run dev

# Backend (port 3000)
cd backend && npm run dev
```

### Docker
```bash
docker-compose up -d
```
- Frontend: http://localhost:80
- Backend API: http://localhost:3000
- Swagger UI: http://localhost:8080

## Recent Changes (December 2025)
- Added Payment system with Stripe, MTN MoMo, and Airtel Money support
- Added Availability management for hosts to block dates
- Added Email notification service
- Added Rate limiting and validation middleware
- Added Docker setup with docker-compose.yml
- Added Swagger/OpenAPI documentation
- Added Checkout and BookingConfirmation pages
- Added custom React hooks (useApi, useProperties, useBookings, usePayments)
- Added ErrorBoundary, LoadingSpinner, SearchFilters components
- Added AvailabilityCalendar component for date management

## Brand Colors
- Primary: #FF5A5F (Airbnb Red)
- Secondary: #222222 (Dark Gray)
- Accent: #00A699 (Teal)
- Background: #F7F7F7 (Light Gray)
