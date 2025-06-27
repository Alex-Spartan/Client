/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { PaymentElement, useStripe, useElements, AddressElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield, Lock } from "lucide-react"
import { useSearchParams } from "react-router-dom"


export function StripePaymentForm({ amount, onSuccess, onError, loading = false }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState(null)
  const [searchParams] = useSearchParams();


  useEffect(() => {
    if (!stripe) return

    const clientSecret = searchParams.get("clientSecret")

    if (!clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements, 
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
      redirect: "if_required",
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred")
        onError(error.message || "Payment failed")
      } else {
        console.error(error)
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!")
      onSuccess(paymentIntent.id)
    }

    setIsProcessing(false)
  }

  const paymentElementOptions = {
    layout: "tabs",
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="flex items-center gap-2">
          <Lock className="h-3 w-3" />
          Your payment information is secure and encrypted with 256-bit SSL
        </AlertDescription>
      </Alert>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement options={paymentElementOptions} />
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressElement
            options={{
              mode: "billing",
              allowedCountries: ["US", "CA", "GB", "AU", "IN"],
            }}
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-emerald-600">
              ₹{amount.toFixed(2)} INR
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {message && (
        <Alert variant={message.includes("succeeded") ? "default" : "destructive"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements || loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay ₹{amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Payment Methods Accepted */}
      <div className="text-center text-sm text-muted-foreground">
        <p className="mb-2">We accept:</p>
        <div className="flex justify-center items-center gap-2">
          <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">VISA</div>
          <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">MASTERCARD</div>
          <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">AMEX</div>
          <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">DISCOVER</div>
        </div>
      </div>
    </form>
  )
}
