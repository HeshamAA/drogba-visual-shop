export interface CartItem {
  id: string; // productId_size
  productId: number;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
