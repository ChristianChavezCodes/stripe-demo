"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/NavigationBar";
import ProductList from "@/components/home/ProductList";
import { products } from "@/lib/mock-data/products";
import type { Product } from "@/types/home/home";
import type { CartItem } from "@/types/cart/cart";

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === "object") {
            setCartItems(parsed);
          } else if (typeof parsed[0] === "number") {
            setCartItems(parsed.map((id: number) => ({ id, quantity: 1 })));
          }
        }
      } catch (e) {
        console.error("Error parsing stored cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (productId: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        return prev.filter((item) => item.id !== productId);
      } else {
        return [...prev, { id: productId, quantity: 1 }];
      }
    });
  };

  const cartProducts = products
    .map((product) => {
      const cartItem = cartItems.find((item) => item.id === product.id);
      if (cartItem) {
        return { ...product, quantity: cartItem.quantity };
      }
      return null;
    })
    .filter((p): p is Product & { quantity: number } => Boolean(p));

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <Navbar cartItemCount={cartItemCount} cartItems={cartProducts} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <section className="w-full py-6 bg-gradient-to-r from-primary/15 to-secondary/15 flex-shrink-0 relative">
          <div className="absolute inset-0 opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="space-y-1 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                  Sustainable Style, Ethical Comfort
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 text-sm md:text-base">
                  Discover our collection of high-quality, ethically-sourced
                  apparel made with care for people and planet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 flex-1 overflow-hidden flex flex-col bg-white rounded-t-3xl -mt-4 shadow-sm relative z-10">
          <div className="overflow-y-auto flex-1 pb-4 px-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div className="pt-6 pb-6">
              <ProductList
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
