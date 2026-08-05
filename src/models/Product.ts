import { Schema, models, model } from "mongoose";

export type ProductCategory = "bridal" | "formals" | "semi-formals" | "luxe-pret";
export type ProductStatus = "in-stock" | "sold-out";

export interface IProductSize {
  label: string;
  available: boolean;
  stock?: number;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  price: number;
  currency: string;
  sku: string;
  description: string;
  fabricDetails?: string;
  sizes: IProductSize[];
  images: { url: string; publicId?: string; alt?: string }[];
  deliveryNote: string;
  featured: boolean;
  published: boolean;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["bridal", "formals", "semi-formals", "luxe-pret"],
      required: true,
    },
    price: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    sku: { type: String, required: true },
    description: { type: String, required: true },
    fabricDetails: { type: String },
    sizes: [
      {
        label: { type: String, required: true },
        available: { type: Boolean, default: true },
        stock: { type: Number, default: 1 },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
      },
    ],
    deliveryNote: { type: String, default: "Delivery 3–4 weeks" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["in-stock", "sold-out"],
      default: "in-stock",
    },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model<IProduct>("Product", ProductSchema);
