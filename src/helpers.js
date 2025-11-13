export default async function getSearch(url) {
  // getting data from api
  const res = await fetch(url);

  const data = await res.json();
  if (data.meals === null) throw new Error("Food not found!");

  // pushing ingredients to an array because the api's ingredients wasn't in array and had to many null and empty string in its ingredients so i made an array of ingredients by myself
  const ing = [];
  for (const i of Object.entries(data.meals[0])) {
    if (i[0].startsWith("strIngredient")) {
      ing.push(i[1]);
    }
  }

  const ingredients = ing.filter((ing) => ing);

  // making a new object for every searched meal
  const mainData = data.meals[0];
  const newSearch = {
    idMeal: mainData.idMeal,
    strArea: mainData.strArea,
    strCategory: mainData.strCategory,
    strInstructions: mainData.strInstructions,
    ingredients: ingredients,
    titleMeal: mainData.strMeal,
    imageMeal: mainData.strMealThumb,
  };

  return newSearch;
}
