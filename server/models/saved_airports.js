const Database = require("./database");



class SavedAirports extends Database {
    constructor(){
        super();
        this.useCollection('saved_airports');
    }
}

module.exports = new SavedAirports();