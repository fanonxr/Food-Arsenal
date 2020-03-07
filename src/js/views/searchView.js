import { elements } from './base';

// getting the value from the search field
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

// select the element based on the has
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link--active'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    // select all links based on an attribute
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

// method to shorten the title of the recipe
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        // split the title into an array and see how much words will be under the limit
        title.split(' ').reduce((acc, curr) => {
            // acc starts at 0 and will be added to the array
            if (acc + curr.length < limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);
        return `${newTitle.join('')}...`;
    }
    return title;
}

// render one recipe
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    // insert it to the html element
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}


// rendering the results to the views
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // display the results per page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // render 10 items per page
    recipes.slice(start, end).forEach(renderRecipe);

    // display the buttons
    renderButtons(page, recipes.length, resPerPage);
}

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // only Button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `
    } else if (page === pages) {
        // only to the prev page
        button = createButton(page - 1, 'prev');
    }

    // insert the element into the dom
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}