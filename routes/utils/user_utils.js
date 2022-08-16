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

async function getFamilyRecipeDetails(recipe_id,user_id) {
    let recipe_info = (await DButils.execQuery(`SELECT * FROM familyrecipes WHERE id=${recipe_id}`))[0];
    let IsFavorite = false;
    let WasWatched = false;
    if (user_id != undefined){
        IsFavorite = await GetIndication("FavoriteRecipes", recipe_info.id, user_id);
        WasWatched = await GetIndication("views", recipe_info.id, user_id);
    }
    return {
        id: recipe_info.id,
        creator: recipe_info.creator,
        eating_time: recipe_info.eating_time,
        title: recipe_info.title,
        readyInMinutes: recipe_info.readyInMinutes,
        image: recipe_info.image,
        popularity: recipe_info.popularity,
        vegan: recipe_info.vegan,
        vegetarian: recipe_info.vegetarian,
        glutenFree: recipe_info.glutenFree,
        servings: recipe_info.servings,
        ingredients: recipe_info.ingridients,
        instructions: recipe_info.instructions,
        isFavorite: recipe_info.IsFavorite,
        wasWatched: recipe_info.WasWatched,
    }
}

//Check if a user_id - Recipe_id combination exists in a given table name
async function GetIndication(tablename, recipe_id, user_id){
    let users = [];
    users = await DButils.execQuery(`SELECT user_id FROM ${tablename} WHERE id=${recipe_id} AND user_id=${user_id}`);
    if (users.length != 0){
        return true;
    }
    return false;
}



exports.getFamilyRecipes = getFamilyRecipes;
exports.markAsWatched = markAsWatched;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getFamilyRecipeDetails = getFamilyRecipeDetails;
exports.GetIndication = GetIndication;
