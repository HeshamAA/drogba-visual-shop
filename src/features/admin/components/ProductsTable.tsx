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
import { Edit, Trash2 } from "lucide-react";
import { getImageUrl } from "@/lib/strapi";

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
              const imageUrl = product.product_images?.url
                ? getImageUrl(product.product_images.url)
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
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-50 h-70 object-cover rounded"
                    />
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
    </Card>
  );
}
