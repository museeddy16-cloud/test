# 🏠 Host Account Flow - Implementation Status & Requirements

**Date:** December 13, 2025  
**Project:** IRU Voyage

---

## **CURRENT STATUS: 60% Complete** 

### ✅ **Already Implemented**

#### **1. Step 1: Role Upgrade**
```
✅ POST /api/users/become-host
   - Upgrades USER → HOST role
   - Creates HostProfile in database
   - Creates HostVerification record
```

#### **2. Step 2-3: Basic Host Profile (Partial)**
Database fields exist:
- ✅ bio (Text)
- ✅ profilePhoto (String)
- ✅ yearsHosting (Integer)
- ✅ responseRate (Float, default 100)
- ✅ responseTime (String, default "Within 1 hour")
- ✅ totalListings, totalBookings, totalEarnings, averageRating

Controllers exist:
- ✅ `PUT /api/host-profile/` - Update profile
- ✅ `GET /api/host-profile/` - Get profile
- ✅ `GET /api/host-profile/{userId}` - Public profile

#### **4. Identity Verification (Partial)**
Database fields exist:
- ✅ idDocument (String - file path/URL)
- ✅ idDocumentType (PASSPORT, DRIVER_LICENSE, NATIONAL_ID)
- ✅ status (PENDING, APPROVED, REJECTED)
- ✅ rejectionReason (optional)

Controllers exist:
- ✅ `POST /api/host-verification/submit` - Submit ID
- ✅ `GET /api/host-verification/status` - Check status
- ✅ `POST /api/host-verification/approve/{userId}` - Admin approve
- ✅ `POST /api/host-verification/reject/{userId}` - Admin reject

#### **5. Payout Setup (Partial)**
Database fields exist:
- ✅ paymentMethod (BANK_TRANSFER, MTN_MOMO, AIRTEL_MONEY, STRIPE)
- ✅ bankName, accountNumber, accountHolderName, routingNumber
- ✅ mobileMoneyNumber, mobileProvider
- ✅ stripeAccountId
- ✅ verified, verifiedAt

Controllers exist:
- ✅ `POST /api/host-payout/account` - Register account
- ✅ `GET /api/host-payout/account` - Get account
- ✅ `PUT /api/host-payout/account/verify` - Verify account

#### **6. Permissions**
- ✅ Only HOST can create listings (`@Security("jwt", ["HOST", "ADMIN"])`)
- ✅ Draft vs Published status (`DRAFT`, `ACTIVE`)

#### **7. Dashboard Access**
- ✅ Can manage listings (`GET /api/listings/host`)
- ✅ Earnings tracking implemented
- ⚠️ Bookings dashboard (partial)
- ⚠️ Messages system (exists but needs frontend)

---

## **⚠️ MISSING / NEEDS IMPLEMENTATION**

### **Priority 1: Required for MVP**

#### **1. Host Profile Form - Address Section**
**Currently Missing:**
```
❌ country field
❌ city field (in profile)
❌ sector/neighborhood field
❌ address field (private)
```

**Need to add to HostProfile table:**
```prisma
model HostProfile {
  // Existing fields...
  
  // NEW FIELDS NEEDED:
  country          String?
  city             String?
  sector           String?
  address          String?       // Private, not shown to guests
}
```

**Then create endpoints:**
```
PUT /api/host-profile/address
- Update country, city, sector, address
```

---

#### **2. Host Profile Form - Phone Verification**
**Currently Missing:**
```
❌ Phone OTP verification
❌ Phone verification status
❌ Phone number in profile
```

**Need to add to HostProfile:**
```prisma
model HostProfile {
  phoneNumber      String?
  phoneVerified    Boolean    @default(false)
  phoneVerifiedAt  DateTime?
}
```

**Need to create endpoints:**
```
POST /api/host-profile/verify-phone/send-otp
- Send OTP to phone number

POST /api/host-profile/verify-phone/confirm-otp
- Confirm OTP
```

---

#### **3. Host Profile Form - Languages Spoken**
**Currently Missing:**
```
❌ Languages field
❌ Language selection
```

**Need to add:**
```prisma
model HostProfile {
  languages        String[]    @default([])  // ["English", "French", "Kinyarwanda"]
}
```

**Need endpoint:**
```
PUT /api/host-profile/languages
- Update languages spoken
```

---

#### **4. Host Profile Form - Photo Upload**
**Currently Missing:**
```
❌ Profile photo upload endpoint
❌ Photo validation
```

**Need to create:**
```
POST /api/host-profile/photo
- Upload profile photo to Cloudinary
- Save URL to profilePhoto field
- Validate: JPG/PNG only, max 5MB
```

---

#### **5. Identity Verification - Selfie**
**Currently Missing:**
```
❌ Selfie capture/upload
❌ Selfie verification status
```

**Need to add to HostVerification:**
```prisma
model HostVerification {
  // Existing...
  
  selfie           String?      // Selfie photo URL
  selfieVerified   Boolean      @default(false)
  selfieVerifiedAt DateTime?
}
```

**Need endpoint:**
```
POST /api/host-verification/upload-selfie
- Upload selfie to Cloudinary
- Save to database
```

---

### **Priority 2: Nice to Have**

