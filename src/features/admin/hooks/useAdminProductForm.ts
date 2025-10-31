import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Category,
  CategorySummary,
  Product,
  ProductSize,
  StrapiImage,
} from "@/types/strapi";
import { useCategories } from "@/features/products/hooks/useCategories";
import { adminProductsApi } from "@/features/admin/api/admin";
import { getImageUrl } from "@/lib/strapi";
import { toast } from "@/shared/components/ui/use-toast";

export type ProductFormSubmission = Partial<Product> & {
  quantity?: number;
  colors?: string[];
};

export interface FormCategoryOption {
  id: string;
  name: string;
}

interface ProductFormValues {
  name: string;
  price: number;
  old_price?: number;
  quantity: number;
  sizes: string[];
  colors: string[];
  description: string;
  category?: FormCategoryOption;
  product_images?: StrapiImage | { id?: number; url?: string } | null;
}

type AdminProduct = Product & {
  quantity?: number;
  colors?: string[] | string;
  category?: CategorySummary & { attributes?: Category["attributes"] };
  product_images?: StrapiImage | { id?: number; url?: string } | null;
  sizes?: ProductSize[] | string[] | string;
};

interface UseAdminProductFormParams {
  product: AdminProduct | null;
  onSave: (product: ProductFormSubmission) => void;
}

interface UseAdminProductFormReturn {
  availableSizes: string[];
  categoryOptions: FormCategoryOption[];
  colorList: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  formData: ProductFormValues;
  imagePreview: string | null;
  isUploadingImage: boolean;
  selectedSizes: string[];
  addColor: () => void;
  handleImageClick: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  removeColor: (index: number) => void;
  toggleSize: (size: string) => void;
  updateColor: (index: number, value: string) => void;
  updateField: <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => void;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  price: 0,
  old_price: undefined,
  quantity: 0,
  sizes: [],
  colors: [],
  description: "",
  category: undefined,
  product_images: null,
};

const normalizeSizes = (sizes?: AdminProduct["sizes"]): string[] => {
  if (!sizes) return [];

  if (typeof sizes === "string") {
    return sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  }

  if (Array.isArray(sizes)) {
    return sizes
      .map((size) =>
        typeof size === "string" ? size.trim() : size?.name?.trim() ?? "",
      )
      .filter(Boolean);
  }

  return [];
};

const normalizeColors = (colors?: AdminProduct["colors"]): string[] => {
  if (!colors) return [];

  if (typeof colors === "string") {
    return colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
  }

  if (Array.isArray(colors)) {
    return colors.map((color) => color?.trim?.() ?? color ?? "").filter(Boolean);
  }

  return [];
};

const extractCategory = (product: AdminProduct | null): FormCategoryOption | undefined => {
  if (!product) return undefined;

  const rawCategory =
    product.category ?? (product as Record<string, unknown>)?.category ??
    (product.categories?.data && product.categories.data[0]);

  if (!rawCategory) return undefined;

  if ("attributes" in rawCategory && rawCategory.attributes) {
    const id = String((rawCategory as Category).id ?? "");
    const name = rawCategory.attributes?.name ?? "";
    if (!id || !name) return undefined;
    return { id, name };
  }

  const id = String((rawCategory as CategorySummary)?.id ?? "");
  const name =
    (rawCategory as CategorySummary & { name?: string }).name ??
    (rawCategory as { label?: string }).label ??
    "";

  if (!id || !name) return undefined;

  return { id, name };
};

const extractImagePreview = (image?: ProductFormValues["product_images"]): {
  preview: string | null;
  id: number | null;
} => {
  if (!image) return { preview: null, id: null };

  const directUrl = (image as { url?: string }).url;
  if (directUrl) {
    return {
      preview: getImageUrl(directUrl),
      id: typeof (image as { id?: number }).id === "number" ? (image as { id?: number }).id ?? null : null,
    };
  }

  const dataNode = (image as StrapiImage)?.data;
  const urlFromData = dataNode?.attributes?.url;
  const idFromData = dataNode?.id;

  return {
    preview: urlFromData ? getImageUrl(urlFromData) : null,
    id: typeof idFromData === "number" ? idFromData : null,
  };
};

