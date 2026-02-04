import { api } from "./api";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export interface Booking {
  _id?: string;
  id?: string;
  userId?: string;
  salonId?: string;
  serviceId?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Populated fields
  salon?: any;
  service?: any;
  user?: any;
}

export interface CreateBookingRequest {
  salonId: string;
  serviceId: string;
  bookingDate: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM
  notes?: string;
}

export interface RescheduleBookingRequest {
  newBookingDate: string; // Format: YYYY-MM-DD
  newStartTime: string; // Format: HH:MM
}

/**
 * Create a new booking
 * @param bookingData - Booking details
 * @returns Created booking object
 */
export const createBooking = async (
  bookingData: CreateBookingRequest,
): Promise<Booking> => {
  try {
    const response = await api.post("/api/booking", bookingData);
    console.log("📅 Booking created:", response.data);

    return response.data.booking || response.data;
  } catch (error: any) {
    console.error(
      "❌ Error creating booking:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get customer's booking history
 * @returns Array of bookings
 */
export const getCustomerBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get("/api/booking/customer/history");
    console.log("📋 Customer bookings:", response.data);

    const bookings = response.data.bookings || response.data.data || [];
    return Array.isArray(bookings) ? bookings : [];
  } catch (error: any) {
    console.error("❌ Error fetching bookings:", error.message);
    return [];
  }
};

/**
 * Get booking details by ID
 * @param bookingId - Booking ID
 * @returns Booking details
 */
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await api.get(`/api/booking/${bookingId}`);
    console.log("📅 Booking details:", response.data);

    return response.data.booking || response.data;
  } catch (error: any) {
    console.error("❌ Error fetching booking:", error.message);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param bookingId - Booking ID to cancel
 * @returns Updated booking
 */
export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await api.put(`/api/booking/${bookingId}/cancel`);
    console.log("❌ Booking cancelled:", response.data);

    return response.data.booking || response.data;
  } catch (error: any) {
    console.error("❌ Error cancelling booking:", error.message);
    throw error;
  }
};

/**
 * Reschedule a booking
 * @param bookingId - Booking ID to reschedule
 * @param rescheduleData - New date and time
 * @returns Updated booking
 */
export const rescheduleBooking = async (
  bookingId: string,
  rescheduleData: RescheduleBookingRequest,
): Promise<Booking> => {
  try {
    const response = await api.put(
      `/api/booking/${bookingId}/reschedule`,
      rescheduleData,
    );
    console.log("📅 Booking rescheduled:", response.data);

    return response.data.booking || response.data;
  } catch (error: any) {
    console.error("❌ Error rescheduling booking:", error.message);
    throw error;
  }
};

/**
 * Approve a booking (Salon owner only)
 * @param bookingId - Booking ID to approve
 * @returns Updated booking
 */
export const approveBooking = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await api.put(`/api/booking/${bookingId}/approve`);
    console.log("✅ Booking approved:", response.data);

    return response.data.booking || response.data;
  } catch (error: any) {
    console.error("❌ Error approving booking:", error.message);
    throw error;
  }
};

/**
 * Reject a booking (Salon owner only)
 * @param bookingId - Booking ID to reject
 * @param rejectionReason - Optional reason for rejection
 * @returns Updated booking
 */
export const rejectBooking = async (
  bookingId: string,
  rejectionReason?: string,
): Promise<Booking> => {
  try {
    const response = await api.put(`/api/booking/${bookingId}/reject`, {
      rejectionReason: rejectionReason || "No reason provided",
    });
    console.log("❌ Booking rejected:", response.data);

    return response.data.booking || response.data;
  } catch (error: any) {
    console.error("❌ Error rejecting booking:", error.message);
    throw error;
  }
};

/**
 * Get salon bookings (Salon owner only)
 * @param salonId - Salon ID
 * @returns Array of bookings for the salon
 */
export const getSalonBookings = async (salonId: string): Promise<Booking[]> => {
  try {
    const response = await api.get(`/api/booking/salon/${salonId}/bookings`);
    console.log("📋 Salon bookings:", response.data);

    const bookings = response.data.bookings || response.data.data || [];
    return Array.isArray(bookings) ? bookings : [];
  } catch (error: any) {
    console.error("❌ Error fetching salon bookings:", error.message);
    return [];
  }
};
