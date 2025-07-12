import axios from "axios";

export class HotelService {
    static async getHotels(id=null) {
        try {
            if (id) {
                const response = await axios.get(`/api/places/${id}`);
                return response.data;
            } else {
                const response = await axios.get("/api/places");
                console.log(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching hotels:", error);
            return [];
        }
    }
    static async createHotel(hotelData) {
        try {
            const response = await axios.post("/api/places", hotelData);
            return response.data;
        } catch (error) {
            console.error("Error creating hotel:", error);
            return null;
        }
    }
    static async updateHotel(id, hotelData) {
        try {
            const response = await axios.put(`/api/places/${id}`, hotelData);
            return response.data;
        } catch (error) {
            console.error("Error updating hotel:", error);
            return null;
        }
    }
}