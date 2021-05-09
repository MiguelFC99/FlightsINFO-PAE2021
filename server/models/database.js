const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
console.log(process.env.MONGO_URL);

let db;
let isConnecting;


class Database {

    collectionName;

    constructor() {

        if (isConnecting) return;

        isConnecting = true;

        MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log('Failed to connect to MongoDB',err);
                return;
            }
            db = client.db();
            console.log('Successfully connected to MongoDB')

        
        });
    }

    useCollection(name) {
        this.collectionName = name;
    }

    find(filters, cb) {
        const collection = db.collection(this.collectionName);
        return collection.find(filters).toArray(cb);
    }
    insertOne(filters) {
        const collection = db.collection(this.collectionName);
        return collection.insertOne(filters);
    }

    findOne(filters){
        const collection = db.collection(this.collectionName);
        return collection.findOne(filters);
    }
    updateOne(filters,updateData){
        const collection = db.collection(this.collectionName);
        return collection.updateOne(filters,updateData);
    }
}

module.exports = Database;