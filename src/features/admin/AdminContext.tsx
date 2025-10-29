import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, Coupon, Order } from "@/types/strapi";
import { productsApi, ordersApi, adminProductsApi } from "@/lib/strapi";
import toast from "react-hot-toast";

interface AdminContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string | number, product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => Promise<void>;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  refetch: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("admin_coupons");
    return saved
      ? JSON.parse(saved)
      : [{ code: "DROG10", type: "percent", value: 10, active: true }];
  });

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products using productsApi from strapi.ts
        const productsData = await productsApi.getAll();

        // Fetch orders using ordersApi from strapi.ts
        const ordersData = [];

        console.log("📦 Loading products and orders from API...");
        setProducts(productsData || []);
        setOrders(ordersData || []);
      } catch (error: any) {
        console.error("❌ Error fetching admin data:", error);
        console.error("Error details:", error.response?.data || error.message);
        toast.error(
          "فشل تحميل البيانات: " + (error.message || "تحقق من اتصال الـ API")
        );
        setProducts([]);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addProduct = async (product: Product) => {
    try {
      const newProduct = await adminProductsApi.create(product);

      setProducts([...products, newProduct]);
      toast.success("تم إضافة المنتج بنجاح");
    } catch (error: any) {
      console.error("❌ Error adding product:", error);
      toast.error("فشل إضافة المنتج: " + (error.message || "تحقق من البيانات"));
      throw error;
    }
  };

  const updateProduct = async (
    id: string | number,
    updatedProduct: Product
  ) => {
    try {
      console.log("🔄 Updating product ID:", id, "Data:", updatedProduct);
      const updated = await adminProductsApi.update(id, updatedProduct);
      console.log("✅ Product updated successfully:", updated);
      setProducts(products.map((p) => (p.id === id ? updated : p)));
      toast.success("تم تحديث المنتج بنجاح");
    } catch (error: any) {
      console.error("❌ Error updating product:", error);
      toast.error("فشل تحديث المنتج: " + (error.message || "تحقق من البيانات"));
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await adminProductsApi.delete(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      toast.error("فشل حذف المنتج");
      throw error;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      await ordersApi.updateStatus(Number(orderId), status);
      setOrders(
        orders.map((order) =>
          String(order.id) === orderId ? { ...order, status } : order
        )
      );
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      toast.error("فشل تحديث حالة الطلب");
      throw error;
    }
  };

  const addCoupon = (coupon: Coupon) => {
    const code = coupon.code.toUpperCase();
    if (coupons.some((c) => c.code === code)) {
      // replace existing
      setCoupons(
        coupons.map((c) => (c.code === code ? { ...coupon, code } : c))
      );
    } else {
      setCoupons([...coupons, { ...coupon, code }]);
    }
  };

  const updateCoupon = (code: string, updated: Coupon) => {
    const normalized = code.toUpperCase();
    setCoupons(
      coupons.map((c) =>
        c.code === normalized ? { ...updated, code: normalized } : c
      )
    );
  };

  const deleteCoupon = (code: string) => {
    const normalized = code.toUpperCase();
    setCoupons(coupons.filter((c) => c.code !== normalized));
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        productsApi.getAll(),
        ordersApi.getAll(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error refetching data:", error);
      toast.error("فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        coupons,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        refetch,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
