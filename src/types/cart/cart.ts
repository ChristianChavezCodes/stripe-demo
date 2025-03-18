import type { Product } from "@/types/home/home";

export type CartItem = {
  id: number;
  quantity: number;
};

export type CartProduct = Product & {
  quantity: number;
};
