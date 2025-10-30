import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { Product } from "@/types/strapi";
import { loadString } from "@/shared/utils/storage";
import { useAdminNavigation } from "@/features/admin/hooks/useAdminNavigation";

export const useAdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { goBackToDashboard } = useAdminNavigation();

  useEffect(() => {
    const isAuthenticated = loadString("admin_authenticated");
    if (!isAuthenticated) {
      goBackToDashboard();
    }
  }, [goBackToDashboard]);

  const handleSave = useCallback(
    async (product: Product) => {
      try {
        if (editingProduct) {
          await updateProduct(editingProduct.id, product);
          toast.success("تم تحديث المنتج بنجاح");
        } else {
          await addProduct(product);
          toast.success("تم إضافة المنتج بنجاح");
        }
        setIsDialogOpen(false);
        setEditingProduct(null);
      } catch (error: any) {
        toast.error(error?.message || "فشل حفظ المنتج");
      }
    },
    [addProduct, editingProduct, updateProduct],
  );

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        return;
      }
      try {
        await deleteProduct(id);
        toast.success("تم حذف المنتج بنجاح");
      } catch (error: any) {
        toast.error(error?.message || "فشل حذف المنتج");
      }
    },
    [deleteProduct],
  );

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  }, []);

  return {
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
  };
};
