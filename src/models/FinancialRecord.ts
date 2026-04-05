import { Document, Model, Schema, Types, model, models } from "mongoose";

import { RecordType } from "@/types";

export interface FinancialRecord {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  softDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialRecordDocument extends FinancialRecord, Document {}

const financialRecordSchema = new Schema<FinancialRecordDocument>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    softDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

financialRecordSchema.index({ softDeleted: 1, date: -1 });
financialRecordSchema.index({ softDeleted: 1, type: 1, category: 1 });

export const FinancialRecordModel =
  (models.FinancialRecord as Model<FinancialRecordDocument>) ||
  model<FinancialRecordDocument>("FinancialRecord", financialRecordSchema);

