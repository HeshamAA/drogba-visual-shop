// UI Components
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { ThemeProvider } from "@/features/theme/ThemeContext";

// i18n
import "@/shared/i18n/config";

// Pages
import Index from "@/features/home/pages/Index";
import ProductDetail from "@/features/products/pages/ProductDetail";
import Products from "@/features/products/pages/Products";
import Cart from "@/features/cart/pages/Cart";
import Checkout from "@/features/orders/pages/Checkout/Checkout";
import ThankYou from "@/features/orders/pages/ThankYou/ThankYou";
import NotFound from "@/shared/components/NotFound";

// Admin Pages
import AdminLogin from "@/features/admin/pages/Login";
import AdminDashboard from "@/features/admin/pages/Dashboard";
import AdminProducts from "@/features/admin/pages/Products";
import AdminOrders from "@/features/admin/pages/Orders";
import AdminCoupons from "@/features/admin/pages/Coupons";

// Layout Components
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />

          {/* Public Routes - With Header/Footer */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
