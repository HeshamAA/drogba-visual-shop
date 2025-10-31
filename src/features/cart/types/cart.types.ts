// Cart-related types

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
}
