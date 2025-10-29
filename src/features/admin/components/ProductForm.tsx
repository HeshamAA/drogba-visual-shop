import { useState, useEffect, useRef } from "react";
import { Product, ProductImage } from "@/types/strapi";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCategories } from "@/features/products/hooks/useCategories";
import { Plus, X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { adminProductsApi } from "@/features/admin/api/admin";
import { getImageUrl } from "@/lib/strapi";
import toast from "react-hot-toast";

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function ProductForm({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const { categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    old_price: undefined,
    quantity: 0,
    sizes: "S,M,L,XL",
    colors: [],
    description: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorList, setColorList] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    if (product) {
      const sizesArray =
        typeof product.sizes === "string"
          ? product.sizes.split(",").map((s) => s.trim())
          : Array.isArray(product.sizes)
            ? product.sizes
            : [];

      const colorsArray =
        typeof product.colors === "string"
          ? product.colors
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : Array.isArray(product.colors)
            ? product.colors.filter(Boolean)
            : [];

      setSelectedSizes(sizesArray);
      setColorList(colorsArray);

      // Set image preview if product has an image
      if (product.product_images) {
        const imageUrl =
          typeof product.product_images === "object" &&
          "url" in product.product_images
            ? getImageUrl(product.product_images.url)
            : "";
        setImagePreview(imageUrl);

        if (
          typeof product.product_images === "object" &&
          "id" in product.product_images
        ) {
          setCurrentImageId(product.product_images.id);
        }
      }

      setFormData({
        name: product.name,
        price: product.price,
        old_price: product.old_price || undefined,
        quantity: product.quantity,
        sizes: sizesArray,
        colors: colorsArray,
        description:
          typeof product.description === "string" ? product.description : "",
        category: product.category,
        product_images: product.product_images,
      });
    } else {
      setSelectedSizes([]);
      setColorList([]);
      setImagePreview(null);
      setCurrentImageId(null);
    }
  }, [product]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addColor = () => {
    setColorList((prev) => [...prev, ""]);
  };

  const removeColor = (index: number) => {
    setColorList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, value: string) => {
    setColorList((prev) =>
      prev.map((color, i) => (i === index ? value : color))
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف صورة صالح",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image to Strapi
      const uploadedImage = await adminProductsApi.uploadImage(file);
      setCurrentImageId(uploadedImage.id);

      // Update formData with the new image
      setFormData((prev) => ({
        ...prev,
        product_images: uploadedImage as any,
      }));

      toast({
        title: "نجح",
        description: "تم رفع الصورة بنجاح",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة: " + (error.message || "حدث خطأ"),
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setCurrentImageId(null);
    setFormData((prev) => ({
      ...prev,
      product_images: undefined,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check required fields
    if (!formData.name || !formData.price || !formData.quantity) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة (الاسم، السعر، الكمية)",
        variant: "destructive",
      });
      return;
    }

    if (selectedSizes.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مقاس واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار فئة للمنتج",
        variant: "destructive",
      });
      return;
    }

    // Prepare product data with selected sizes, colors, and image
    const productData: Partial<Product> = {
      ...formData,
      sizes: selectedSizes,
      colors: colorList.filter((c) => c.trim() !== ""),
      product_images: currentImageId
        ? ({ id: currentImageId } as any)
        : undefined,
    };

    onSave(productData);
  };

  const updateField = (field: keyof Partial<Product>, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>صورة المنتج</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="space-y-2">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-64 object-cover rounded-lg border-2 border-border"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleImageClick}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  تغيير
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  حذف
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleImageClick}
              className="w-full h-64 border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/20"
            >
              {uploadingImage ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    جاري رفع الصورة...
                  </p>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    انقر لرفع صورة المنتج
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG أو WEBP (حتى 5MB)
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج *</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="مثال: تيشرت دروجبا كلاسيك"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر (ج.م) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price || ""}
            onChange={(e) => updateField("price", Number(e.target.value))}
            placeholder="450"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="old_price">السعر القديم (ج.م)</Label>
          <Input
            id="old_price"
            type="number"
            min="0"
            value={formData.old_price || ""}
            onChange={(e) =>
              updateField(
                "old_price",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="السعر الأصلي قبل الخصم"
          />
          <p className="text-xs text-muted-foreground">
            اتركه فارغاً إذا لم يكن هناك سعر قديم
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">الكمية المتاحة *</Label>
        <Input
          id="quantity"
          type="number"
          min="0"
          value={formData.quantity || 0}
          onChange={(e) => updateField("quantity", Number(e.target.value))}
          placeholder="100"
          required
        />
      </div>

      {/* Sizes - Radio Boxes */}
      <div className="space-y-2">
        <Label>المقاسات المتوفرة *</Label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`flex items-center justify-center h-10 px-3 rounded-md border-2 transition-all ${
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:border-primary/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          اختر المقاسات المتوفرة للمنتج
        </p>
      </div>

      {/* Colors - Dynamic Inputs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>الألوان المتوفرة</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColor}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            إضافة لون
          </Button>
        </div>

        <div className="space-y-2">
          {colorList.map((color, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                placeholder="أدخل اسم اللون..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeColor(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {colorList.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              لا توجد ألوان مضافة. انقر على "إضافة لون" لإضافة لون جديد.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={
            typeof formData.description === "string" ? formData.description : ""
          }
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="وصف المنتج..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">الفئة</Label>
        <select
          id="category"
          value={formData.category?.id || ""}
          onChange={(e) => {
            const categoryId = Number(e.target.value);
            const selectedCategory = categories.find(
              (c) => c.id === categoryId
            );
            updateField("category", selectedCategory || undefined);
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="">اختر الفئة</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          حفظ
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
