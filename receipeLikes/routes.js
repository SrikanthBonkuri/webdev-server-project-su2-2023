import * as likesDao from "./dao.js";
import * as recipeDao from "../recipesMain/dao.js";

function RecipeLikesRoutes(app) {
  const userLikesRecipe = async (req, res) => {
    console.log("Here");
    console.log(req.session);
    console.log(req.session["currentUser"]);
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const userId = currentUser._id;
    const recipeId = req.params["recipeId"];

    const likes = await likesDao.getUserLikesRecipe(userId, recipeId);
    if (likes) {
      res.sendStatus(200);
      return;
    }

    let recipe = await recipeDao.getRecipeByRecipeId(recipeId);
    if (!recipe) {
      recipe = await recipeDao.createRecipe(req.body);
    }

    const actualLikes = await likesDao.userLikesRecipe(
      userId,
      recipe._id,
      recipeId
    );
    res.json(actualLikes);
  };

  const getLikesForUser = async (req, res) => {
    const userId = req.params.userId;
    const likes = await likesDao.getLikesForUser(userId);
    res.json(likes);
  };
  const getLikesForRecipe = async (req, res) => {
    const recipeId = req.params.recipeId;
    const likes = await likesDao.getLikesForRecipe(recipeId);
    res.json(likes);
  };

  const fetchRecipeLiked = async (req, res) => {
 
      const currentUser = req.session.currentUser;
    
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const userId = currentUser._id;
      const recipeId = req.params["recipeId"];
      const likes = await likesDao.getUserLikesRecipe(userId, recipeId);
      if (likes) {
        res.sendStatus(200);
        return true;
      }
      else{
        return false;
      }
  }
  
  const getLatestLikedRecipes = async(req, res) => {
    const latestLikesRecipes = await likesDao.getLatestLikedRecipes();
    console.log(latestLikesRecipes);
     res.json(latestLikesRecipes);
  }

  app.get("/api/recipes/:recipeId/likes", getLikesForRecipe);
  app.get("/api/users/:userId/likes", getLikesForUser);
  app.post("/api/recipes/:recipeId/likes", userLikesRecipe);
  app.get("/api/recipes/:recipeId/is-liked", fetchRecipeLiked);
  app.get("/api/recipes/latest-recipes", getLatestLikedRecipes);
}

export default RecipeLikesRoutes;
