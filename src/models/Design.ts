import { Schema, models, model } from "mongoose";

export interface IDesign {
  _id: string;
  title: string;
  slug: string;
  category: "bridal" | "formals" | "semi-formals";
  description: string;
  price?: number;
  currency?: string;
  fabricDetails: string;
  color?: string;
  estimatedDelivery?: string;
  customMeasurements?: string;
  colorCustomization?: string;
  embellishmentDetails?: string;
  images: { url: string; publicId?: string; alt?: string }[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema = new Schema<IDesign>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["bridal", "formals", "semi-formals"],
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number },
    currency: { type: String, default: "PKR" },
    fabricDetails: { type: String, required: true },
    color: { type: String },
    estimatedDelivery: { type: String },
    customMeasurements: { type: String },
    colorCustomization: { type: String },
    embellishmentDetails: { type: String },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
      },
    ],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Design = models.Design || model<IDesign>("Design", DesignSchema);
