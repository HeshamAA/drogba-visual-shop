import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart, CASH_ON_DELIVERY_SHIPPING_FEE } from "@/features/cart";
import { useOrderSubmission } from "@/features/orders/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import { Copy, Loader2 } from "lucide-react";
import type { PaymentMethod } from "@/types/strapi";
const VODAFONE_CASH_NUMBER = "01001234567";
const SHIPPING_FEE = CASH_ON_DELIVERY_SHIPPING_FEE;

export default function Checkout() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Detailed validation with specific error messages
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("الاسم يجب أن يكون أكثر من حرفين");
      return;
    }

    if (!formData.phone || formData.phone.trim().length < 10) {
      toast.error("رقم الهاتف غير صحيح");
      return;
    }

    if (!formData.address || formData.address.trim().length < 10) {
      toast.error("العنوان يجب أن يكون تفصيلياً");
      return;
    }

    // Validate phone format (numbers only)
    const phoneRegex = /^[0-9+\-\s]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("رقم الهاتف يجب أن يحتوي على أرقام فقط");
      return;
    }

    // Prepare order data
    const shippingCost = paymentMethod === "cash" ? SHIPPING_FEE : 0;
    const orderData = {
      customer_name: formData.name,
      customer_phone: formData.phone,
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
    const success = await submitOrder(orderData);

    if (success) {
      toast.success("تم تأكيد طلبك بنجاح!");
      clearCart();
      if (paymentMethod === "vodafone cash") {
        navigate("/order-tracking");
      } else {
        navigate("/thank-you");
      }
    } else {
      toast.error(error || "حدث خطأ أثناء تأكيد الطلب");
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("checkout.customerInfo")}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t("checkout.name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("checkout.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">{t("checkout.address")}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {t("checkout.paymentMethod")}
            </h2>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => {
                const nextMethod = value as PaymentMethod;
                setPaymentMethod(nextMethod);
                if (nextMethod !== "vodafone cash") {
                  setIsVodafonePaid(false);
                  setShowVodafoneConfirmation(false);
                }
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="cash" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    {t("checkout.cod")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="vodafone cash" id="vodafone" />
                  <Label htmlFor="vodafone" className="cursor-pointer">
                    دفع بواسطة فودافون كاش
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {paymentMethod === "cash" ? (
              <p className="text-sm text-muted-foreground">
                سيتم إضافة رسوم توصيل قدرها {SHIPPING_FEE} جنيه إلى إجمالي السعر.
              </p>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  قم بتحويل إجمالي المبلغ إلى رقم فودافون كاش التالي ثم اضغط "تم".
                </p>
                <div className="flex items-center justify-between bg-background border rounded-lg px-3 py-2">
                  <span className="font-semibold text-lg">
                    {VODAFONE_CASH_NUMBER}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(VODAFONE_CASH_NUMBER)
                        .then(() => toast.success("تم نسخ الرقم"))
                        .catch(() => toast.error("تعذر نسخ الرقم"));
                    }}
                    aria-label="Copy Vodafone Cash Number"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setIsVodafonePaid(true);
                    setShowVodafoneConfirmation(true);
                    toast.success("تم استلام تأكيد الدفع");
                  }}
                >
                  تم الدفع
                </Button>

                {showVodafoneConfirmation && (
                  <p className="text-sm text-green-600">
                    رائع! بعد الضغط على تأكيد الطلب، سنقوم بمتابعة التحويل ونخبرك بحالة الطلب.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            variant="gradient"
            className="w-full"
            disabled={
              loading ||
              (paymentMethod === "vodafone cash" && !isVodafonePaid)
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري تأكيد الطلب...
              </>
            ) : (
              t("checkout.placeOrder")
            )}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">
              {t("checkout.orderSummary")}
            </h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} ({item.size}) x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {item.price * item.quantity} {t("product.price")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-semibold">
                  {totalPrice} {t("product.price")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-semibold">
                  {paymentMethod === "cash" ? SHIPPING_FEE : 0} {t("product.price")}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span>
                    {totalPrice + (paymentMethod === "cash" ? SHIPPING_FEE : 0)} {t("product.price")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
