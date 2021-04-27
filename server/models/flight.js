const Database = require("./database");



class Flight extends Database {
    constructor(){
        super();
        //this.useCollection('flights');
    }
}

module.exports = new Flight();