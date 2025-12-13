# Booking Flow Testing Guide

## Overview
This guide walks through testing the complete booking flow from property discovery to payment confirmation.

## System Status
- ✅ Backend running on `http://localhost:3000`
- ✅ Frontend running on `http://localhost:5000`
- ✅ API configuration: Centralized via `getApiUrl()` function
- ✅ All booking components updated with proper API integration

## Booking Flow Steps

### 1. **Home Page - Property Discovery**
**URL:** `http://localhost:5000`

- Browse featured properties
- Use search form:
  - Enter location
  - Select check-in date
  - Select check-out date
  - Enter number of guests
  - Click "Search"

### 2. **Listings Page - View Filtered Results**
**URL:** `http://localhost:5000/listings`

- Should show properties matching your search criteria
- **Test Filters:**
  - ✅ Type of place toggle
  - ✅ Price range (min/max dual input)
  - ✅ Instant Book filter
  - ✅ More Filters (bedrooms, bathrooms, property type, amenities)

### 3. **Property Detail - Booking Initiation**
**URL:** `http://localhost:5000/property/{id}`

**What happens here:**
```
POST /api/bookings
{
  "propertyId": "string",
  "checkIn": "2025-12-15",
  "checkOut": "2025-12-20",
  "guests": 2
}
```

**Booking validation:**
- ✅ Check-in date cannot be in the past
- ✅ Check-out must be after check-in
- ✅ Minimum 1 night stay required
- ✅ Requires authentication (redirects to login if not logged in)

**Response:**
```json
{
  "id": "booking-uuid",
  "propertyId": "prop-uuid",
  "guestId": "user-uuid",
  "checkIn": "2025-12-15",
  "checkOut": "2025-12-20",
  "guests": 2,
  "totalPrice": 2500,
  "status": "PENDING",
  "bookingNumber": "BK-20251215-001"
}
```

### 4. **Checkout Page - Payment Processing**
**URL:** `http://localhost:5000/checkout/{bookingId}`

**Features:**
- Display booking details
  - Property info
  - Check-in/check-out dates
  - Number of nights
  - Price breakdown (subtotal + service fee)
- Payment method selection:
  - ✅ Stripe (Card payments)
  - ✅ MTN Mobile Money (use phone: 0789145875)
  - ✅ Airtel Money

**Payment API Call:**
```
POST /api/payments/intent
{
  "bookingId": "booking-uuid",
  "provider": "STRIPE" | "MTN_MOMO" | "AIRTEL_MONEY",
  "amount": 2500,
  "phoneNumber": "0789145875" (for MTN/Airtel)
}
```

### 5. **Booking Confirmation**
**URL:** `http://localhost:5000/booking-confirmation/{bookingId}`

- Shows booking reference number
- Displays booking details
- Lists next steps
- Redirect options

---

## Testing Scenarios

### Scenario A: Successful Booking Flow
1. ✅ Home → Search for properties
2. ✅ Listings → Filter results
3. ✅ Property Detail → Create booking
4. ✅ Checkout → Process payment (MTN: 0789145875)
5. ✅ Confirmation → Booking confirmed

### Scenario B: User Authentication Check
1. ❓ Open Property Detail without login
2. ✅ Click "Book Now"
3. ✅ Should redirect to `/login` with return path

### Scenario C: Date Validation
1. ✅ Try booking with past check-in date → Should show error
2. ✅ Try booking with check-out ≤ check-in → Should show error
3. ✅ Try booking with same day check-in/out → Should show error

### Scenario D: Price Calculation
1. Select check-in: Dec 15
2. Select check-out: Dec 20 (5 nights)
3. Property price: $500/night
4. Expected calculation:
   - Subtotal: 5 × $500 = $2,500
   - Service fee: $2,500 × 12% = $300
   - **Total: $2,800**

---

## API Endpoints Reference

### Booking Endpoints
```
POST   /api/bookings                    - Create booking
GET    /api/bookings                    - Get all bookings (ADMIN only)
GET    /api/bookings/my-bookings        - Get user's bookings
GET    /api/bookings/host-bookings      - Get host's bookings
GET    /api/bookings/{id}               - Get booking details
PUT    /api/bookings/{id}/status        - Update booking status (HOST/ADMIN)
POST   /api/bookings/{id}/confirm       - Confirm booking (HOST)
POST   /api/bookings/{id}/cancel        - Cancel booking
POST   /api/bookings/{id}/complete      - Complete booking (HOST)
```

### Payment Endpoints
```
POST   /api/payments/intent             - Create payment intent
POST   /api/payments/{id}/confirm       - Confirm payment
GET    /api/payments/{id}/status        - Get payment status
```

---

## Common Issues & Solutions

### Issue: "Please select check-in and check-out dates"
- **Cause:** Date fields not properly filled
- **Solution:** Make sure to select both dates using date picker

### Issue: "Check-in date cannot be in the past"
- **Cause:** Selected a past date
- **Solution:** Select a future date (today or later)

### Issue: "Not authorized" when accessing booking
- **Cause:** Token expired or user mismatch
- **Solution:** Login again, token will be refreshed

### Issue: API URL pointing to wrong server
- **Cause:** Environment variable not set correctly
- **Solution:** Check `.env.development` has `VITE_API_URL=http://localhost:3000/api`

---

## Performance Checklist

- ✅ All fetch calls use `getApiUrl()` for centralized URL management
- ✅ JWT tokens included in Authorization headers
- ✅ Error handling implemented for all API calls
- ✅ Loading states shown during async operations
- ✅ Form validation before API submission

---

## Testing Payment with MTN

**Phone Number:** `0789145875`

**Steps:**
1. Go to Checkout page
2. Select "MTN Mobile Money"
3. Enter phone: `0789145875`
4. Click "Pay"
5. Watch for mobile money prompt on your phone
6. Confirm the transaction on your device
7. Payment should complete and show confirmation

---

## Dashboard - View Bookings

### Guest Dashboard
**URL:** `http://localhost:5000/dashboard/reservations`

- Shows all your bookings
- Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- View booking details
- Cancel bookings (if status allows)

### Host Dashboard
**URL:** `http://localhost:5000/dashboard/reservations`

- Shows bookings for your properties
- Accept/decline bookings
- Update booking status
- View guest information

### Admin Dashboard
**URL:** `http://localhost:5000/admin/bookings`

- View all bookings in system
- Search bookings
- Filter by status
- Manage disputes

---

## Files Updated for Booking

✅ [Checkout.tsx](front/src/pages/Checkout.tsx) - Added `getApiUrl` import
✅ [useBookings.ts](front/src/hooks/useBookings.ts) - Updated all fetch calls
✅ [PropertyDetail.tsx](front/src/pages/PropertyDetail.tsx) - Uses `getApiUrl`
✅ [DashboardReservations.tsx](front/src/pages/DashboardReservations.tsx) - Uses `getApiUrl`

---

## Next Steps

1. **Test the complete flow** using the scenarios above
2. **Verify payment integration** with MTN: 0789145875
3. **Check dashboard displays** show bookings correctly
4. **Test edge cases** (date validation, error handling)
5. **Monitor browser console** for API errors
6. **Check backend logs** for any server-side issues

---

**Last Updated:** December 12, 2025
