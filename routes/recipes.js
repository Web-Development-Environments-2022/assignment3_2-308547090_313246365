var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

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



//router.post("/recipe", async (req, res, next) => {


////router.post("/familyRecipe", async (req, res, next) => {
module.exports = router;
