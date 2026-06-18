export interface Category {
  _id: string;
  name: string;
  description?: string;
  order: number;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: Category | string;
  image?: string;
  isAvailable: boolean;
  order: number;
  allergens?: string[];
  createdAt: string;
}
