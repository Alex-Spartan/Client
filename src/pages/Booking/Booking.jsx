import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Bed,
  Star,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Link, useSearchParams } from "react-router-dom";
import { HotelService } from "@/lib/hotel-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DatePicker from "../Home/components/Date-Picker";
import { BookingService } from "@/lib/booking-service";
import Header from "@/components/Header";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "@/pages/Booking/Stripe-Payment-Form";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentService } from "@/lib/payment-service";

export default function Booking() {
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAppStore((s) => s.user);
  const checkIn = useAppStore((s) => s.checkIn);
  const checkOut = useAppStore((s) => s.checkOut);

  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");

  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
    checkInDate: checkIn ? new Date(checkIn) : new Date(),
    checkOutDate: checkOut
      ? new Date(checkOut)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const [errors, setErrors] = useState({});

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    if (hotelId) {
      loadHotelData();
    }
  }, [hotelId, roomId]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.fullName || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      checkInDate: checkIn ? new Date(checkIn) : new Date(),
      checkOutDate: checkOut
        ? new Date(checkOut)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }));
  }, [checkIn, checkOut]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      const hotelData = await HotelService.getHotels(hotelId);
      setHotel(hotelData);

      if (hotelData && roomId) {
        const room = hotelData.roomTypes?.find((r) => r._id === roomId);
        setSelectedRoom(room || null);
      }
    } catch (error) {
      console.error("Error loading hotel data:", error);
      toast.error("Failed to load hotel details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getNightsFromFormData = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const diffTime = Math.abs(
      formData.checkOutDate.getTime() - formData.checkInDate.getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    const nights = getNightsFromFormData();
    const roomPrice = selectedRoom.price * formData.rooms * nights;
    const taxes = roomPrice * 0.12; // 12% tax
    return {
      roomPrice,
      taxes,
      total: roomPrice + taxes,
      nights,
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.checkInDate >= formData.checkOutDate) {
      newErrors.checkInDate = "Check-in date must be before check-out date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPaymentIntent = async () => {
    if (!hotel || !selectedRoom) return;

    try {
      setSubmitting(true);
      const pricing = calculateTotalPrice();

      const response = await PaymentService({
        amount: pricing.total,
        currency: "inr",
        metadata: {
          userId: user?._id,
          hotelId: hotel._id,
          hotelName: hotel.title,
          roomId: selectedRoom._id,
          roomName: selectedRoom.name,
          rooms: formData.rooms.toString(),
          checkIn: formData.checkInDate.toISOString(),
          checkOut: formData.checkOutDate.toISOString(),
          guests: `${formData.adults} adults, ${formData.children} children`,
          customerEmail: formData.email,
          customerPhone: `${formData.phone}`,
        },
      });
      const { clientSecret, paymentIntentId } = response;
      setClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      setStep(2);

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("clientSecret", clientSecret);
        return params;
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error("Failed to create payment intent. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    if (!hotel || !selectedRoom || !user) return;

    try {
      setSubmitting(true);
      const pricing = calculateTotalPrice();
      const reference = `BK${Date.now()}`;

      const bookingPayload = {
        userId: user._id,
        hotelId: hotel._id,
        hotelName: hotel.title,
        roomId: selectedRoom._id,
        roomName: selectedRoom.name,
        rooms: formData.rooms,
        totalAmount: pricing.total,
        currency: "INR",
        status: "confirmed",
        paymentStatus: "paid",
        bookingReference: reference,
        checkInDate: formData.checkInDate.toISOString().split("T")[0],
        checkOutDate: formData.checkOutDate.toISOString().split("T")[0],
        guests: {
          adults: formData.adults,
          children: formData.children,
        },
        customerEmail: formData.email,
        customerPhone: formData.phone,
        specialRequests: formData.specialRequests,
      };
      const { message, error } = await BookingService.createBooking(
        bookingPayload
      );

      if (error) {
        toast.error(message || "Failed to confirm booking. Please try again.");
        return;
      }
      setBookingReference(reference);
      toast.success(message || "Booking confirmed successfully!");

      setStep(3);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to confirm booking. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentError = (error) => {
    toast.error("Payment failed. Please try again.");
    console.error("Payment error:", error);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!hotel || !selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Booking details not found. Please go back and select a room to
              book.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link href="/hotel">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pricing = calculateTotalPrice();

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your reservation at {hotel.title} has been successfully
                confirmed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Hotel:</strong> {hotel.title}
                  </p>
                  <p>
                    <strong>Room:</strong> {selectedRoom.name}
                  </p>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {formData.checkInDate.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Check-out:</strong>{" "}
                    {formData.checkOutDate.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Guests:</strong> {formData.adults} Adults,{" "}
                    {formData.children} Children
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{pricing.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard">View My Bookings</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/hotels">Book Another Hotel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/hotels/${hotelId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotel
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mb-8">
              <div
                className={`flex items-center ${
                  step >= 1 ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Booking Details</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div
                className={`flex items-center ${
                  step >= 2 ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div
                className={`flex items-center ${
                  step >= 3 ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 font-medium">Confirmation</span>
              </div>
            </div>

            {/* Hotel Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-24 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        hotel.photos[0] || "/placeholder.svg?height=80&width=96"
                      }
                      alt={hotel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{hotel.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{hotel.address}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {hotel.ratings}
                        </span>
                      </div>
                      <Badge variant="outline">{selectedRoom.name}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Form */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dates and Guests */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label className="text-base font-medium">
                        Check-in & Check-out Dates
                      </Label>
                      <div className="mt-2">
                        <DatePicker />
                      </div>
                      {errors.checkInDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.checkInDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        Guests & Rooms
                      </Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <Label htmlFor="adults" className="text-sm">
                            Adults
                          </Label>
                          <Select
                            value={formData.adults.toString()}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                adults: Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="children" className="text-sm">
                            Children
                          </Label>
                          <Select
                            value={formData.children.toString()}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                children: Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="rooms" className="text-sm">
                            Rooms
                          </Label>
                          <Select
                            value={formData.rooms.toString()}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                rooms: Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Guest Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Guest Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests">
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      placeholder="Any special requests or preferences..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => {
                      if (validateForm()) createPaymentIntent();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {step === 2 && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#059669",
                    },
                  },
                }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Secure Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StripePaymentForm
                      amount={pricing.total}
                      currency="INR"
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      loading={submitting}
                    />
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full"
                        disabled={submitting}
                      >
                        Back to Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Elements>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Details */}
                <div>
                  <h4 className="font-semibold">{selectedRoom.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Bed className="h-3 w-3" />
                      <span>{selectedRoom.bedType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>Max {selectedRoom.maxOccupancy} guests</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stay Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formData.checkInDate.toLocaleDateString()} -{" "}
                      {formData.checkOutDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3 w-3" />
                    <span>
                      {formData.adults} Adult{formData.adults > 1 ? "s" : ""}
                      {formData.children > 0 &&
                        `, ${formData.children} Child${
                          formData.children > 1 ? "ren" : ""
                        }`}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span>
                      {pricing.nights} night{pricing.nights > 1 ? "s" : ""}
                    </span>{" "}
                    × {formData.rooms} room
                    {formData.rooms > 1 ? "s" : ""}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Room price ({pricing.nights} nights)</span>
                    <span>₹{pricing.roomPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees</span>
                    <span>₹{pricing.taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-emerald-600">
                      ₹{pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{hotel.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>support@gotrip.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
