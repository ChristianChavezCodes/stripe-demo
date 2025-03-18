"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";

interface PaymentFormProps {
  onPaymentSuccess: () => void;
  setErrorMessage: (msg: string) => void;
}

export default function PaymentForm({
  onPaymentSuccess,
  setErrorMessage,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setLocalError("");
    setErrorMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/complete",
      },
      redirect: "if_required",
    });

    if (error) {
      setLocalError(error.message || "An unexpected error occurred.");
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    } else {
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 text-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Cozy Threads
        </span>
      </div>

      <PaymentElement />
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 mt-4"
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <>Pay</>
        )}
      </Button>
      {localError && (
        <div className="mt-2 text-sm text-red-600">{localError}</div>
      )}
    </form>
  );
}
