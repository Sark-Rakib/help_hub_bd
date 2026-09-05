import { z } from "zod";

export const PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short — at least 2 letters")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Enter a valid Bangladesh phone number (01XXXXXXXXX)")
    .refine((val) => !val.startsWith("880") || val.length >= 14, "Enter a valid phone number"),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.length > 0, "Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "provider"]).default("user"),
  avatar: z.string().url("Enter a valid photo").optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short — at least 2 letters")
    .max(80, "Name is too long")
    .optional(),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  avatar: z.string().url("Enter a valid photo").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Enter a valid Bangladesh phone number (01XXXXXXXXX)")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, "Enter your phone or email"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;

const workingHoursSchema = z
  .array(
    z.object({
      day: z.string().min(1),
      open: z.string().min(1),
      close: z.string().min(1),
    })
  )
  .max(7);

export const becomeProviderSchema = z.object({
  businessName: z
    .string()
    .min(2, "Enter your business name")
    .max(120, "Name is too long"),
  category: z.string().min(1, "Select a service category"),
  description: z
    .string()
    .min(10, "Add a bit more description")
    .max(1000, "Description is too long"),
  phone: z.string().regex(PHONE_REGEX, "Enter a valid Bangladesh phone number"),
  whatsapp: z.string().regex(PHONE_REGEX, "Enter a valid phone number").optional().or(z.literal("")),
  area: z.string().min(1, "Select your area"),
  address: z
    .string()
    .max(300, "Address is too long")
    .optional()
    .or(z.literal("")),
  experience: z
    .coerce
    .number()
    .min(0, "Experience must be between 0 and 60 years")
    .max(60, "Experience must be between 0 and 60 years"),
  startingPrice: z
    .coerce
    .number()
    .min(0, "Rate must be 0 or more")
    .max(10_000_000, "Rate is too high")
    .optional(),
  workingHours: workingHoursSchema.optional(),
});

export type BecomeProviderInput = z.infer<typeof becomeProviderSchema>;

export const serviceRequestSchema = z.object({
  service: z.string().min(1, "What service do you need? Please select one"),
  description: z
    .string()
    .min(10, "Please describe the problem in a bit more detail (at least 10 characters)")
    .max(2000, "Description is too long"),
  area: z.string().min(1, "Please select your area"),
  address: z.string().max(300, "Address is too long").optional().or(z.literal("")),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().optional().or(z.literal("")),
  budget: z
    .union([z.string(), z.number()])
    .optional()
    .or(z.literal("")),
  phone: z.string().regex(PHONE_REGEX, "Enter a valid Bangladesh phone number"),
  emergency: z.boolean().default(false),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating (1-5)").max(5),
  text: z
    .string()
    .min(3, "Write a bit more to your review")
    .max(1000, "Review is too long"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Enter a category name").max(80),
  nameBn: z.string().max(80).optional().or(z.literal("")),
  slug: z.string().min(1, "Enter a slug (e.g. electrician)").max(80),
  description: z.string().max(300).optional().or(z.literal("")),
  icon: z.string().max(50).optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const providerSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  area: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  verifiedOnly: z.enum(["true", "false"]).optional(),
  availableOnly: z.enum(["true", "false"]).optional(),
  sort: z
    .enum(["recommended", "rating", "reviews", "price", "nearest"])
    .default("recommended"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ProviderSearchInput = z.infer<typeof providerSearchSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Enter your name").max(80).optional(),
  phone: z.string().regex(PHONE_REGEX, "Enter a valid phone number").optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  avatar: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const providerUpdateSchema = z.object({
  businessName: z.string().min(2).max(120).optional(),
  description: z.string().min(10).max(1000).optional(),
  about: z.string().max(3000).optional().or(z.literal("")),
  experience: z.coerce.number().min(0).max(60).optional(),
  area: z.string().optional(),
  address: z.string().max(300).optional().or(z.literal("")),
  phone: z.string().regex(PHONE_REGEX).optional(),
  whatsapp: z.string().regex(PHONE_REGEX).optional().or(z.literal("")),
  availability: z.enum(["available", "busy", "offline"]).optional(),
  startingPrice: z.coerce.number().min(0).optional(),
  avatar: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  photos: z.array(z.string().url("Enter a valid image URL")).max(6).optional(),
  services: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z.string().min(2).max(120),
        description: z.string().max(500).optional().or(z.literal("")),
        price: z.coerce.number().min(0),
        priceType: z.enum(["fixed", "hourly", "negotiable"]).default("fixed"),
      })
    )
    .max(30)
    .optional(),
  workingHours: workingHoursSchema.optional(),
});

export type ProviderUpdateInput = z.infer<typeof providerUpdateSchema>;

export const reportSchema = z.object({
  targetType: z.enum(["user", "provider", "review"]),
  targetId: z.string().min(1),
  reason: z.string().min(5, "Please write a bit more for the reason").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportSchema>;