import { elements } from './base';
// import { limitRecipeTitle } from './searchView';


// change the view of the liked button once it is clicked
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

// handling the when items is liked at the toggle menu
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

// add the likes to the menu
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
        `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// remove the like from the like repo
export const deleteLike = id => {
    // remove the link element
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}