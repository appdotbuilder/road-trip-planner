import { z } from 'zod';

// User authentication schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// User registration input
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// User login input
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Road trip schemas
export const roadTripSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type RoadTrip = z.infer<typeof roadTripSchema>;

// Road trip input for creation
export const createRoadTripInputSchema = z.object({
  name: z.string().min(1),
  start_date: z.string().date(), // ISO date string input
  end_date: z.string().date()
}).refine(data => new Date(data.start_date) <= new Date(data.end_date), {
  message: "End date must be after start date",
  path: ["end_date"]
});

export type CreateRoadTripInput = z.infer<typeof createRoadTripInputSchema>;

// Road trip update input
export const updateRoadTripInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  start_date: z.string().date().optional(),
  end_date: z.string().date().optional()
}).refine(data => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) <= new Date(data.end_date);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"]
});

export type UpdateRoadTripInput = z.infer<typeof updateRoadTripInputSchema>;

// Trip stop schemas
export const tripStopSchema = z.object({
  id: z.number(),
  road_trip_id: z.number(),
  name: z.string(),
  google_maps_place_id: z.string().nullable(),
  google_maps_url: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  picture_url: z.string().nullable(),
  picture_filename: z.string().nullable(),
  notes: z.string().nullable(),
  stop_order: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type TripStop = z.infer<typeof tripStopSchema>;

// Trip stop input for creation
export const createTripStopInputSchema = z.object({
  road_trip_id: z.number(),
  name: z.string().min(1),
  google_maps_place_id: z.string().nullable().optional(),
  google_maps_url: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
  picture_url: z.string().nullable().optional(),
  picture_filename: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  stop_order: z.number().int()
});

export type CreateTripStopInput = z.infer<typeof createTripStopInputSchema>;

// Trip stop update input
export const updateTripStopInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  google_maps_place_id: z.string().nullable().optional(),
  google_maps_url: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
  picture_url: z.string().nullable().optional(),
  picture_filename: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  stop_order: z.number().int().optional()
});

export type UpdateTripStopInput = z.infer<typeof updateTripStopInputSchema>;

// File upload schema
export const uploadImageInputSchema = z.object({
  trip_stop_id: z.number(),
  filename: z.string(),
  file_data: z.string() // Base64 encoded file data
});

export type UploadImageInput = z.infer<typeof uploadImageInputSchema>;

// PDF export input
export const exportToPdfInputSchema = z.object({
  road_trip_id: z.number()
});

export type ExportToPdfInput = z.infer<typeof exportToPdfInputSchema>;

// Response schemas
export const authResponseSchema = z.object({
  user: userSchema.omit({ password_hash: true }),
  token: z.string()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const roadTripWithStopsSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  stops: z.array(tripStopSchema)
});

export type RoadTripWithStops = z.infer<typeof roadTripWithStopsSchema>;