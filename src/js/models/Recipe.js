import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    // method to get the entire recipe from the api

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Error fetching the data');
        }
    }

    // method to calculate the cook time
    calcTime() {
        // assuming that we need 15 mins for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    // calcuating the servings
    calcServings() {
        this.servings = 4;
    }

    // method to parse the ingredients within the original ingredeints
    parseIngredients() {
        // the units to parse too
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // uniform the units
            let ingredient = el.toLowerCase();
            // loop over the long units and replace them with the short units based on where it is in the array
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // remove parentheses
            ingredient = ingredient.replace("/ *\([^])*\) */g", ' ');

            // parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            // return the index of the position where it finds the matching measurement
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            // check for measurment edge cases
            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex); // Ex. 4 1/2 ia [4, 1/2] -> eval("4+4.5")
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit, but firs element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // there is no unit found
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                };
            }
            return objIng;
        });

        this.ingredients = newIngredients;
    }

    // method to update the servings
    updateServings(type) {
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}