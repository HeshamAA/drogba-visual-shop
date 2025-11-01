import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Copy, Loader2 } from "lucide-react";
import { useCheckoutPage } from "@/features/orders/hooks/useCheckoutPage";
import { CheckoutSEO } from "@/shared/components/SEO";

export default function Checkout() {
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

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <CheckoutSEO />
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
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("checkout.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">{t("checkout.address")}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
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
              onValueChange={handlePaymentMethodChange}
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
                    onClick={copyVodafoneNumber}
                    aria-label="Copy Vodafone Cash Number"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleVodafonePaid}
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
                  {shippingCost} {t("product.price")}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span>
                    {finalTotal} {t("product.price")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
