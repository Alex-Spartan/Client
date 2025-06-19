import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      // Auth state
      user: null,
      ready: false,

      // Booking state
      price: 0,
      rooms: 1,
      checkIn: "",
      checkOut: "",

      setUser: (user) => set({ user }),
      setReady: (ready) => set({ ready }),
      setPrice: (price) => set({ price }),
      setRooms: (count) => set({ rooms: count }),
      setCheckIn: (date) => set({ checkIn: date }),
      setCheckOut: (date) => set({ checkOut: date }),
    }),
    {
      name: "app-storage", // key in localStorage
      partialize: (state) => ({
        user: state.user,
        ready: state.ready,
        price: state.price,
        rooms: state.rooms,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
      }),
    }
  )
);