
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    db: null,
    connect(dbUri) {
        return MongoClient.connect(dbUri)
            .then(db => {
                this.db = db;
                return db;
            });
    }
};