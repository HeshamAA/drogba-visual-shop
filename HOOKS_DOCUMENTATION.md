# Custom Hooks Documentation

## نظرة عامة

تم نقل جميع الـ functionality من الصفحات إلى custom hooks لفصل المنطق عن الـ UI. كل صفحة الآن تستخدم hook واحد يحتوي على كل الـ state والـ logic.

## الهيكل

```
src/features/
├── products/hooks/
│   ├── useProductDetail.ts      # Hook لصفحة تفاصيل المنتج
│   ├── useProductsPage.ts       # Hook لصفحة قائمة المنتجات
│   └── index.ts
├── orders/hooks/
│   ├── useCheckoutPage.ts       # Hook لصفحة الدفع
│   ├── useOrderTracking.ts      # Hook لصفحة تتبع الطلب
│   └── index.ts
├── cart/hooks/
│   ├── useCartPage.ts           # Hook لصفحة السلة
│   └── index.ts
└── home/hooks/
    ├── useHomePage.ts           # Hook للصفحة الرئيسية
    └── index.ts
```

## الـ Hooks المتاحة

### 1. useProductDetail

**الاستخدام:**
```tsx
import { useProductDetail } from '@/features/products/hooks';

const {
  product,
  productData,
  isLoading,
  error,
  allImages,
  mainImage,
  selectedImageIndex,
  setSelectedImageIndex,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  incrementQuantity,
  decrementQuantity,
  handleAddToCart,
  t,
} = useProductDetail();
```

**الوظائف:**
- إدارة حالة المنتج المحدد
- إدارة الصور والـ gallery
- إدارة اختيار المقاس واللون
- إدارة الكمية
- إضافة المنتج للسلة

---

### 2. useProductsPage

**الاستخدام:**
```tsx
import { useProductsPage } from '@/features/products/hooks';

const {
  products,
  filteredProducts,
  categories,
  isLoading,
  isCategoriesLoading,
  error,
  page,
  sortBy,
  setSortBy,
  selectedCategory,
  priceRange,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  handleCategoryChange,
  handlePriceChange,
  clearFilters,
  translateCategoryName,
  t,
} = useProductsPage();
```

**الوظائف:**
- جلب وإدارة قائمة المنتجات
- إدارة الفلاتر (الفئة، السعر)
- إدارة الترتيب
- إدارة حالة عرض الفلاتر (mobile)
- حساب عدد الفلاتر النشطة

---

### 3. useCheckoutPage

**الاستخدام:**
```tsx
import { useCheckoutPage } from '@/features/orders/hooks';

const {
  items,
  totalPrice,
  shippingCost,
  finalTotal,
  loading,
  formData,
  paymentMethod,
  isVodafonePaid,
  showVodafoneConfirmation,
  VODAFONE_CASH_NUMBER,
  SHIPPING_FEE,
  handleFormChange,
  handlePaymentMethodChange,
  handleVodafonePaid,
  copyVodafoneNumber,
  handleSubmit,
  t,
  navigate,
} = useCheckoutPage();
```

**الوظائف:**
- إدارة بيانات النموذج
- إدارة طريقة الدفع
- التحقق من صحة البيانات
- إرسال الطلب
- حساب التكاليف

---

### 4. useCartPage

**الاستخدام:**
```tsx
import { useCartPage } from '@/features/cart/hooks';

const {
  items,
  totalPrice,
  shippingFee,
  payableTotal,
  isEmpty,
  removeItem,
  incrementItem,
  decrementItem,
  t,
} = useCartPage();
```

**الوظائف:**
- إدارة عناصر السلة
- حساب الأسعار
- التحكم في الكميات

---

### 5. useOrderTracking

**الاستخدام:**
```tsx
import { useOrderTracking } from '@/features/orders/hooks';

const {
  order,
  loading,
  orderId,
  searchId,
  setSearchId,
  handleSearch,
  navigate,
  t,
} = useOrderTracking();
```

**الوظائف:**
- جلب بيانات الطلب
- البحث عن طلب
- عرض حالة الطلب

---

### 6. useHomePage

**الاستخدام:**
```tsx
import { useHomePage } from '@/features/home/hooks';

const {
  featuredProducts,
  newArrivals,
  isLoading,
} = useHomePage();
```

**الوظائف:**
- جلب المنتجات المميزة
- جلب المنتجات الجديدة

---

## المزايا

### 1. فصل المنطق عن الـ UI
- الصفحات الآن تحتوي على UI فقط
- كل المنطق موجود في الـ hooks
- سهولة الصيانة والتطوير

### 2. إعادة الاستخدام
- يمكن استخدام نفس الـ hook في أكثر من مكان
- سهولة مشاركة المنطق بين المكونات

### 3. سهولة الاختبار
- يمكن اختبار الـ hooks بشكل منفصل
- لا حاجة لاختبار الـ UI للتحقق من المنطق

### 4. التنظيم
- كل feature له hooks خاصة به
- ملفات index للتصدير السهل

## أمثلة الاستخدام

### مثال: صفحة ProductDetail

**قبل:**
```tsx
export default function ProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { product, isLoading, error } = useProductBySlug(slug || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  // ... المزيد من الكود
  
  const handleAddToCart = () => {
    // ... المنطق
  };
  
  return (
    // ... UI
  );
}
```

**بعد:**
```tsx
export default function ProductDetail() {
  const {
    product,
    productData,
    isLoading,
    error,
    allImages,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    handleAddToCart,
    // ... باقي القيم
  } = useProductDetail();
  
  return (
    // ... UI فقط
  );
}
```

## الخلاصة

تم نقل كل الـ functionality بنجاح إلى custom hooks، مما يجعل الكود:
- ✅ أكثر تنظيماً
- ✅ أسهل في الصيانة
- ✅ قابل لإعادة الاستخدام
- ✅ سهل الاختبار
- ✅ واضح ومقروء
