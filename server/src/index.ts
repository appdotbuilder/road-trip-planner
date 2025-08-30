import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  loginInputSchema,
  createRoadTripInputSchema,
  updateRoadTripInputSchema,
  createTripStopInputSchema,
  updateTripStopInputSchema,
  uploadImageInputSchema,
  exportToPdfInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { loginUser } from './handlers/login_user';
import { createRoadTrip } from './handlers/create_road_trip';
import { getUserRoadTrips } from './handlers/get_user_road_trips';
import { getRoadTripWithStops } from './handlers/get_road_trip_with_stops';
import { updateRoadTrip } from './handlers/update_road_trip';
import { deleteRoadTrip } from './handlers/delete_road_trip';
import { createTripStop } from './handlers/create_trip_stop';
import { updateTripStop } from './handlers/update_trip_stop';
import { deleteTripStop } from './handlers/delete_trip_stop';
import { uploadImage } from './handlers/upload_image';
import { fetchGoogleMapsPhoto } from './handlers/fetch_google_maps_photo';
import { exportToPdf } from './handlers/export_to_pdf';
import { reorderTripStops, type ReorderStopsInput } from './handlers/reorder_trip_stops';

// Initialize tRPC
const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

// Context type (will need JWT authentication middleware)
interface Context {
  userId?: number; // Set by auth middleware
}

// Auth procedures (for authenticated routes)
const authProcedure = publicProcedure.use(({ ctx, next }) => {
  // This is a placeholder! Real implementation should:
  // 1. Extract JWT token from Authorization header
  // 2. Verify and decode the token
  // 3. Add userId to context
  // 4. Throw error if token is invalid/expired
  const userId = 1; // Placeholder - extract from JWT
  return next({
    ctx: { ...ctx, userId }
  });
});

// Define the app router with all routes
const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    register: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => createUser(input)),
    
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => loginUser(input)),
  }),

  // Road trip management routes
  roadTrips: router({
    create: authProcedure
      .input(createRoadTripInputSchema)
      .mutation(({ input, ctx }) => createRoadTrip(input, ctx.userId!)),
    
    list: authProcedure
      .query(({ ctx }) => getUserRoadTrips(ctx.userId!)),
    
    get: authProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input, ctx }) => getRoadTripWithStops(input.id, ctx.userId!)),
    
    update: authProcedure
      .input(updateRoadTripInputSchema)
      .mutation(({ input, ctx }) => updateRoadTrip(input, ctx.userId!)),
    
    delete: authProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => deleteRoadTrip(input.id, ctx.userId!)),
  }),

  // Trip stops management routes
  tripStops: router({
    create: authProcedure
      .input(createTripStopInputSchema)
      .mutation(({ input, ctx }) => createTripStop(input, ctx.userId!)),
    
    update: authProcedure
      .input(updateTripStopInputSchema)
      .mutation(({ input, ctx }) => updateTripStop(input, ctx.userId!)),
    
    delete: authProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => deleteTripStop(input.id, ctx.userId!)),
    
    reorder: authProcedure
      .input(z.object({
        road_trip_id: z.number(),
        stop_orders: z.array(z.object({
          stop_id: z.number(),
          new_order: z.number()
        }))
      }))
      .mutation(({ input, ctx }) => reorderTripStops(input as ReorderStopsInput, ctx.userId!)),
  }),

  // Image management routes
  images: router({
    upload: authProcedure
      .input(uploadImageInputSchema)
      .mutation(({ input, ctx }) => uploadImage(input, ctx.userId!)),
    
    fetchFromGoogleMaps: authProcedure
      .input(z.object({ 
        place_id: z.string(), 
        trip_stop_id: z.number() 
      }))
      .mutation(({ input, ctx }) => 
        fetchGoogleMapsPhoto(input.place_id, input.trip_stop_id, ctx.userId!)
      ),
  }),

  // Export routes
  export: router({
    toPdf: authProcedure
      .input(exportToPdfInputSchema)
      .mutation(({ input, ctx }) => exportToPdf(input, ctx.userId!)),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext(): Context {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`Road Trip Planner TRPC server listening at port: ${port}`);
  console.log('Available routes:');
  console.log('- POST /auth.register - Create user account');
  console.log('- POST /auth.login - User login');
  console.log('- GET /roadTrips.list - Get user road trips');
  console.log('- POST /roadTrips.create - Create road trip');
  console.log('- GET /roadTrips.get - Get road trip with stops');
  console.log('- POST /roadTrips.update - Update road trip');
  console.log('- POST /roadTrips.delete - Delete road trip');
  console.log('- POST /tripStops.create - Add trip stop');
  console.log('- POST /tripStops.update - Update trip stop');
  console.log('- POST /tripStops.delete - Delete trip stop');
  console.log('- POST /tripStops.reorder - Reorder stops');
  console.log('- POST /images.upload - Upload image');
  console.log('- POST /images.fetchFromGoogleMaps - Fetch Google Maps photo');
  console.log('- POST /export.toPdf - Export trip to PDF');
}

start();