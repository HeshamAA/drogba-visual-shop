import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart, CASH_ON_DELIVERY_SHIPPING_FEE } from "@/features/cart";
import { useOrderSubmission } from "./useOrders";
import toast from "react-hot-toast";
import type { PaymentMethod } from "@/types/strapi";

const VODAFONE_CASH_NUMBER = "01001234567";
const SHIPPING_FEE = CASH_ON_DELIVERY_SHIPPING_FEE;

export function useCheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { submitOrder, loading, error } = useOrderSubmission();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isVodafonePaid, setIsVodafonePaid] = useState(false);
  const [showVodafoneConfirmation, setShowVodafoneConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePaymentMethodChange = (value: string) => {
    const nextMethod = value as PaymentMethod;
    setPaymentMethod(nextMethod);
    if (nextMethod !== "vodafone cash") {
      setIsVodafonePaid(false);
      setShowVodafoneConfirmation(false);
    }
  };

  const handleVodafonePaid = () => {
    setIsVodafonePaid(true);
    setShowVodafoneConfirmation(true);
    toast.success("تم استلام تأكيد الدفع");
  };

  const copyVodafoneNumber = () => {
    navigator.clipboard
      .writeText(VODAFONE_CASH_NUMBER)
      .then(() => toast.success("تم نسخ الرقم"))
      .catch(() => toast.error("تعذر نسخ الرقم"));
  };

  const validateForm = (): boolean => {
    // Detailed validation with specific error messages
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("الاسم يجب أن يكون أكثر من حرفين");
      return false;
    }

    if (!formData.phone || formData.phone.trim().length < 10) {
      toast.error("رقم الهاتف غير صحيح");
      return false;
    }

    if (!formData.address || formData.address.trim().length < 10) {
      toast.error("العنوان يجب أن يكون تفصيلياً");
      return false;
    }

    // Validate phone format (numbers only)
    const phoneRegex = /^[0-9+\-\s]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("رقم الهاتف يجب أن يحتوي على أرقام فقط");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare order data
    const shippingCost = paymentMethod === "cash" ? SHIPPING_FEE : 0;
    const orderData = {
      customer_name: formData.name,
      customer_phone: parseInt(formData.phone, 10),
      address: formData.address,
      products: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: totalPrice + shippingCost,
      payment_method: paymentMethod,
    };

    // Submit order to Strapi
    const order = await submitOrder(orderData);
    console.log("Order result:", order);

    if (order) {
      const orderId = (order as any).documentId || order.id;
      console.log("Order ID:", orderId);
      toast.success("تم تأكيد طلبك بنجاح!");
      // Navigate first before clearing cart to avoid redirect to /cart
      navigate(`/order-tracking/${orderId}`);
      // Clear cart after a small delay to ensure navigation happens first
      setTimeout(() => clearCart(), 100);
    } else {
      console.log("No order returned");
      toast.error(error || "حدث خطأ أثناء تأكيد الطلب");
    }
  };

  const shippingCost = paymentMethod === "cash" ? SHIPPING_FEE : 0;
  const finalTotal = totalPrice + shippingCost;

  return {
    // Data
    items,
    totalPrice,
    shippingCost,
    finalTotal,
    loading,
    error,
    
    // Form state
    formData,
    paymentMethod,
    isVodafonePaid,
    showVodafoneConfirmation,
    
    // Constants
    VODAFONE_CASH_NUMBER,
    SHIPPING_FEE,
    
    // Actions
    handleFormChange,
    handlePaymentMethodChange,
    handleVodafonePaid,
    copyVodafoneNumber,
    handleSubmit,
    
    // Helpers
    t,
    navigate,
  };
}
