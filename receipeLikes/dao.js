import recipesMainLikesModel from "./model.js";

export const getUserLikesRecipe = (userId, recipeId) =>
recipesMainLikesModel.findOne({ user: userId, recipeId });
export const userLikesRecipe = (user, recipe, recipeId) =>
recipesMainLikesModel.create({ user, recipe, recipeId });
export const userUnlikesRecipe = (userId, recipeId) =>
recipesMainLikesModel.deleteOne({ user: userId, recipe: recipeId });
export const getLikesForUser = (userId) =>
recipesMainLikesModel.find({ user: userId }).populate("recipesMain", "name");
export const getLikesForRecipe = (recipeId) =>
recipesMainLikesModel.find({ recipeId }).populate("users");
export const getLatestLikedRecipes = ()=>
recipesMainLikesModel.find().sort({ $natural: -1 }).limit(2)
