export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categories: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
}