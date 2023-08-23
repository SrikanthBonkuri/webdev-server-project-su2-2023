import recipesMainSchemaModel from "./model.js";

export const createRecipe = (recipe) => recipesMainSchemaModel.create(recipe);
export const getRecipes = () => recipesMainSchemaModel.find();
export const getRecipeByRecipeId = (recipeId) => recipesMainSchemaModel.findOne({ recipeId });
export const getRecipeById = (id) => recipesMainSchemaModel.findById(id);
