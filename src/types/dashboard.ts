export type UserRole = 'CLIENT' | 'HOST' | 'ADMIN' | 'AGENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roles?: string[];
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  createdAt?: string;
  status?: 'active' | 'suspended' | 'pending';
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  status: 'draft' | 'pending' | 'active' | 'inactive' | 'rejected';
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingPricing {
  id: string;
  listingId: string;
  basePrice: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  cleaningFee?: number;
  serviceFee?: number;
  taxRate?: number;
  seasonalPricing?: SeasonalPrice[];
}

export interface SeasonalPrice {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  priceMultiplier: number;
}

export interface Booking {
  id: string;
  listingId: string;
  listing?: Listing;
  guestId: string;
  guest?: User;
  hostId: string;
  host?: User;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxListings: number;
  commissionRate: number;
  priority: number;
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'booking' | 'subscription' | 'payout';
  paymentMethod?: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  hostId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethod?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  listingId: string;
  listing?: Listing;
  reviewerId: string;
  reviewer?: User;
  revieweeId: string;
  rating: number;
  comment: string;
  response?: string;
  type: 'guest_to_host' | 'host_to_guest' | 'listing';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  bookingId?: string;
  listingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalListings?: number;
  totalBookings?: number;
  totalRevenue?: number;
  pendingBookings?: number;
  activeListings?: number;
  totalUsers?: number;
  totalHosts?: number;
  totalGuests?: number;
  monthlyRevenue?: number;
  occupancyRate?: number;
  averageRating?: number;
  unreadMessages?: number;
}

export interface PlatformSettings {
  siteName: string;
  currency: string;
  defaultLanguage: string;
  serviceFeePercentage: number;
  hostFeePercentage: number;
  minBookingDays: number;
  maxBookingDays: number;
  allowInstantBooking: boolean;
  requireIdVerification: boolean;
  maintenanceMode: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}
