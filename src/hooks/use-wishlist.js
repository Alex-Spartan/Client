"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import { WishlistService } from "@/lib/wishlist-service";

export function useWishlist() {
  const user = useAppStore(s => s.auth);
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setWishlist([])
      setLoading(false)
    }
  }, [user])

  const loadWishlist = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const userWishlist = await WishlistService.getUserWishlist(user.uid)
      setWishlist(userWishlist)
    } catch (err) {
      setError("Failed to load wishlist")
      console.error("Error loading wishlist:", err)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (hotelData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      setError(null)
      const wishlistId = await WishlistService.addToWishlist({
        ...hotelData,
        userId: user.uid,
      })
      await loadWishlist() // Reload wishlist after addition
      return wishlistId
    } catch (err) {
      setError("Failed to add to wishlist")
      console.error("Error adding to wishlist:", err)
      throw err
    }
  }

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      setError(null)
      await WishlistService.removeFromWishlist(wishlistItemId)
      await loadWishlist() // Reload wishlist after removal
    } catch (err) {
      setError("Failed to remove from wishlist")
      console.error("Error removing from wishlist:", err)
      throw err
    }
  }

  const isInWishlist = async (hotelId) => {
    if (!user) return false

    try {
      return await WishlistService.isInWishlist(user.uid, hotelId)
    } catch (err) {
      console.error("Error checking wishlist:", err)
      return false
    }
  }

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: loadWishlist,
  }
}
