import { Schema, models, model } from "mongoose";

export interface ITestimonial {
  _id: string;
  clientName: string;
  quote: string;
  image?: { url: string; publicId?: string };
  occasion?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true },
    quote: { type: String, required: true },
    image: {
      url: String,
      publicId: String,
    },
    occasion: String,
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
