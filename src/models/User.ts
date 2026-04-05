import { Model, Schema, model, models, Document } from "mongoose";

import { UserRole, UserStatus } from "@/types";

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["viewer", "analyst", "admin"],
      required: true,
      default: "viewer",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);

