import axios from "axios";

export class RoomService {
    static async getRooms(id=null) {
        try {
            if (id) {
                const response = await axios.get(`places/rooms/${id}`);
                return response.data;
            } else {
                const response = await axios.get("places/rooms");
                return response.data;
            }
        } catch (error) {
            console.error("Error getting rooms:", error);
            return [];
        }
    }

    static async postRooms(id=null, rooms) {
        try {
            if (id) {
                const response = await axios.post(`places/rooms/${id}`, { rooms });
                return response.data;
            } else {
                const response = await axios.post("places/rooms", { rooms });
                return response.data;
            }
        } catch (error) {
            console.error("Error posting rooms:", error);
            throw error; // Re-throw to handle in component
        }
    }
}