// Strapi Types based on backend specification

export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    };
  } | null;
}

export interface StrapiImageArray {
  data: Array<{
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    };
  }>;
}

export interface ProductSize {
  name: string;
  inStock: boolean;
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

export interface Product {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description: string;
    // price is the current selling price. When discounted, keep original in old_price
    price: number;
    // optional original price to display strike-through when price < old_price
    old_price?: number;
    // list of coupon codes that can apply to this product
    applicable_coupons?: string[];
    main_image: StrapiImage;
    gallery_images: StrapiImageArray;
    categories: {
      data: Category[];
    };
    sizes: ProductSize[];
    createdAt: string;
    updatedAt: string;
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

export interface Order {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: "cod" | "wallet";
  order_items: OrderItem[];
  total_price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
}
