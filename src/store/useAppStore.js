// store/useAppStore.js
import { create } from "zustand";

export const useAppStore = create((set) => ({
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

}));
