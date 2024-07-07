import React from "react";
import { useParams } from "react-router-dom";

const Payment = () => {
  const { bookingStatus } = useParams();
  return (
    <div className="w-screen h-screen flex items-center justify-center text-2xl font-semibold">
      You paid was a {bookingStatus}. Now go back to your storeroom!
    </div>
  );
};

export default Payment;
