const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT into FavoriteRecipes values (${recipe_id},${user_id})`);
   
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT id FROM FavoriteRecipes WHERE user_id=${user_id}`);
    return recipes_id;
}

//add to last watched recipes of user
async function markAsWatched(user_id, recipe_id){
    let users = [];
    console.log(user_id);
    console.log(recipe_id);
    users = await DButils.execQuery(`SELECT user_id from views WHERE id=${recipe_id} AND user_id=${user_id}`);
    console.log(users)
    if (users.length == []){
        await DButils.execQuery(`INSERT INTO views VALUES (${recipe_id},${user_id})`);
    }
}

//Get recipes ids from FamilyRecipes table
async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from FamilyRecipes where user_id=${user_id}`);
    return recipes_id;
}

//Get recipes ids from Recipes table
async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from Recipes where user_id=${user_id}`);
    return recipes_id;
}

async function getLastWatchedRecipes(user_id){

    const recipes_id = await DButils.execQuery(`SELECT ROW_NUMBER() OVER() AS num_row, id, user_id FROM views
    where user_id=${user_id}
    order by num_row desc limit 3;`);
    return recipes_id;

}


exports.getFamilyRecipes = getFamilyRecipes;
exports.markAsWatched = markAsWatched;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
