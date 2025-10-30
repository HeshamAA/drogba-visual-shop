import { Button } from "@/components/ui/button";
import ProductsTable from "@/features/admin/components/ProductsTable";
import ProductForm from "@/features/admin/components/ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ArrowLeft } from "lucide-react";
import { useAdminProducts } from "@/features/admin/hooks/useAdminProducts";

export default function AdminProducts() {
  const {
    products,
    isDialogOpen,
    editingProduct,
    setIsDialogOpen,
    handleSave,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleCancel,
    goBackToDashboard,
  } = useAdminProducts();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBackToDashboard}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة منتج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
