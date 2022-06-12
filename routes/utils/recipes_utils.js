const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



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



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,servings ,extendedIngredients, instructions} = recipe_info.data;

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
        instructions: instructions

    }
}

async function getRecipesPreview(recipe_ids_list){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    info_res.map((recp)=>{console.log(recp.data)});
    return extractPreviewRecipeDetails(info_res);
}

TODO: 
function extractPreviewRecipeDetails(recipe_info){
    return recipe_info.map((recipe_info) =>{
        let data = recipe_info;

        
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
    
        }
    }) 
}

async function getRandomRecipes() {
    const response = await axios.get(`${api_domain}/random`,{
        params: {

            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}


async function getRecipesSearchPreview(recipe_ids_list){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    info_res.map((recp)=>{console.log(recp.data)});
    return extractSearchResultsDetails(info_res);
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


function extractSearchResultsDetails(recipe_info){
    return recipe_info.map((recipe_info) =>{
        let data = recipe_info;

        
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
            instructions: analyzedInstructions
    
        }
    }) 
}

async function getSearchResults(query1, titleMatch1, number1 ,cuisine1, diet1, intolerances1){

    let my_search_list = await searchRecipes(query1, titleMatch1, number1 ,cuisine1, diet1, intolerances1) 
    let my_search_list_ids = my_search_list.map((element) => (element.id)); //extracting the recipe ids into array
    return await getRecipesSearchPreview(my_search_list_ids)

}




exports.getRandomRecipes =getRandomRecipes;
exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipes = searchRecipes;
exports.getSearchResults = getSearchResults;



