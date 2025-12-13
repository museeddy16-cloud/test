# 🏠 Listing Creation - Complete Test Guide

**Status:** ✅ All Systems Ready  
**Date:** December 13, 2025

---

## Step-by-Step Flow

### **Step 1: Register User**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Host",
  "email": "host@example.com",
  "password": "Password@123",
  "phoneNumber": "0789123456"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "statusCode": 201,
  "data": {
    "id": "user-uuid",
    "email": "host@example.com",
    "firstName": "John",
    "lastName": "Host",
    "token": "eyJhbGc..."
  }
}
```

**Save the token!** You'll need it for subsequent requests.

---

### **Step 2: Upgrade to HOST Role**
```bash
POST http://localhost:3000/api/users/become-host
Authorization: Bearer {token-from-step-1}
```

**Response:**
```json
{
  "message": "Successfully upgraded to HOST role",
  "statusCode": 201,
  "data": {
    "userId": "user-uuid",
    "role": "HOST"
  }
}
```

✅ Now you have HOST role and can create listings!

---

### **Step 3: Create Listing**
```bash
POST http://localhost:3000/api/listings
Authorization: Bearer {token-from-step-1}
Content-Type: application/json

{
  "title": "Beautiful Modern Lake House",
  "description": "Stunning 4-bedroom house with lake views, perfect for families and groups",
  "pricePerNight": 250,
  "bedrooms": 4,
  "bathrooms": 2,
  "maxGuests": 8,
  "address": "123 Lake Shore Road",
  "city": "Kigali",
  "country": "Rwanda",
  "images": [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "https://images.unsplash.com/photo-1570129477492-45ac003d2e2b?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
  ],
  "amenityIds": [],
  "instantBook": true,
  "minNights": 1
}
```

**Response:**
```json
{
  "message": "Listing created successfully",
  "statusCode": 201,
  "data": {
    "id": "listing-uuid",
    "title": "Beautiful Modern Lake House",
    "slug": "beautiful-modern-lake-house-abc123",
    "description": "...",
    "hostId": "user-uuid",
    "status": "DRAFT",
    "pricePerNight": 250,
    "bedrooms": 4,
    "bathrooms": 2,
    "maxGuests": 8,
    "city": "Kigali",
    "country": "Rwanda",
    "images": [...],
    "createdAt": "2025-12-13T10:00:00Z"
  }
}
```

✅ **Listing Created!** Status is "DRAFT" (private) until you publish it.

---

### **Step 4 (Optional): Publish Listing**
```bash
POST http://localhost:3000/api/listings/{listing-id}/publish
Authorization: Bearer {token-from-step-1}
```

**Response:**
```json
{
  "message": "Listing published successfully",
  "statusCode": 200,
  "data": {
    "id": "listing-uuid",
    "status": "ACTIVE",
    "isActive": true,
    ...
  }
}
```

✅ **Now visible to guests!** Status is "ACTIVE" (public)

---

## Using the Frontend (HostOnboarding.tsx)

### **Alternative: Use the Web UI**

1. **Sign Up** at `http://localhost:5000/signup`
   - Fill in: First Name, Last Name, Email, Password, Phone Number

2. **Click "Become a Host"** link (or navigate to `/host-onboarding`)
   - If not logged in, redirects to login

3. **Fill Property Details** (Step 1/4)
   - Title: "Beautiful Modern Lake House"
   - Description: Property details
   - Click "Next"

4. **Add Photos** (Step 2/4)
   - Upload images OR paste URLs
   - Can add up to 4 images
   - Click "Next"

5. **Add Amenities & Details** (Step 3/4)
   - Select amenities from list
   - Set bedrooms, bathrooms, max guests
   - Click "Next"

6. **Review & Submit** (Step 4/4)
   - Review all information
   - Click "Create Listing"
   - Get redirected to `/dashboard/listings`

---

## Complete Request/Response Example

### **Using cURL:**

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Host",
    "email": "host@example.com",
    "password": "Password@123",
    "phoneNumber": "0789123456"
  }'

# Copy the token from response

# 2. Become Host
curl -X POST http://localhost:3000/api/users/become-host \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Create Listing
curl -X POST http://localhost:3000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Lake House",
    "description": "Amazing property",
    "pricePerNight": 250,
    "bedrooms": 4,
    "bathrooms": 2,
    "maxGuests": 8,
    "address": "123 Lake Shore Road",
    "city": "Kigali",
    "country": "Rwanda",
    "images": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    "amenityIds": []
  }'
```

---

## What Gets Created

When you create a listing, the backend automatically:

✅ **Generates a unique slug** from title (for URLs)  
✅ **Sets status to DRAFT** (private, only owner sees it)  
✅ **Stores all images** in array  
✅ **Links amenities** if provided  
✅ **Creates timestamps** (createdAt, updatedAt)  
✅ **Associates with HOST** user  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Token expired or invalid. Redo Step 1 registration |
| **403 Forbidden** | User doesn't have HOST role. Do Step 2 (become-host) |
| **400 Bad Request** | Missing required fields. Check payload in Step 3 |
| **404 Not Found** | Listing not found when publishing. Check listing ID |
| **409 Conflict** | User already has HOST role (that's OK, can still create listings) |

---

## Database Schema

### Listing Table
```
- id (UUID)
- hostId (Foreign Key → User)
- title (String)
- slug (String, unique)
- description (Text)
- status (DRAFT, ACTIVE, INACTIVE)
- pricePerNight (Decimal)
- bedrooms (Integer)
- bathrooms (Integer)
- maxGuests (Integer)
- address (String)
- city (String)
- country (String)
- images (JSON Array)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### HostProfile Table
```
- id (UUID)
- userId (Foreign Key → User)
- bio (String)
- profilePhoto (String)
- yearsHosting (Integer)
- responseRate (Float)
- totalListings (Integer)
- totalBookings (Integer)
- averageRating (Float)
- superhost (Boolean)
```

---

## Next Steps After Listing Creation

1. ✅ **Update Listing** - `PUT /api/listings/{id}` with new data
2. ✅ **Publish Listing** - `POST /api/listings/{id}/publish`
3. ✅ **View Listing** - `GET /api/listings/{id}`
4. ✅ **Get Your Listings** - `GET /api/listings/host` (requires HOST role)
5. ✅ **Delete Listing** - `DELETE /api/listings/{id}`

---

## Key Files

- **Frontend:** [HostOnboarding.tsx](front/src/pages/HostOnboarding.tsx)
- **Controller:** [ListingController.ts](backend/src/controllers/ListingController.ts)
- **Service:** [ListingService.ts](backend/src/services/ListingService.ts)
- **User Service:** [userService.ts](backend/src/services/userService.ts) → `becomeHost()` method

---

**Status:** ✅ **READY TO TEST**

All systems are operational. You can create listings immediately!