export const useAdminProductForm = ({
  product,
  onSave,
}: UseAdminProductFormParams): UseAdminProductFormReturn => {
  const { categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormValues>(DEFAULT_VALUES);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorList, setColorList] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);

  const availableSizes = useMemo(
    () => ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    [],
  );

  const categoryOptions = useMemo<FormCategoryOption[]>(
    () =>
      categories
        .map((category) => ({
          id: String(category.id ?? ""),
          name: category.attributes?.name ?? "",
        }))
        .filter((option) => option.id && option.name),
    [categories],
  );

  useEffect(() => {
    if (!product) {
      setFormData(DEFAULT_VALUES);
      setSelectedSizes([]);
      setColorList([]);
      setImagePreview(null);
      setCurrentImageId(null);
      return;
    }

    const normalizedSizes = normalizeSizes(product.sizes);
    const normalizedColors = normalizeColors(product.colors);
    const normalizedCategory = extractCategory(product);

    const nextFormData: ProductFormValues = {
      name: product.name ?? "",
      price: product.price ?? 0,
      old_price: product.old_price ?? undefined,
      quantity: typeof product.quantity === "number" ? product.quantity : 0,
      sizes: normalizedSizes,
      colors: normalizedColors,
      description: typeof product.description === "string" ? product.description : "",
      category: normalizedCategory,
      product_images: product.product_images ?? null,
    };

    const { preview, id } = extractImagePreview(nextFormData.product_images);

    setFormData(nextFormData);
    setSelectedSizes(normalizedSizes);
    setColorList(normalizedColors);
    setImagePreview(preview);
    setCurrentImageId(id);
  }, [product]);

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
    );
  }, []);

  const addColor = useCallback(() => {
    setColorList((prev) => [...prev, ""]);
  }, []);

  const removeColor = useCallback((index: number) => {
    setColorList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateColor = useCallback((index: number, value: string) => {
    setColorList((prev) =>
      prev.map((color, i) => (i === index ? value : color)),
    );
  }, []);

  const updateField = useCallback(
    <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast({
          title: "خطأ",
          description: "الرجاء اختيار ملف صورة صالح",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطأ",
          description: "حجم الصورة يجب أن يكون أقل من 5MB",
          variant: "destructive",
        });
        return;
      }

      setIsUploadingImage(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const uploadedImage = await adminProductsApi.uploadImage(file);
        const uploadId = typeof uploadedImage.id === "number" ? uploadedImage.id : Number(uploadedImage.id ?? null);

        setCurrentImageId(Number.isFinite(uploadId) ? Number(uploadId) : null);
        setFormData((prev) => ({
          ...prev,
          product_images: uploadedImage as ProductFormValues["product_images"],
        }));

        if (uploadedImage.url) {
          setImagePreview(getImageUrl(uploadedImage.url));
        }

        toast({
          title: "نجح",
          description: "تم رفع الصورة بنجاح",
        });
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast({
          title: "خطأ",
          description: `فشل في رفع الصورة: ${error?.message ?? "حدث خطأ"}`,
          variant: "destructive",
        });
      } finally {
        setIsUploadingImage(false);
      }
    },
    [],
  );

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setCurrentImageId(null);
    setFormData((prev) => ({
      ...prev,
      product_images: null,
    }));
  }, []);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!formData.name.trim() || formData.price <= 0 || formData.quantity <= 0) {
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

      const submission: ProductFormSubmission = {
        ...formData,
        sizes: selectedSizes,
        colors: colorList.filter((color) => color.trim() !== ""),
        category: {
          id: formData.category.id,
          name: formData.category.name,
        },
        product_images: currentImageId
          ? ({ id: currentImageId } as ProductFormSubmission["product_images"])
          : formData.product_images ?? undefined,
      };

      onSave(submission);
    },
    [colorList, currentImageId, formData, onSave, selectedSizes],
  );

  return {
    availableSizes,
    categoryOptions,
    colorList,
    fileInputRef,
    formData,
    imagePreview,
    isUploadingImage,
    selectedSizes,
    addColor,
    handleImageClick,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    removeColor,
    toggleSize,
    updateColor,
    updateField,
  };
};
