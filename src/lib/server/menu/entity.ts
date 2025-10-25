import mongoose, { Schema } from "mongoose";
import { IMenu } from "./interface";
import { MenuStatus } from "./enum";

const menuSchema: Schema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    prepTime: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(MenuStatus),
      trim: true,
    },
    ingredients: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Menu =
  (mongoose.models.Menu as mongoose.Model<IMenu>) ||
  mongoose.model<IMenu>("Menu", menuSchema);

export default Menu;
