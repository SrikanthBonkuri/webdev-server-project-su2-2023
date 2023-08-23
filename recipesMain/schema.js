import mongoose from "mongoose";

const recipesMainSchema = new mongoose.Schema(
  {
    name: String,
    recipeId: String,
  },
  { collection: "recipesMain" }
);

export default recipesMainSchema;
