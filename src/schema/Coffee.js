   import mongoose from "mongoose";

   const coffeeSchema = new mongoose.Schema(
      {
         name: { type: String, required: true },
         price: { type: Number, required: true },
         image: { type: String, required: true },
         coffeeShopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CoffeeShop",
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

   const Coffee = mongoose.model("Coffee", coffeeSchema);
   export default Coffee;
