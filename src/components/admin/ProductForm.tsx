import { useState } from 'react';
import { Product } from '@/types/strapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Product>(
    product || {
      id: 0,
      attributes: {
        name: '',
        slug: '',
        description: '',
        price: 0,
        sizes: [
          { name: 'S', inStock: true },
          { name: 'M', inStock: true },
          { name: 'L', inStock: true },
          { name: 'XL', inStock: true },
        ],
        main_image: {
          data: {
            id: 1,
            attributes: {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
              alternativeText: '',
              width: 800,
              height: 1000,
            },
          },
        },
        gallery_images: { data: [] },
        categories: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'تيشرتات',
                slug: 't-shirts',
              },
            },
          ],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.attributes.name || !formData.attributes.price) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    // Generate slug from name if empty
    if (!formData.attributes.slug) {
      formData.attributes.slug = formData.attributes.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
    }

    onSave(formData);
    toast({
      title: 'تم الحفظ',
      description: product ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes,
        [field]: value,
      },
    });
  };

  const toggleSize = (sizeName: string) => {
    const updatedSizes = formData.attributes.sizes.map((size) =>
      size.name === sizeName ? { ...size, inStock: !size.inStock } : size
    );
    updateField('sizes', updatedSizes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج *</Label>
        <Input
          id="name"
          value={formData.attributes.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="مثال: تيشرت دروجبا كلاسيك"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">السعر (ج.م) *</Label>
        <Input
          id="price"
          type="number"
          value={formData.attributes.price}
          onChange={(e) => updateField('price', Number(e.target.value))}
          placeholder="450"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={formData.attributes.description.replace(/<[^>]*>/g, '')}
          onChange={(e) => updateField('description', `<p>${e.target.value}</p>`)}
          placeholder="وصف المنتج..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">رابط الصورة الرئيسية</Label>
        <Input
          id="image"
          value={formData.attributes.main_image.data?.attributes.url || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              attributes: {
                ...formData.attributes,
                main_image: {
                  data: {
                    id: 1,
                    attributes: {
                      url: e.target.value,
                      alternativeText: formData.attributes.name,
                      width: 800,
                      height: 1000,
                    },
                  },
                },
              },
            })
          }
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>المقاسات المتاحة</Label>
        <div className="flex gap-2 flex-wrap">
          {formData.attributes.sizes.map((size) => (
            <Button
              key={size.name}
              type="button"
              variant={size.inStock ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSize(size.name)}
            >
              {size.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          حفظ
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
