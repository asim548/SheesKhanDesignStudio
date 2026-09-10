"use client";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  categoryHasSubcategories,
} from "@/lib/constants";

interface Props {
  category: string;
  subCategory: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  categoryLabel?: string;
  subCategoryLabel?: string;
}

export default function CategorySubcategoryFields({
  category,
  subCategory,
  onCategoryChange,
  onSubCategoryChange,
  categoryLabel = "Parent Category",
  subCategoryLabel = "Subcategory",
}: Props) {
  const showSubcategories = categoryHasSubcategories(category);

  const handleCategoryChange = (next: string) => {
    onCategoryChange(next);
    if (!categoryHasSubcategories(next)) {
      onSubCategoryChange("");
    } else if (!subCategory) {
      onSubCategoryChange(PRODUCT_SUBCATEGORIES[0].value);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <label className="label-luxury mb-2 block">{categoryLabel}</label>
        <select
          className="input-field"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-luxury mb-2 block">{subCategoryLabel}</label>
        {showSubcategories ? (
          <>
            <select
              className="input-field"
              value={subCategory}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              required
            >
              {PRODUCT_SUBCATEGORIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="mt-2 font-sans text-xs text-espresso/45">
              Product appears under {PRODUCT_CATEGORIES.find((c) => c.value === category)?.label} →{" "}
              {PRODUCT_SUBCATEGORIES.find((s) => s.value === subCategory)?.label}
            </p>
          </>
        ) : (
          <>
            <input
              className="input-field bg-espresso/[0.03] text-espresso/40"
              value="Not applicable for Bridals"
              disabled
              readOnly
            />
            <p className="mt-2 font-sans text-xs text-espresso/45">
              Subcategories apply to Luxe Pret, Formals, and Semi-Formals only.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
