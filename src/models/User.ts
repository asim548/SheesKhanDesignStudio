import { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "staff";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "admin" },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
