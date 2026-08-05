import { Schema, models, model } from "mongoose";

export interface IDesign {
  _id: string;
  title: string;
  slug: string;
  category: "bridal" | "formals" | "semi-formals";
  description: string;
  fabricDetails: string;
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
    fabricDetails: { type: String, required: true },
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
