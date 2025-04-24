import mongoose from "mongoose";

const coffeeShopSchema = new mongoose.Schema(
   {
      name: { type: String, required: false },
      logo: { type: String },
   },
   {
      versionKey: false,
      timestamps: {
         createdAt: "created_at",
         updatedAt: "updated_at",
      },
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

coffeeShopSchema.virtual("coffees", {
   ref: "Coffee",
   localField: "_id",
   foreignField: "coffeeShopId",
});

const CoffeeShop = mongoose.model("CoffeeShop", coffeeShopSchema);
export default CoffeeShop;
