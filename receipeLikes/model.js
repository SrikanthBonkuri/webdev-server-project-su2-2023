import mongoose from "mongoose";
import recipeMainLikesSchema from "./schema.js";

const recipeLikesModel = mongoose.model("recipesMainLikes", recipeMainLikesSchema);

export default recipeLikesModel;
