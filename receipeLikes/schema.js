import mongoose from "mongoose";

const recipesMainLikesSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipesMain",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    recipeId: String,
  },
  {
    collection: "recipesMainLikes",
  }
);

export default recipesMainLikesSchema;
