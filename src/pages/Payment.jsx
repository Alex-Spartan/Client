import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

const Payment = () => {
  const { bookingStatus } = useParams();
  const navigate = useNavigate();
  if (bookingStatus === "success") {
    setTimeout(() => {
      navigate("/account/bookings");
    }, 3000);
  }
  return (
    <div>
      <Header />
      <div className="w-screen h-screen flex items-center justify-center text-2xl font-semibold">
        You paid was a {bookingStatus}. Now go back to your storeroom!
      </div>
    </div>
  );
};

export default Payment;
