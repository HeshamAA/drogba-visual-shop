import { Product, HomePage } from "@/types/strapi";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    attributes: {
      name: "تيشرت دروجبا كلاسيك",
      slug: "drogba-classic-tee",
      description:
        "<p>تيشرت كلاسيك بتصميم عصري مصنوع من أجود أنواع القطن المصري 100%. مريح للغاية ومثالي للارتداء اليومي. متوفر بعدة مقاسات.</p>",
      price: 450,
      old_price: 550,
      applicable_coupons: ["DROG10"],
      sizes: [
        { name: "S", inStock: true },
        { name: "M", inStock: true },
        { name: "L", inStock: true },
        { name: "XL", inStock: false },
      ],
      main_image: {
        data: {
          id: 1,
          attributes: {
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
            alternativeText: "تيشرت دروجبا كلاسيك",
            width: 800,
            height: 1000,
          },
        },
      },
      gallery_images: {
        data: [
          {
            id: 2,
            attributes: {
              url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=1000&fit=crop",
              alternativeText: "صورة إضافية 1",
              width: 800,
              height: 1000,
            },
          },
          {
            id: 3,
            attributes: {
              url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop",
              alternativeText: "صورة إضافية 2",
              width: 800,
              height: 1000,
            },
          },
        ],
      },
      categories: {
        data: [
          {
            id: 1,
            attributes: {
              name: "تيشرتات",
              slug: "t-shirts",
            },
          },
        ],
      },
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
  },
  {
    id: 2,
    attributes: {
      name: "هودي دروجبا أوفرسايز",
      slug: "drogba-oversized-hoodie",
      description:
        "<p>هودي أوفرسايز فاخر بجودة عالية، مصنوع من قطن ممتاز مع بطانة ناعمة. التصميم العصري يمنحك إطلالة مميزة وأناقة لا مثيل لها.</p>",
      price: 850,
      old_price: 990,
      sizes: [
        { name: "M", inStock: true },
        { name: "L", inStock: true },
        { name: "XL", inStock: true },
        { name: "XXL", inStock: false },
      ],
      main_image: {
        data: {
          id: 4,
          attributes: {
            url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
            alternativeText: "هودي دروجبا",
            width: 800,
            height: 1000,
          },
        },
      },
      gallery_images: {
        data: [
          {
            id: 5,
            attributes: {
              url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop",
              alternativeText: "هودي صورة 2",
              width: 800,
              height: 1000,
            },
          },
        ],
      },
      categories: {
        data: [
          {
            id: 2,
            attributes: {
              name: "هوديز",
              slug: "hoodies",
            },
          },
        ],
      },
      createdAt: "2024-01-02",
      updatedAt: "2024-01-02",
    },
  },
  {
    id: 3,
    attributes: {
      name: "سويت شيرت دروجبا برو",
      slug: "drogba-pro-sweatshirt",
      description:
        "<p>سويت شيرت رياضي بتصميم احترافي، مثالي للتمرين والاستخدام اليومي. مصنوع من أقمشة تسمح بمرور الهواء للراحة القصوى.</p>",
      price: 650,
      sizes: [
        { name: "S", inStock: true },
        { name: "M", inStock: true },
        { name: "L", inStock: false },
        { name: "XL", inStock: true },
      ],
      main_image: {
        data: {
          id: 6,
          attributes: {
            url: "https://images.unsplash.com/photo-1614252368135-8b2b7a285eb8?w=800&h=1000&fit=crop",
            alternativeText: "سويت شيرت دروجبا",
            width: 800,
            height: 1000,
          },
        },
      },
      gallery_images: {
        data: [
          {
            id: 7,
            attributes: {
              url: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=1000&fit=crop",
              alternativeText: "سويت شيرت صورة 2",
              width: 800,
              height: 1000,
            },
          },
        ],
      },
      categories: {
        data: [
          {
            id: 3,
            attributes: {
              name: "سويت شيرتات",
              slug: "sweatshirts",
            },
          },
        ],
      },
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03",
    },
  },
  {
    id: 4,
    attributes: {
      name: "جاكيت دروجبا الشتوي",
      slug: "drogba-winter-jacket",
      description:
        "<p>جاكيت شتوي أنيق ودافئ، مثالي للطقس البارد. تصميم عملي مع جيوب متعددة وسحابات عالية الجودة.</p>",
      price: 1200,
      old_price: 1400,
      sizes: [
        { name: "M", inStock: true },
        { name: "L", inStock: true },
        { name: "XL", inStock: true },
      ],
      main_image: {
        data: {
          id: 8,
          attributes: {
            url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
            alternativeText: "جاكيت شتوي",
            width: 800,
            height: 1000,
          },
        },
      },
      gallery_images: {
        data: [
          {
            id: 9,
            attributes: {
              url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop",
              alternativeText: "جاكيت صورة 2",
              width: 800,
              height: 1000,
            },
          },
        ],
      },
      categories: {
        data: [
          {
            id: 4,
            attributes: {
              name: "جاكيتات",
              slug: "jackets",
            },
          },
        ],
      },
      createdAt: "2024-01-04",
      updatedAt: "2024-01-04",
    },
  },
];

export const MOCK_HOMEPAGE: HomePage = {
  id: 1,
  attributes: {
    hero_headline: "أسلوبك. هويتك. دروجبا.",
    hero_video_bg: {
      data: null,
    },
    hero_image_bg: {
      data: {
        id: 10,
        attributes: {
          url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop",
          alternativeText: "Hero Background",
          width: 1920,
          height: 1080,
        },
      },
    },
    featured_products: {
      data: MOCK_PRODUCTS.slice(0, 4),
    },
    lookbook_image: {
      data: {
        id: 11,
        attributes: {
          url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1600&fit=crop",
          alternativeText: "Lookbook",
          width: 1200,
          height: 1600,
        },
      },
    },
    lookbook_hotspots: [
      {
        id: 1,
        product: { data: MOCK_PRODUCTS[0] },
        position_x: 35,
        position_y: 45,
      },
      {
        id: 2,
        product: { data: MOCK_PRODUCTS[1] },
        position_x: 70,
        position_y: 30,
      },
    ],
  },
};
