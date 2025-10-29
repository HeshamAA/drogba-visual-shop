import { Fragment } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type FiltersPanelProps = {
  show: boolean;
  categories: any[];
  categoriesLoading: boolean;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
  onClose: () => void;
};

export default function FiltersPanel({
  show,
  categories,
  categoriesLoading,
  selectedCategory,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  activeFiltersCount,
  onClearFilters,
  onClose,
}: FiltersPanelProps) {
  if (!show) return null;

  const normalizedCategories = Array.isArray(categories)
    ? categories.map((c: any) => {
        const id = c?.id ?? c?.attributes?.id ?? String(Math.random());
        const name = c?.name ?? c?.attributes?.name ?? "";
        const slug =
          c?.slug ?? c?.attributes?.slug ?? name?.toLowerCase?.() ?? "";
        return { id, name, slug };
      })
    : [];

  return (
    <div className="mb-8 rounded-xl border border-border p-4 grid gap-4 bg-surface dark:bg-surface-dark">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {activeFiltersCount > 0
            ? `عدد الفلاتر المفعلة: ${activeFiltersCount}`
            : "لا توجد فلاتر مفعلة"}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClearFilters}>
            مسح
          </Button>
          <Button variant="secondary" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm mb-2 block">التصنيف</label>
          <select
            className="w-full border border-border rounded-md h-10 px-3 bg-background"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={categoriesLoading}
          >
            <option value="all">الكل</option>
            {normalizedCategories.map((cat) => (
              <option key={cat.slug || cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm mb-2 block">أقل سعر</label>
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-sm mb-2 block">أعلى سعر</label>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}
