import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
   {
      message: {
         type: mongoose.SchemaTypes.String,
         required: true,
      },
      userId: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "User",
         required: true,
      },
      coffeeShopId: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "CoffeeShop",
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

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
