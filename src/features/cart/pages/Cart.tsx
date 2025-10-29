import { useTranslation } from "react-i18next";
import { useCart } from "@/features/cart/CartContext";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { getImageUrl } from "@/lib/strapi";

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, incrementItem, decrementItem, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">{t("cart.empty")}</h2>
        <Link to="/products">
          <Button variant="gradient">{t("cart.continueShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-border rounded-lg"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("product.selectSize")}: {item.size}
                  </p>
                  <p className="font-bold mt-1">
                    {item.price} {t("product.price")}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => decrementItem(item.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => incrementItem(item.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">
              {t("checkout.orderSummary")}
            </h2>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-semibold">
                  {totalPrice} {t("product.price")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-semibold">50 {t("product.price")}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span>
                    {totalPrice + 50} {t("product.price")}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button size="lg" variant="gradient" className="w-full">
                {t("cart.checkout")}
              </Button>
            </Link>

            <Link to="/products" className="block mt-4">
              <Button variant="outline" className="w-full">
                {t("cart.continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
