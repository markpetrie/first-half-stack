
const connection = require('../db');
const notFound = require('../utils/not-found');

module.exports = function support(req, res) {
    const support = connection.db.collection('support');

    if (req.method === 'POST') {
        support.insert(req.body)
            .then(result => result.ops[0])
            .then(saved => {
                res.end(JSON.stringify(saved));
            })
            .catch(console.log);
    }
    else if (req.method === 'GET') {
        support.find({})
            .toArray()
            .then(support => res.end(JSON.stringify(support)))
            .catch(console.log);
    }
    else {
        notFound(req, res);
    }
};