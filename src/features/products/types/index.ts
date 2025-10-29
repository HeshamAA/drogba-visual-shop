// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  images?: string[];
  details?: string[];
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Add any other product-related types here
