import type { CartProduct } from "@/types/cart/cart";

export interface NavbarProps {
  cartItemCount: number;
  cartItems: CartProduct[];
}
