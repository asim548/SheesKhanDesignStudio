import { Schema, models, model } from "mongoose";

export type OrderStatus = "pending" | "contacted" | "fulfilled" | "cancelled";

export interface IOrderItem {
  productId: string;
  title: string;
  slug: string;
  sku: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  items: IOrderItem[];
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  subtotal: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        sku: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        imageUrl: String,
      },
    ],
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    notes: String,
    subtotal: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    status: {
      type: String,
      enum: ["pending", "contacted", "fulfilled", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
