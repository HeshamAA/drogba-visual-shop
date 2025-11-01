import { lazy, Suspense } from "react";
import { Outlet, Route } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import PageLoader from "@/shared/components/PageLoader";

// Lazy load pages for better performance
const Index = lazy(() => import("@/features/home/pages/Index"));
const Products = lazy(() => import("@/features/products/pages/Products"));
const ProductDetail = lazy(() => import("@/features/products/pages/ProductDetail"));
const Cart = lazy(() => import("@/features/cart/pages/Cart"));
const Checkout = lazy(() => import("@/features/orders/pages/Checkout/Checkout"));
const ThankYou = lazy(() => import("@/features/orders/pages/ThankYou/ThankYou"));
const OrderTracking = lazy(() => import("@/features/orders/pages/OrderTracking"));
const NotFound = lazy(() => import("@/shared/components/NotFound"));

const PublicLayout = () => (
  <>
    <Header />
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
    <Footer />
  </>
);

export const PublicRoutes = () => (
  <Route path="/" element={<PublicLayout />}>
    <Route index element={<Index />} />
    <Route path="products" element={<Products />} />
    <Route path="products/:slug" element={<ProductDetail />} />
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="thank-you" element={<ThankYou />} />
    <Route path="order-tracking" element={<OrderTracking />} />
    <Route path="order-tracking/:orderId" element={<OrderTracking />} />
  </Route>
);

const NotFoundLayout = () => (
  <>
    <Header />
    <Suspense fallback={<PageLoader />}>
      <NotFound />
    </Suspense>
    <Footer />
  </>
);

export const NotFoundRoute = () => (
  <Route path="*" element={<NotFoundLayout />} />
);
