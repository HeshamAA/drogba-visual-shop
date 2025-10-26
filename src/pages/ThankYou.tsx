import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-20 w-20 text-accent mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">شكراً لطلبك!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        تم استلام طلبك وسيتم التواصل معك قريباً لتأكيد التفاصيل.
      </p>
      <Link to="/">
        <Button size="lg">العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
