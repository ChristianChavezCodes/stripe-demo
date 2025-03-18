"use client";

import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Check } from "lucide-react";
import { products } from "@/lib/mock-data/products";
import type { CartItem } from "@/types/cart/cart";

const ProductList: NextPage<{
  loading?: boolean;
  error?: string | null;
  cartItems?: CartItem[];
  onAddToCart?: (id: number) => void;
}> = ({
  loading = false,
  error = null,
  cartItems = [],
  onAddToCart = (_id: number) => {
    void _id;
  },
}) => {
  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    productId: number
  ) => {
    e.preventDefault();
    onAddToCart(productId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="border shadow-sm w-full h-[450px] animate-pulse overflow-hidden"
          >
            <div className="bg-gray-200 h-[250px] w-full"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const isInCart = cartItems.some((item) => item.id === product.id);

        return (
          <Link
            href="#"
            key={product.id}
            passHref
            className="block group"
            onClick={(e) => handleCardClick(e, product.id)}
          >
            <Card
              className={`border border-gray-100 shadow-sm transition-all duration-500 ease-in-out hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer h-full flex flex-col overflow-hidden ${
                isInCart
                  ? "bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20"
                  : "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
              }`}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className={`w-full h-[250px] object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
                    isInCart ? "opacity-90" : ""
                  }`}
                />
                {isInCart && (
                  <div className="absolute top-4 right-4 bg-secondary text-white rounded-full p-1 shadow-md">
                    <Check className="h-5 w-5" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="bg-primary/5 text-primary border-primary/20 transition-all duration-300 hover:bg-primary/10"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-1 mt-2">
                  {product.colors.map((color) => (
                    <span key={color} className="text-xs text-gray-500">
                      {color}
                      {color !== product.colors[product.colors.length - 1]
                        ? ", "
                        : ""}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className={`w-full transition-all duration-300 ${
                    isInCart
                      ? "bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg"
                      : "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {isInCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductList;
