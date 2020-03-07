export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Perist data in localStorage
        // this.persistData();
    }

    // check to see if it has been liked or not
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    // method to get the total likes of the array
    getNumLikes() {
        return this.likes.length;
    }
}