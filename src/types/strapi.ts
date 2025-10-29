// Strapi Types based on backend specification

export interface MediaFormat {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiImage {
  data?: {
    id: number;
    attributes: MediaFormat;
  } | null;
  url?: string;
  formats?: Record<string, MediaFormat>;
}

export interface StrapiImageArray {
  data?: Array<{
    id: number;
    attributes: MediaFormat;
  }>;
}

export interface ProductSize {
  name: string;
  inStock?: boolean;
}

export interface CategorySummary {
  id?: number | string;
  name?: string;
  slug?: string;
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

export interface ProductAttributes {
  name: string;
  slug: string;
  description?: string;
  price: number;
  old_price?: number;
  applicable_coupons?: string[];
  main_image?: StrapiImage;
  gallery_images?: StrapiImageArray;
  product_images?: StrapiImage;
  category?: CategorySummary;
  categories?: {
    data?: Category[];
  };
  sizes?: ProductSize[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product extends ProductAttributes {
  id: number | string;
  attributes?: ProductAttributes & {
    categories?: {
      data?: Category[];
    };
  };
}

// Coupon model for admin-managed discount codes
export interface Coupon {
  code: string; // unique uppercase code
  type: "percent" | "fixed";
  value: number; // percent 1-100 or fixed amount in EGP
  active: boolean;
  // if empty or undefined => global. Otherwise limited to listed product IDs
  applicableProductIds?: number[];
  // optional expiration ISO date
  expiresAt?: string;
}

export interface Hotspot {
  id: number;
  product: {
    data: Product;
  };
  position_x: number;
  position_y: number;
}

export interface HomePage {
  id: number;
  attributes: {
    hero_headline: string;
    hero_video_bg: StrapiImage;
    hero_image_bg: StrapiImage;
    featured_products: {
      data: Product[];
    };
    lookbook_image: StrapiImage;
    lookbook_hotspots: Hotspot[];
  };
}

export interface OrderItem {
  productId: number;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderProductSummary {
  name?: string;
  productName?: string;
  size?: string;
  quantity?: number;
}

export interface Order {
  id?: number | string;
  customer_name?: string;
  customer_phone?: string;
  phone?: string;
  customer_address?: string;
  payment_method?: "cod" | "wallet";
  order_items?: OrderItem[];
  products?: OrderProductSummary[];
  total_price?: number;
  status?: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt?: string;
  updatedAt?: string;
}
