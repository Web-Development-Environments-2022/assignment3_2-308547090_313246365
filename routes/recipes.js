var express = require("express");
const { system } = require("nodemon/lib/config");
const { stdout } = require("nodemon/lib/config/defaults");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/recipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.query.id);
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

    const recipes = await recipes_utils.getSearchResults(req.query.query,req.query.titleMatch,req.query.number,req.query.cuisine,req.query.diet,req.query.intolerances)
    if (recipes.length==0){
      throw { status: 204, message: "No results" };
    }
    
  
    //res.status(200).send({ message: "results returned", success: true });
    res.send(recipes);
    
  } catch (error) {
    next(error);
  }
});



router.post("/recipe", async (req, res, next) => {
  
    try {
      let recipe_details = {
        user_id: req.session.user_id,
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        image: req.body.image,
        popularity: 0,
        vegan: req.body.vegan,
        vegetarian: req.body.vegetarian,
        glutenFree: req.body.glutenFree,
        servings: req.body.servings,
        cuisines: req.body.cuisines,
        diets: req.body.diets,
        instructions: req.body.instructions
      }


      await DButils.execQuery(
  
        `INSERT INTO recipes (user_id,title,readyInMinutes,image,popularity,vegan,vegetarian, glutenFree,ingridients,instructions,servings ) VALUES (
          '${recipe_details.user_id}', '${recipe_details.title}', '${recipe_details.readyInMinutes}',
        '${recipe_details.image}', '${recipe_details.popularity}', '${recipe_details.email.vegan}', '${recipe_details.vegetarian}', '${recipe_details.glutenFree}', '${recipe_details.ingridients}', '${recipe_details.instructions}', '${recipe_details.servings}')`
  
      );
      res.status(201).send({ message: "recipe created", success: true });
    } catch (error) {
      next(error);
    }
  });








module.exports = router;
