import { Product } from '@/types/strapi';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الصورة</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>المقاسات</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                لا توجد منتجات
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.attributes.main_image.data?.attributes.url}
                    alt={product.attributes.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.attributes.name}</TableCell>
                <TableCell>{product.attributes.price} ج.م</TableCell>
                <TableCell>
                  {product.attributes.categories.data.map((cat) => cat.attributes.name).join(', ')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {product.attributes.sizes.map((size) => (
                      <span
                        key={size.name}
                        className={`text-xs px-2 py-1 rounded ${
                          size.inStock
                            ? 'bg-accent/20 text-accent-foreground'
                            : 'bg-muted text-muted-foreground line-through'
                        }`}
                      >
                        {size.name}
                      </span>
                    ))}
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
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
