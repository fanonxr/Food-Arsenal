import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global controller to connect models to the views

/** Global State of the application
 * Search object
 * Current Recipe objects
 * Shopping cart objects
 * Liked Recipes
*/
const state = {};
// window.state = state;

/**Search controller */
const controlSearch = async () => {
    // get the query from the view
    const query = searchView.getInput();

    // create a new search object based on the query
    if (query) {
        state.search = new Search(query);

        // clear the search input and display a loading spinner
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // search for the recipes
            await state.search.getResults();

            // 5) display the result to the UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            console.log("Error with Search Controller")
            alert("Something wrong with the search...");
            clearLoader();
        }

    }
}

// get the search form from the UI
elements.searchForm.addEventListener('submit', e => {
    // prevent page from reloading
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/** Recipe Controller */

const controlRecipe = async () => {
    // get the hash id from url based on what was clicked
    const id = window.location.hash.replace('#', '');

    // check if we have an id
    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // when the result is searched highlight the selected item
        if (state.search) searchView.highlightSelected(id);

        // create recipe objects
        state.recipe = new Recipe(id);

        // window.r = state.recipe;

        try {
            // get recipe data
            await state.recipe.getRecipe();

            // parse the ingredits
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            console.log("Error from recipe controller")
            alert(err.message);
        }
    }
};

/** List Controller */
const controlList = () => {
    // create a new list if there is none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        // add to the user interface
        listView.renderItem(item);
    });
}

// handle delete and upadte list item events

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; // get the id based on the click
    // handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        // remove from the view
        listView.deleteItem(id);

        // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        // the element that was clicked
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/** Likes controller */

// testings
state.likes = new Likes();


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id; // get the id

    // recipe has not been liked
    if (!state.likes.isLiked(currentId)) {
        // add like to state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to UI list
        likesView.renderLike(newLike);

        // the recipe is liked.
    } else {
        // remove like from state and
        state.likes.deleteLike(currentId);

        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove the like from the UI
        likesView.deleteLike(currentId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// event delegation

// get the id from the hash and execute hash and load events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            // update the view with the decrease nums
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increased button clicked
        state.recipe.updateServings('inc');
        // update the view with the increase nums
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // when the add button is selected
        controlList();
    } else if (e.target.matches('.recipe__love .recipe__love *')) {
        // like controller
        controlLike();
    }

});

