import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useAdmin } from "@/features/admin/hooks/useAdmin";
import ProtectedRoute from "@/features/admin/components/ProtectedRoute";
import ProductsTable from "@/features/admin/components/ProductsTable";
import ProductForm from "@/features/admin/components/ProductForm";
import ThemeToggle from "@/features/admin/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Plus, ArrowLeft, RefreshCw } from "lucide-react";
import { Product } from "@/types/strapi";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle } from "lucide-react";

function AdminProductsContent() {
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
    refetch,
  } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (productData: Partial<Product>) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData as Product);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await addProduct(productData as Product);
        toast.success("تم إضافة المنتج بنجاح");
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      await refetch();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "فشل في حفظ المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteProduct(id);
        toast.success("تم حذف المنتج بنجاح");
        await refetch();
      } catch (error: any) {
        console.error("Error deleting product:", error);
        toast.error(error.message || "فشل في حذف المنتج");
      }
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!isSaving) {
      setIsDialogOpen(open);
      if (!open) {
        setEditingProduct(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
                <p className="text-sm text-muted-foreground">
                  {products.length} منتج
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
              <ThemeToggle />
              <Button onClick={handleAddNew} disabled={loading}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة منتج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground mb-6">
              ابدأ بإضافة منتجك الأول
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </div>
        ) : (
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => handleDialogClose(false)}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <ProtectedRoute>
      <AdminProductsContent />
    </ProtectedRoute>
  );
}
