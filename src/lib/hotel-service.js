import axios from "axios";

export class HotelService {
    static async getHotels() {
        try {
            const response = await axios.get("/places/accomodation");
            return response.data;
        } catch (error) {
            console.error("Error getting hotels:", error)
            return []
        }
    }
}