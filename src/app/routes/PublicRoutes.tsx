import { Outlet, Route } from "react-router-dom";

import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import Index from "@/features/home/pages/Index";
import Products from "@/features/products/pages/Products";
import ProductDetail from "@/features/products/pages/ProductDetail";
import Cart from "@/features/cart/pages/Cart";
import Checkout from "@/features/orders/pages/Checkout/Checkout";
import ThankYou from "@/features/orders/pages/ThankYou/ThankYou";
import OrderTracking from "@/features/orders/pages/OrderTracking";
import NotFound from "@/shared/components/NotFound";

const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
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
    <NotFound />
    <Footer />
  </>
);

export const NotFoundRoute = () => (
  <Route path="*" element={<NotFoundLayout />} />
);
