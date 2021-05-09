const Database = require("./database");



class Token extends Database {
    constructor(){
        super();
        this.useCollection('users_token');
    }
}

module.exports = new Token();