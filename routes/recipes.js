var express = require("express");
const { system } = require("nodemon/lib/config");
const { stdout } = require("nodemon/lib/config/defaults");
var router = express.Router();
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/recipe", async (req, res, next) => {
  try {
    let user_id;
    
    if (req.session && req.session.user_id){
      user_id = req.session.user_id;
      await user_utils.markAsWatched(user_id,req.query.id);
    }
    const recipe = await recipes_utils.getRecipeDetails(req.query.id,user_id);
    // if(recipe==null){
    //   throw { status: 401, message: "recipe ID is not exists" }; 
    // }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


router.get("/random", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRandomRecipes();
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


router.get("/searchRecipe", async (req, res, next) => {
  try {

    const recipes = await recipes_utils.getSearchResults(req.query.query,req.query.titleMatch,req.query.number,req.query.cuisine,req.query.diet,req.query.intolerances,req.session.user_id)
    if (recipes.length==0){
      throw { status: 204, message: "No results to the search" };
    }
  
    //res.status(200).send({ message: "results returned", success: true });
    res.send(recipes);
    
  } catch (error) {
    next(error);
  }
});








module.exports = router;
