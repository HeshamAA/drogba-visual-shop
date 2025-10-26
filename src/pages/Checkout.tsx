import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod' as 'cod' | 'wallet',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    // Here you would POST to your API endpoint
    // For now, simulate success
    toast.success('تم تأكيد طلبك بنجاح!');
    clearCart();
    navigate('/thank-you');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('checkout.customerInfo')}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('checkout.name')}</Label>
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
                <Label htmlFor="phone">{t('checkout.phone')}</Label>
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
                <Label htmlFor="address">{t('checkout.address')}</Label>
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

          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('checkout.paymentMethod')}
            </h2>

            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value: 'cod' | 'wallet') =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="cursor-pointer">
                  {t('checkout.cod')}
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="cursor-pointer">
                  {t('checkout.wallet')} (Vodafone Cash, Instapay)
                </Label>
              </div>
            </RadioGroup>

            {formData.paymentMethod === 'wallet' && (
              <p className="mt-4 text-sm text-muted-foreground">
                سيتم إرسال تفاصيل الدفع عبر الواتساب بعد تأكيد الطلب.
              </p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full">
            {t('checkout.placeOrder')}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">
              {t('checkout.orderSummary')}
            </h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} ({item.size}) x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {item.price * item.quantity} {t('product.price')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-semibold">
                  {totalPrice} {t('product.price')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الشحن</span>
                <span className="font-semibold">50 {t('product.price')}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span>
                    {totalPrice + 50} {t('product.price')}
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
