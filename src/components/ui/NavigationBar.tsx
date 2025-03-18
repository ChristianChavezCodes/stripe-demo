"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import type { NavbarProps } from "@/types/ui/navbar";

export function Navbar({ cartItemCount = 0, cartItems = [] }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const cartPreviewRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartPreviewRef.current &&
        !cartPreviewRef.current.contains(event.target as Node) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        setShowCartPreview(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted) {
    return (
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6"></div>
          <div></div>
        </div>
      </header>
    );
  }

  const previewItems = cartItems.slice(0, 3);
  const hasMoreItems = cartItems.length > 3;

  return (
    <header
      className={`border-b bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <div className="sr-only">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
              </div>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Cozy Threads</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-0.5 p-4 flex-1"></nav>
                <div className="border-t p-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 py-2 px-2 text-base font-medium transition-colors hover:text-secondary rounded-md hover:bg-secondary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="relative">
                        <ShoppingBag className="h-5 w-5" />
                        {cartItemCount > 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-secondary text-white h-4 w-4 flex items-center justify-center p-0 rounded-full text-xs shadow-[0_2px_8px_rgba(226,114,91,0.5)]">
                            {cartItemCount}
                          </Badge>
                        )}
                      </div>
                      <span>
                        Cart {cartItemCount > 0 && `(${cartItemCount})`}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-sm xs:text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cozy Threads
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 lg:gap-2"></nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-secondary rounded-md p-1.5 hover:bg-secondary/10 relative"
              aria-label={`Cart with ${cartItemCount} items`}
              ref={cartButtonRef}
              onMouseEnter={() => cartItemCount > 0 && setShowCartPreview(true)}
              onClick={() => setShowCartPreview(false)}
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary text-white h-4 w-4 flex items-center justify-center p-0 rounded-full text-xs shadow-[0_2px_8px_rgba(226,114,91,0.5)] animate-in fade-in duration-300">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </div>
              <span className="hidden lg:inline-block">
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </span>
            </Link>

            {showCartPreview && cartItemCount > 0 && (
              <div
                ref={cartPreviewRef}
                className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200"
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <div className="p-3 bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
                  <h3 className="font-medium">Your Cart ({cartItemCount})</h3>
                </div>
                <div className="max-h-80 overflow-auto">
                  {previewItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {item.categories[0]}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {hasMoreItems && (
                    <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                      +{cartItems.length - 3} more items in your cart
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <Link
                    href="/cart"
                    className="flex items-center justify-between w-full text-sm font-medium text-primary hover:text-secondary transition-colors"
                  >
                    <span>View full cart</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
