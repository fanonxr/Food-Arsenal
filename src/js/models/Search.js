import axios from 'axios';

// example url https://forkify-api.herokuapp.com/api/search?q=

/** Model search class to handle searching for recipies from user */
export default class Search {

    constructor(query) {
        this.query = query;

    }

    // method to handle making a asyncronous search to the API
    async getResults() {

        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes; // save recipes to the object

        } catch (err) {
            alert(err);
        }
    }
}