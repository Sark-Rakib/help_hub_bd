export type Role = "user" | "provider" | "admin";

export interface User {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  role: Role;
  avatar?: string;
  password?: string;
  phoneVerified: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<User, "password">;

export interface Category {
  slug: string;
  name: string;
  nameBn: string;
  description: string;
  popular: boolean;
}

export interface ProviderWorkHours {
  day: string;
  open: string;
  close: string;
}

export interface ProviderService {
  name: string;
  description?: string;
  price: number;
  priceType: "fixed" | "hourly" | "negotiable";
}

export interface Provider {
  _id: string;
  user: string | User;
  businessName: string;
  slug: string;
  category: string; // category slug
  description: string;
  about: string;
  services: ProviderService[];
  experience: number; // years
  location: Location;
  phone: string;
  whatsapp?: string;
  email?: string;
  workingHours: ProviderWorkHours[];
  photos: string[];
  avatar?: string;
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  startingPrice?: number;
  availability: "available" | "busy" | "offline";
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  district: string;
  area: string;
  address?: string;
}

export type RequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export interface ServiceRequest {
  _id: string;
  user: string | User;
  provider: string | Provider;
  service: string;
  description: string;
  location: Location;
  preferredDate: string;
  preferredTime?: string;
  budget?: number;
  phone: string;
  photos?: string[];
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: string | User;
  provider: string;
  serviceRequest?: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  provider: string;
  createdAt: string;
}

export type NotificationType =
  | "new_request"
  | "request_accepted"
  | "request_rejected"
  | "request_completed"
  | "new_review"
  | "provider_verified"
  | "admin_announcement";

export interface AppNotification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export type ReportTargetType = "user" | "provider" | "review";

export interface Report {
  _id: string;
  reporter: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

export interface ProviderQuery {
  search?: string;
  category?: string;
  location?: string;
  area?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  availableOnly?: boolean;
  sort?: "recommended" | "rating" | "reviews" | "price" | "nearest";
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewInput {
  rating: number;
  text: string;
  serviceRequestId?: string;
}

export interface ServiceRequestInput {
  providerId: string;
  service: string;
  description: string;
  location: Location;
  preferredDate: string;
  preferredTime?: string;
  budget?: number;
  phone: string;
  photos?: string[];
  emergency?: boolean;
}