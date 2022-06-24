const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id,user_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,servings ,extendedIngredients, instructions} = recipe_info.data;
    let IsFavorite = false;
    let WasWatched = false;
    if (user_id != undefined){
        IsFavorite = await GetIndication("FavoriteRecipes", recipe_info.data.id, user_id);
        WasWatched = await GetIndication("views", recipe_info.data.id, user_id);
    }
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings,
        ingredients: extendedIngredients,
        instructions: instructions,
        isFavorite: IsFavorite,
        wasWatched: WasWatched,


    }
}

async function getRecipesPreview(recipe_ids_list,user_id){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    info_res.map((recp)=>{console.log(recp.data)});
    return extractPreviewRecipeDetails(info_res,user_id);
}

// async?? 
function extractPreviewRecipeDetails(recipe_info,user_id){
    return Promise.all(
        recipe_info.map(async (recipe_info) =>{
            let data = recipe_info;
            let IsFavorite = false;
            let WasWatched = false;
            if (user_id != undefined){
                IsFavorite = await GetIndication("FavoriteRecipes", recipe_info.data.id, user_id);
                WasWatched = await GetIndication("views", recipe_info.data.id, user_id);
            }
            if(recipe_info.data!= null){
                data = recipe_info.data;
            }
            const {
                id,
                title,
                readyInMinutes,
                image,
                aggregateLikes,
                vegan,
                vegetarian,
                glutenFree,
            } = data;
            return {
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
                isFavorite: IsFavorite,
                wasWatched: WasWatched,
            }
        }) 
    )
}

async function getRandomRecipesFromAPI() {
    const response = await axios.get(`${api_domain}/random`,{
        params: {

            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    
    return response.data;
}


async function getRandomRecipes(){
    let my_random_list = await getRandomRecipesFromAPI();
    let my_random_list_ids = my_random_list.recipes.map((element) => (element.id)); //extracting the recipe ids into array

    return getRecipesPreview(my_random_list_ids);

    
}

async function getRecipesSearchPreview(recipe_ids_list,user_id){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    info_res.map((recp)=>{console.log(recp.data)});
    return extractSearchResultsDetails(info_res,user_id);
}

//=== search function to the spoonacular API =====
async function searchRecipes(query1, titleMatch1, number1 ,cuisine1, diet1, intolerances1) {


    const response =  await axios.get(`${api_domain}/complexSearch`,{
        params: {

            query: query1,
            titleMatch: titleMatch1,
            number: number1,
            cuisine: cuisine1,
            diet: diet1,
            intolerances: intolerances1,
            instructionsRequired : true,
            apiKey: process.env.spooncular_apiKey
        }
    });
        
    return response.data.results
}

//async??
function extractSearchResultsDetails(recipe_info,user_id){
    return Promise.all(
        recipe_info.map(async (recipe_info) =>{
            let data = recipe_info;
            IsFavorite = false;
            WasWatched = false;
            if (user_id != undefined){
                IsFavorite = await GetIndication("FavoriteRecipes", recipe_info.data.id, user_id);
                WasWatched = await GetIndication("views", recipe_info.data.id, user_id);
            }
            
            if(recipe_info.data!= null){
                data = recipe_info.data;
            }
            const {
                id,
                title,
                readyInMinutes,
                image,
                aggregateLikes,
                vegan,
                vegetarian,
                glutenFree,
                servings,
                cuisines,
                diets,
                analyzedInstructions
    
            } = data;
            return {
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
                servings: servings,
                cuisines: cuisines,
                diets: diets,
                instructions: analyzedInstructions,
                isFavorite: IsFavorite,
                wasWatched: WasWatched,
            }
        }) 
    )
    
}

async function getSearchResults(query1, titleMatch1, number1 ,cuisine1, diet1, intolerances1,user_id){

    let my_search_list = await searchRecipes(query1, titleMatch1, number1 ,cuisine1, diet1, intolerances1);
    let my_search_list_ids = my_search_list.map((element) => (element.id)); //extracting the recipe ids into array
    return await getRecipesSearchPreview(my_search_list_ids,user_id)

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

async function GetFromTable(tablename,user_id){
    recipes = await DButils.execQuery(`SELECT * FROM ${tablename} WHERE user_id=${user_id}`);
    return recipes;
    // return recipes.map(async (recipes) =>{
    //     let data = recipes;
    //     console.log(data)
    //     const {
    //         id,
    //         title,
    //         creator,
    //         eating_time,
    //         readyInMinutes,
    //         image,
    //         aggregateLikes,
    //         vegan,
    //         vegetarian,
    //         glutenFree,
    //         ingredients,
    //         instructions,
    //         servings,

    //     } = data;
    //     return {
    //         id: id,
    //         title: title,
    //         creator: creator,
    //         eating_time: eating_time,
    //         readyInMinutes: readyInMinutes,
    //         image: image,
    //         popularity: aggregateLikes,
    //         vegan: vegan,
    //         vegetarian: vegetarian,
    //         glutenFree: glutenFree,
    //         ingredients: ingredients,
    //         instructions: instructions,
    //         servings: servings,
    //     }
    // }
};

exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipes = searchRecipes;
exports.getSearchResults = getSearchResults;
exports.getRecipesPreview = getRecipesPreview;
exports.GetIndication = GetIndication;
exports.GetFromTable = GetFromTable;
exports.getRandomRecipes = getRandomRecipes;


