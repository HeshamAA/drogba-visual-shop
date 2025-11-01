import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/strapi";
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
  
  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<Array<{ id: number; url: string }>>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    if (product) {
      const sizesArray =
        typeof product.sizes === "string"
          ? product.sizes.split(",").map((s) => s.trim())
          : Array.isArray(product.sizes)
            ? product.sizes.map((s) => typeof s === "string" ? s : s.name)
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

      // Set gallery images if product has them
      if (product.gallery_images && Array.isArray(product.gallery_images)) {
        const gallery = product.gallery_images.map((img: { id: number | string; url: string }) => ({
          id: typeof img.id === 'string' ? parseInt(img.id, 10) : img.id,
          url: getImageUrl(img.url),
        }));
        setGalleryImages(gallery);
      }

      // Set image preview if product has an image
      if (product.main_image) {
        const imageUrl =
          typeof product.main_image === "object" &&
          "url" in product.main_image
            ? getImageUrl(product.main_image.url)
            : "";
        setImagePreview(imageUrl);

        if (
          typeof product.main_image === "object" &&
          "id" in product.main_image
        ) {
          setCurrentImageId(product.main_image.id);
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
        main_image: product.main_image,
      });
    } else {
      setSelectedSizes([]);
      setColorList([]);
      setImagePreview(null);
      setCurrentImageId(null);
      setGalleryImages([]);
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
      toast.error("الرجاء اختيار ملف صورة صالح");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
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
        main_image: uploadedImage as any,
      }));

      toast.success("تم رفع الصورة بنجاح");
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      
      const err = error as { response?: { status?: number }; message?: string };
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("يجب تسجيل الدخول كـ Admin لرفع الصور");
      } else {
        toast.error("فشل في رفع الصورة: " + (err.message || "حدث خطأ"));
      }
      
      // Reset preview on error
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setCurrentImageId(null);
    setFormData((prev) => ({
      ...prev,
      main_image: undefined,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة صالح");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    setUploadingGallery(true);
    try {
      const uploadedImage = await adminProductsApi.uploadImage(file);
      const imageUrl = getImageUrl(uploadedImage.url);
      
      setGalleryImages((prev) => [...prev, { id: uploadedImage.id, url: imageUrl }]);
      toast.success("تم إضافة الصورة للمعرض");
      
      // Reset file input
      e.target.value = "";
    } catch (error: unknown) {
      console.error("Error uploading gallery image:", error);
      
      const err = error as { response?: { status?: number }; message?: string };
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("يجب تسجيل الدخول كـ Admin لرفع الصور");
      } else {
        toast.error("فشل في رفع الصورة: " + (err.message || "حدث خطأ"));
      }
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (id: number) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    toast.success("تم حذف الصورة من المعرض");
  };

  const handleImagePreview = (url: string) => {
    setPreviewImage(url);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check required fields
    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (الاسم، السعر، الكمية)");
      return;
    }

    if (!currentImageId) {
      toast.error("يرجى رفع صورة رئيسية للمنتج");
      return;
    }

    if (selectedSizes.length === 0) {
      toast.error("يرجى اختيار مقاس واحد على الأقل");
      return;
    }

    const validColors = colorList.filter((c) => c.trim() !== "");
    if (validColors.length === 0) {
      toast.error("يرجى إضافة لون واحد على الأقل");
      return;
    }

    if (!formData.category) {
      toast.error("يرجى اختيار فئة للمنتج");
      return;
    }

    // Prepare product data with selected sizes, colors, and images
    const productData: Partial<Product> = {
      ...formData,
      sizes: selectedSizes,
      colors: colorList.filter((c) => c.trim() !== ""),
      main_image: currentImageId
        ? currentImageId
        : undefined,
      gallery_images: galleryImages.length > 0
        ? galleryImages.map((img) => img.id)
        : undefined,
    };

    onSave(productData);
  };

  const updateField = (field: keyof Partial<Product>, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>صورة المنتج *</Label>
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

      {/* Gallery Images Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>معرض الصور</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("gallery-upload")?.click()}
            disabled={uploadingGallery}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            إضافة صورة
          </Button>
        </div>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          onChange={handleGalleryUpload}
          className="hidden"
        />

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt="Gallery"
                  className="w-full h-24 object-cover rounded-md border-2 border-border cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleImagePreview(img.url)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveGalleryImage(img.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-input rounded-lg bg-muted/20">
            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              لا توجد صور في المعرض. انقر على "إضافة صورة" لإضافة صور.
            </p>
          </div>
        )}
        {uploadingGallery && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground mt-1">جاري رفع الصورة...</p>
          </div>
        )}
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

      {/* Image Preview Popup */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-6 right-6 z-10"
              onClick={closePreview}
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
    </form>
  );
}
