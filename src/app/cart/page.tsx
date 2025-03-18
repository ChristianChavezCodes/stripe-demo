"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/ui/NavigationBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { products } from "@/lib/mock-data/products";
import type { CartItem, CartProduct } from "@/types/cart/cart";
import type { Product } from "@/types/home/home";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        let parsedCart = JSON.parse(storedCart);
        if (
          Array.isArray(parsedCart) &&
          parsedCart.length > 0 &&
          typeof parsedCart[0] === "number"
        ) {
          parsedCart = parsedCart.map((id: number) => ({ id, quantity: 1 }));
        }
        setCartItems(parsedCart);
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartProducts: CartProduct[] = cartItems
    .map((item) => {
      const product = products.find((p: Product) => p.id === item.id);
      if (product) {
        return { ...product, quantity: item.quantity };
      }
      return null;
    })
    .filter((p): p is CartProduct => Boolean(p));

  const total = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar cartItemCount={cartItemCount} cartItems={cartProducts} />

      <main className="flex-1 flex flex-col">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Cart</h1>
          <Link
            href="/"
            className="text-sm text-primary hover:text-secondary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="container max-w-6xl mx-auto px-4 pb-6 flex-1 flex flex-col">
          {cartItems.length === 0 ? (
            <Card className="p-8 text-center flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="text-gray-500 mb-4">
                  Looks like you haven&apos;t added any items to your cart yet.
                  Browse our sustainable collection and find something
                  you&apos;ll love.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/">Shop Now</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
              <div className="lg:col-span-2 flex flex-col max-[500px]:h-[95vh]">
                <Card className="flex flex-col h-full">
                  <div className="p-6 bg-gradient-to-r from-primary/90 to-secondary/90 text-white flex-shrink-0">
                    <h2 className="font-semibold">
                      Cart Items ({cartItemCount})
                    </h2>
                  </div>

                  <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    <div className="divide-y">
                      {cartProducts.map((item) => (
                        <div key={item.id} className="p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 max-[639px]:w-24 max-[639px]:h-24 max-[500px]:w-16 max-[500px]:h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    {item.categories[0]}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Color: {item.colors[0]}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    ${item.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Subtotal: $
                                    {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-4 py-2 text-center min-w-[40px]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t flex-shrink-0">
                    <button
                      onClick={clearCart}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Clear cart
                    </button>
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
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Order total</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                    >
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      We offer carbon-neutral shipping and use recycled
                      packaging materials.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
