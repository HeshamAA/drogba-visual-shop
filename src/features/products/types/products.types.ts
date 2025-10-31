// Product-related types

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
  };
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
  name?: string;
  slug?: string;
  attributes?: {
    name: string;
    slug: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

export interface ProductAttributes {
  name: string;
  slug: string;
  description?: string;
  price: number;
  images?: StrapiImageArray;
  category?: {
    data?: Category;
  };
  sizes?: ProductSize[];
  featured?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number | string;
  documentId: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  old_price?: number;
  quantity?: number;
  category?: CategorySummary;
  images?: StrapiImageArray;
  main_image?: any; // Single image for product
  gallery_images?: any; // Multiple images for product gallery
  sizes?: ProductSize[] | string[] | string;
  colors?: string[] | string;
  featured?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
