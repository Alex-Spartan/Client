import axios from "axios";

export class WishlistService {
  static async getWishlist(userId) {
    try {
      const response = await axios.get(`/wishlist/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  }

  static async addToWishlist(wishlistData) {
    try {
      const response = await axios.post("/wishlist", wishlistData);
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return null;
    }
  }

  static async removeFromWishlist(id) {
    try {
      const response = await axios.delete(`/wishlist/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return null;
    }
  }
}