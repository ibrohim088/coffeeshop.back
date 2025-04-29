import mongoose from "mongoose";

const coffeeShopSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      logo: { type: String , required: true },
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
