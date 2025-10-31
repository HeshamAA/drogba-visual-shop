import { Product } from "@/types/strapi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, X } from "lucide-react";
import { getImageUrl } from "@/lib/strapi";
import { useState } from "react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (slug: string) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100%/7]">الصورة</TableHead>
            <TableHead className="w-[100%/7]">الاسم</TableHead>
            <TableHead className="w-[100%/7]">السعر</TableHead>
            <TableHead className="w-[100%/7]">الفئة</TableHead>
            <TableHead className="w-[100%/7]">المقاسات</TableHead>
            <TableHead className="w-[100%/7]">الألوان</TableHead>
            <TableHead className="w-[100%/7] text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                لا توجد منتجات
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              // Get image URL from main_image or product_images
              const mainImageUrl = product.main_image?.url || product.main_image?.data?.attributes?.url;
              const imageUrl = mainImageUrl
                ? getImageUrl(mainImageUrl)
                : "";
              const colorsField = (product as any).colors;
              const colors = Array.isArray(colorsField)
                ? colorsField
                : typeof colorsField === "string"
                  ? colorsField
                      .split(",")
                      .map((color) => color.trim())
                      .filter(Boolean)
                  : [];

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setPreviewImage(imageUrl)}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        لا توجد صورة
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.old_price &&
                      product.old_price > product.price ? (
                        <>
                          <span className="text-muted-foreground line-through text-sm">
                            {product.old_price} ج.م
                          </span>
                          <span className="font-semibold text-primary">
                            {product.price} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          {product.price} ج.م
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name || "بدون فئة"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                      {Array.isArray(product.sizes) &&
                      product.sizes.length > 0 ? (
                        product.sizes.map((size) => (
                          <span
                            key={size}
                            className="inline-block text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium"
                          >
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          لا توجد مقاسات
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                      {Array.isArray(colors) && colors.length > 0 ? (
                        colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="inline-block text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-medium"
                          >
                            {color}
                          </span>
                        ))
                      ) : typeof colorsField === "string" && colors.length > 0 ? (
                        <span className="inline-block text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-medium">
                          {colorsField}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          لا توجد ألوان
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.slug)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Image Preview Popup */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-6 right-6 z-10"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
