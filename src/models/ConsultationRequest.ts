import { Schema, models, model } from "mongoose";

export interface IMeasurements {
  bust?: string;
  waist?: string;
  hips?: string;
  shoulder?: string;
  sleeveLength?: string;
  shirtLength?: string;
  trouserLength?: string;
  notes?: string;
}

export interface IConsultationRequest {
  _id: string;
  clientName: string;
  email: string;
  phone: string;
  designReference?: string;
  designId?: string;
  fabricPreference?: string;
  colorPreference?: string;
  measurements?: IMeasurements;
  specialRequests?: string;
  referenceImageUrl?: string;
  message?: string;
  status: "new" | "contacted" | "in-progress" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultationRequest>(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    designReference: String,
    designId: String,
    fabricPreference: String,
    colorPreference: String,
    measurements: {
      bust: String,
      waist: String,
      hips: String,
      shoulder: String,
      sleeveLength: String,
      shirtLength: String,
      trouserLength: String,
      notes: String,
    },
    specialRequests: String,
    referenceImageUrl: String,
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "completed", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const ConsultationRequest =
  models.ConsultationRequest ||
  model<IConsultationRequest>("ConsultationRequest", ConsultationSchema);
