import { serial, text, pgTable, timestamp, integer, numeric, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// Road trips table
export const roadTripsTable = pgTable('road_trips', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  start_date: timestamp('start_date', { mode: 'date' }).notNull(),
  end_date: timestamp('end_date', { mode: 'date' }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('road_trips_user_id_idx').on(table.user_id),
}));

// Trip stops table
export const tripStopsTable = pgTable('trip_stops', {
  id: serial('id').primaryKey(),
  road_trip_id: integer('road_trip_id').notNull().references(() => roadTripsTable.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  google_maps_place_id: text('google_maps_place_id'), // Nullable
  google_maps_url: text('google_maps_url'), // Nullable
  latitude: numeric('latitude', { precision: 10, scale: 8 }), // Nullable - high precision for coordinates
  longitude: numeric('longitude', { precision: 11, scale: 8 }), // Nullable - high precision for coordinates
  address: text('address'), // Nullable
  picture_url: text('picture_url'), // Nullable - URL to stored image
  picture_filename: varchar('picture_filename', { length: 255 }), // Nullable - original filename
  notes: text('notes'), // Nullable
  stop_order: integer('stop_order').notNull(), // Order of stops in the trip
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  roadTripIdIdx: index('trip_stops_road_trip_id_idx').on(table.road_trip_id),
  stopOrderIdx: index('trip_stops_order_idx').on(table.road_trip_id, table.stop_order),
}));

// Define relationships
export const usersRelations = relations(usersTable, ({ many }) => ({
  roadTrips: many(roadTripsTable),
}));

export const roadTripsRelations = relations(roadTripsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [roadTripsTable.user_id],
    references: [usersTable.id],
  }),
  stops: many(tripStopsTable),
}));

export const tripStopsRelations = relations(tripStopsTable, ({ one }) => ({
  roadTrip: one(roadTripsTable, {
    fields: [tripStopsTable.road_trip_id],
    references: [roadTripsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type RoadTrip = typeof roadTripsTable.$inferSelect;
export type NewRoadTrip = typeof roadTripsTable.$inferInsert;

export type TripStop = typeof tripStopsTable.$inferSelect;
export type NewTripStop = typeof tripStopsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  users: usersTable, 
  roadTrips: roadTripsTable, 
  tripStops: tripStopsTable 
};