import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import OrdersTable from '@/components/admin/OrdersTable';
import { ArrowLeft } from 'lucide-react';

export default function AdminOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useAdmin();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <OrdersTable orders={orders} onUpdateStatus={updateOrderStatus} />
      </main>
    </div>
  );
}
