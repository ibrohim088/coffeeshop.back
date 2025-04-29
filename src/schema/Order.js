import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        coffee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Coffee",
          required: true,
        },
        coffeeShop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CoffeeShop",
          required: true,
        }, 
        status: {
          type: String,
          enum: ["Pending", "Processing", "Delivered"],
          default: "Pending",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        price: {
          type: Number,
          ref: "Coffee",
          required: true,
        },
      },
   {
      versionKey: false,
      timestamps: {
         createdAt: "created_at",
         updatedAt: "updated_at",
      },
   }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;