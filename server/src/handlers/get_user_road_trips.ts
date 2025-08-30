import { type RoadTrip } from '../schema';

export async function getUserRoadTrips(userId: number): Promise<RoadTrip[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is:
    // 1. Fetch all road trips belonging to the authenticated user
    // 2. Order by created_at or start_date for consistent listing
    // 3. Return array of road trips (without stops for performance)
    
    return Promise.resolve([]);
}