export interface CartItem {
  id?: string; // productId_size_color
  productId: number;
  name: string;
  image?: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
}
