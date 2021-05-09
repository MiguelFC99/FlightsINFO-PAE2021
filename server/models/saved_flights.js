const Database = require("./database");



class SavedFlights extends Database {
    constructor(){
        super();
        this.useCollection('saved_flights');
    }
}

module.exports = new SavedFlights();