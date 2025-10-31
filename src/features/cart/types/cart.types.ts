// Cart-related types

export interface CartItem {
  id?: string;
  productId: number;
  name: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
}
