import axios from "axios";

export class BookingService {
  static async getBookings(userId) {
    try {
      const response = await axios.get(`/bookings/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  }

  static async createBooking(bookingData) {
    try {
      const response = await axios.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      return null;
    }
  }

  static async updateBooking(id, bookingData) {
    try {
      const response = await axios.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      return null;
    }
  }
    static async deleteBooking(id) {
        try {
        const response = await axios.delete(`/bookings/${id}`);
        return response.data;
        } catch (error) {
        console.error("Error deleting booking:", error);
        return null;
        }
    }
}