const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
   
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

//add to last watched recipes of user
async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`insert into views values ('${user_id}',${recipe_id})`);
}

//get watched recipe of user
async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from views where user_id='${user_id}'`);
    return recipes_id;
}

async function getFamilyRecipes(user_id){
    const recipes = await DButils.execQuery(`select * from FamilyRecipes where user_id='${user_id}'`);
    return recipes;
}

exports.getFamilyRecipes = getFamilyRecipes;
exports.markAsWatched = markAsWatched;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getWatchedRecipes = getWatchedRecipes;



