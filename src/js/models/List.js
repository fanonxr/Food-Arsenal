import uniqid from 'uniqid';
// shopping list class to hold all food objects
export default class List {
    // all elements will be pushed to the items array
    constructor() {
        this.items = [];
    }

    //  being able to delete the items
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count: count,
            unit: unit,
            ingredient: ingredient
        }
        // add the item to the array
        this.items.push(item);
        return item;
    }

    // being able to delete the id
    deleteItem(id) {
        // find the index of the item that we passed in
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    // method to update the count
    updateCount(id, newCount) {
        // change the item found to the new count thats passed in
        this.items.find(el => el.id === id).count = newCount;
    }


}