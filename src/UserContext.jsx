import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [price, setPrice] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [rooms, setRooms] = useState(1);
    const [datefns, setDatefns] = useState(false);
    
    useEffect( () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      else {
        axios.get("/auth/profile").then(({data}) => {
          setUser(data);
          setReady(true);
        });
      }
    }, [])
  return (
    <UserContext.Provider value={{ user, setUser, ready, setReady, price, setPrice, checkIn, setCheckIn, checkOut, setCheckOut, rooms, setRooms, datefns, setDatefns }}>
        { children }
    </UserContext.Provider>
  );
}
