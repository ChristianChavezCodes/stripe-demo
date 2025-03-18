"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/NavigationBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { products } from "@/lib/mock-data/products";
import PaymentForm from "@/components/checkout/PaymentForm";
import type { CartItem, CartProduct } from "@/types/cart/cart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && cartItems.length === 0 && !paymentSuccess) {
      router.push("/cart");
    }
  }, [loading, cartItems, paymentSuccess, router]);

  const cartProducts: CartProduct[] = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        return { ...product, quantity: item.quantity };
      }
      return null;
    })
    .filter((p): p is CartProduct => Boolean(p));

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  useEffect(() => {
    if (total > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "usd" }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error fetching client secret:", error);
        });
    }
  }, [total]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
        <Navbar cartItemCount={0} cartItems={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2.5"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      <Navbar
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        cartItems={cartProducts}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4 py-6 flex-shrink-0">
          {!paymentSuccess && (
            <Link
              href="/cart"
              className="text-sm text-primary hover:text-secondary transition-colors inline-flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Cart</span>
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            {paymentSuccess ? "Order Complete" : "Secure Checkout"}
          </h1>
        </div>

        <div className="container max-w-6xl mx-auto px-4 pb-6 flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
            <div className="lg:col-span-2 flex flex-col overflow-hidden">
              <Card className="flex flex-col h-full overflow-hidden">
                <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {paymentSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        Payment Successful!
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Thank you for your purchase. We&apos;ve sent a
                        confirmation email with your order details.
                      </p>
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Link href="/">Continue Shopping</Link>
                      </Button>
                    </div>
                  ) : clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: { theme: "flat" } }}
                    >
                      <PaymentForm
                        onPaymentSuccess={handlePaymentSuccess}
                        setErrorMessage={() => {}}
                      />
                    </Elements>
                  ) : (
                    <div>Loading payment details...</div>
                  )}
                </div>
              </Card>
            </div>
            <div className="lg:col-span-1 flex flex-col">
              <Card className="h-auto">
                <div className="p-6 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
                  <h2 className="font-semibold">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    We offer carbon-neutral shipping and use recycled packaging
                    materials.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