#### **1. Host Dashboard**
**Frontend pages needed:**
```
✅ /dashboard/listings - Manage listings (exists)
⚠️ /dashboard/bookings - View bookings (needs work)
⚠️ /dashboard/earnings - View earnings (exists but incomplete)
⚠️ /dashboard/messages - View messages (exists but incomplete)
⚠️ /dashboard/profile - Edit profile (needs frontend)
⚠️ /dashboard/verification - Verification status (needs frontend)
⚠️ /dashboard/payout - Payout settings (needs frontend)
```

#### **2. Host Statistics**
```
⚠️ Response rate calculation
⚠️ Superhost badge logic
⚠️ Review/rating aggregation
```

---

## **IMPLEMENTATION PLAN**

### **Step 1: Update Database Schema** (5 mins)
```prisma
model HostProfile {
  // Add missing fields:
  country          String?
  city             String?
  sector           String?
  address          String?
  
  phoneNumber      String?
  phoneVerified    Boolean    @default(false)
  phoneVerifiedAt  DateTime?
  
  languages        String[]   @default([])
}

model HostVerification {
  // Add:
  selfie           String?
  selfieVerified   Boolean    @default(false)
  selfieVerifiedAt DateTime?
}
```

**Then run migration:**
```bash
npx prisma migrate dev --name add_host_requirements
```

---

### **Step 2: Create Address Endpoints** (15 mins)

```typescript
// HostProfileController.ts - Add new route:

@Put("/address")
@Security("jwt")
public async updateAddress(
  @Request() req: ExpressRequest,
  @Body() data: {
    country: string,
    city: string,
    sector?: string,
    address: string
  }
): Promise<IResponse<HostProfileResponse>> {
  const user = req.user as TUser;
  return HostProfileService.updateAddress(user.id, data);
}
```

---

### **Step 3: Create Phone Verification Endpoints** (20 mins)

```typescript
@Post("/verify-phone/send-otp")
@Security("jwt")
public async sendPhoneOtp(
  @Request() req: ExpressRequest,
  @Body() data: { phoneNumber: string }
): Promise<IResponse<{ message: string }>> {
  const user = req.user as TUser;
  return HostProfileService.sendPhoneOtp(user.id, data.phoneNumber);
}

@Post("/verify-phone/confirm-otp")
@Security("jwt")
public async confirmPhoneOtp(
  @Request() req: ExpressRequest,
  @Body() data: { otp: string }
): Promise<IResponse<{ verified: boolean }>> {
  const user = req.user as TUser;
  return HostProfileService.confirmPhoneOtp(user.id, data.otp);
}
```

---

### **Step 4: Create Languages Endpoint** (10 mins)

```typescript
@Put("/languages")
@Security("jwt")
public async updateLanguages(
  @Request() req: ExpressRequest,
  @Body() data: { languages: string[] }
): Promise<IResponse<HostProfileResponse>> {
  const user = req.user as TUser;
  return HostProfileService.updateLanguages(user.id, data.languages);
}
```

---

### **Step 5: Create Photo Upload Endpoint** (15 mins)

```typescript
@Post("/photo")
@Security("jwt")
@Middlewares(upload.single("photo"))
public async uploadProfilePhoto(
  @Request() req: ExpressRequest
): Promise<IResponse<{ photoUrl: string }>> {
  const user = req.user as TUser;
  return HostProfileService.uploadProfilePhoto(user.id, req);
}
```

---

### **Step 6: Create Selfie Verification Endpoint** (15 mins)

```typescript
@Post("/upload-selfie")
@Security("jwt")
@Middlewares(upload.single("selfie"))
public async uploadSelfie(
  @Request() req: ExpressRequest
): Promise<IResponse<{ message: string }>> {
  const user = req.user as TUser;
  return HostVerificationService.uploadSelfie(user.id, req);
}
```

---

### **Step 7: Update Frontend** (30 mins)

Create multi-step form for host onboarding:

```tsx
Step 1: Become Host
  - Button to upgrade role
  - Show confirmation

Step 2: Profile Information
  - Display name (from user)
  - Bio (textarea)
  - Profile photo (upload)
  - Years hosting (number)

Step 3: Address Information
  - Country (select)
  - City (text)
  - Sector (text)
  - Address (text)

Step 4: Contact Information
  - Phone number (text)
  - Verify with OTP (button)
  - Languages (multi-select)

Step 5: Identity Verification
  - Upload ID (file)
  - Select ID type (dropdown)
  - Upload selfie (camera/file)
  - Track verification status

Step 6: Payout Setup
  - Select payment method
  - Enter account details
  - Verify account

Step 7: Review & Complete
  - Show all filled information
  - Confirm and submit
  - Redirect to dashboard
```

---

## **ESTIMATED TIMELINE**

| Task | Time | Status |
|------|------|--------|
| Database schema update | 5 min | ⏳ Pending |
| Address endpoints | 15 min | ⏳ Pending |
| Phone verification | 20 min | ⏳ Pending |
| Languages endpoint | 10 min | ⏳ Pending |
| Photo upload | 15 min | ⏳ Pending |
| Selfie endpoint | 15 min | ⏳ Pending |
| Frontend forms | 30 min | ⏳ Pending |
| **TOTAL** | **~2 hours** | ⏳ Pending |

---

## **NEXT STEPS**

1. Do you want me to implement these missing features?
2. Should I prioritize MVP features first (address, phone)?
3. Any specific requirements for the verification process?

Let me know and I'll implement them! 🚀
