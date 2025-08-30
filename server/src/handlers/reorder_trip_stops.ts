import { type TripStop } from '../schema';

export interface ReorderStopsInput {
    road_trip_id: number;
    stop_orders: { stop_id: number; new_order: number }[];
}

export async function reorderTripStops(input: ReorderStopsInput, userId: number): Promise<TripStop[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is:
    // 1. Validate that the authenticated user owns this road trip
    // 2. Validate that all stop_ids belong to the specified road trip
    // 3. Update the stop_order for each specified stop in database
    // 4. Return all stops for the trip in the new order
    // 5. Throw error if validation fails or stops don't exist
    
    return Promise.resolve([]);
}